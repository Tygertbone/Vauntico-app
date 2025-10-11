/**
 * ========================================
 * VAUNTICO SUBSCRIPTION SERVICE
 * Sacred Gateway Between Mortal Payments and Divine Access
 * ========================================
 * 
 * This is the heart of Vauntico's persistence layer.
 * Every sacred transmission flows through these gates.
 */

const crypto = require('crypto');
const { Pool } = require('pg');
const Redis = require('ioredis');

class SubscriptionService {
    constructor(options = {}) {
        this.db = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        });
        
        // Redis for caching and offline resilience
        this.redis = new Redis(process.env.REDIS_URL, {
            retryDelayOnFailover: 100,
            maxRetriesPerRequest: 3,
            lazyConnect: true
        });
        
        // Configuration
        this.config = {
            paystackSecretKey: process.env.PAYSTACK_SECRET_KEY,
            paystackPublicKey: process.env.PAYSTACK_PUBLIC_KEY,
            cacheTimeout: options.cacheTimeout || 3600, // 1 hour
            maxRetryAttempts: options.maxRetryAttempts || 3,
            offlineGracePeriod: options.offlineGracePeriod || 86400 // 24 hours
        };
    }

    /**
     * ========================================
     * SACRED SUBSCRIPTION MANAGEMENT
     * ========================================
     */

    /**
     * Create or update user subscription after payment
     */
    async createSubscription(paystackData) {
        const client = await this.db.connect();
        
        try {
            await client.query('BEGIN');

            // Extract user info from Paystack data
            const email = paystackData.customer.email;
            const subscriptionCode = paystackData.subscription_code;
            const planCode = paystackData.plan.plan_code;
            
            // Find or create user
            let user = await this.findOrCreateUser(client, email);
            
            // Map Paystack plan to our tiers
            const tierMapping = {
                'vauntico-seeker': 'seeker',
                'vauntico-alchemist': 'alchemist', 
                'vauntico-oracle': 'oracle'
            };
            
            const tierId = tierMapping[planCode] || 'seeker';
            
            // Create subscription record
            const subscription = await client.query(`
                INSERT INTO user_subscriptions (
                    user_id, tier_id, paystack_customer_code, paystack_subscription_code,
                    paystack_authorization_code, status, billing_cycle, amount_cents,
                    current_period_start, current_period_end, metadata
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING *
            `, [
                user.id,
                tierId,
                paystackData.customer.customer_code,
                subscriptionCode,
                paystackData.authorization?.authorization_code,
                'active',
                paystackData.plan.interval || 'monthly',
                paystackData.amount,
                new Date(),
                this.calculatePeriodEnd(paystackData.plan.interval),
                JSON.stringify({ paystackData })
            ]);

            await client.query('COMMIT');
            
            // Cache the subscription for offline access
            await this.cacheSubscription(user.id, subscription.rows[0]);
            
            // Update user's ascension phase
            await this.updateUserAscensionPhase(user.id, tierId);
            
            console.log(`🏛️ Sacred subscription activated: ${email} → ${tierId}`);
            
            return {
                success: true,
                subscription: subscription.rows[0],
                user: user
            };

        } catch (error) {
            await client.query('ROLLBACK');
            console.error('❌ Subscription creation failed:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * ========================================
     * SACRED ACCESS CONTROL
     * ========================================
     */

    /**
     * Check if user has access to specific Codex content
     * WITH OFFLINE RESILIENCE AND GRACEFUL FALLBACKS
     */
    async checkCodexAccess(userId, codexType, codexWeek = null, codexDrop = null, options = {}) {
        const startTime = Date.now();
        const cacheKey = `codex_access:${userId}:${codexType}:${codexWeek}:${codexDrop}`;
        
        try {
            // 1. Try cache first (for speed and offline resilience)
            const cachedResult = await this.getCachedAccess(cacheKey);
            if (cachedResult !== null) {
                console.log(`⚡ Cache hit for ${userId} accessing ${codexType}`);
                return cachedResult;
            }

            // 2. Check database with retry logic
            const accessResult = await this.checkDatabaseAccess(userId, codexType, codexWeek, codexDrop);
            
            // 3. Cache the result
            await this.cacheAccessResult(cacheKey, accessResult);
            
            // 4. Log access attempt
            await this.logCodexAccess(userId, codexType, codexWeek, codexDrop, accessResult, options);
            
            const duration = Date.now() - startTime;
            console.log(`🔍 Access check completed in ${duration}ms: ${accessResult.granted ? '✅' : '❌'}`);
            
            return accessResult;

        } catch (error) {
            console.error('❌ Access check failed:', error);
            
            // GRACEFUL FALLBACK: Check for cached emergency access
            const emergencyAccess = await this.getEmergencyAccess(userId, codexType);
            if (emergencyAccess) {
                console.log(`🆘 Emergency access granted for ${userId}`);
                return emergencyAccess;
            }
            
            // Last resort: Allow free content only
            return {
                granted: codexType === 'free',
                reason: 'system_error_fallback',
                tier: 'unknown',
                emergency: true
            };
        }
    }

    /**
     * Check database for subscription access
     */
    async checkDatabaseAccess(userId, codexType, codexWeek, codexDrop) {
        let attempt = 0;
        const maxAttempts = this.config.maxRetryAttempts;
        
        while (attempt < maxAttempts) {
            try {
                const result = await this.db.query(`
                    SELECT check_codex_access($1, $2, $3, $4) as granted
                `, [userId, codexType, codexWeek, codexDrop]);
                
                const granted = result.rows[0]?.granted || false;
                
                // Get subscription details for context
                const subscription = await this.getUserSubscription(userId);
                
                return {
                    granted,
                    reason: granted ? 'subscription_valid' : 'subscription_insufficient',
                    tier: subscription?.tier_id || 'free',
                    subscriptionStatus: subscription?.status,
                    expiresAt: subscription?.current_period_end
                };

            } catch (error) {
                attempt++;
                console.error(`❌ Database access attempt ${attempt} failed:`, error.message);
                
                if (attempt < maxAttempts) {
                    // Exponential backoff
                    const delay = Math.pow(2, attempt) * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    throw error;
                }
            }
        }
    }

    /**
     * ========================================
     * OFFLINE RESILIENCE & CACHING
     * ========================================
     */

    /**
     * Cache subscription data for offline access
     */
    async cacheSubscription(userId, subscription) {
        try {
            const cacheKey = `subscription:${userId}`;
            const cacheData = {
                ...subscription,
                cached_at: new Date().toISOString(),
                cache_expires_at: new Date(Date.now() + (this.config.cacheTimeout * 1000)).toISOString()
            };
            
            await this.redis.setex(cacheKey, this.config.cacheTimeout, JSON.stringify(cacheData));
            
            // Also cache access permissions for common scenarios
            const accessScenarios = [
                { type: 'free', week: null, drop: null },
                { type: 'daily', week: 1, drop: 1 },
                { type: 'archive', week: null, drop: null }
            ];
            
            for (const scenario of accessScenarios) {
                const accessKey = `codex_access:${userId}:${scenario.type}:${scenario.week}:${scenario.drop}`;
                const granted = await this.evaluateAccessPermission(subscription, scenario.type);
                
                await this.redis.setex(accessKey, this.config.cacheTimeout, JSON.stringify({
                    granted,
                    tier: subscription.tier_id,
                    cached_at: new Date().toISOString()
                }));
            }
            
        } catch (error) {
            console.error('❌ Failed to cache subscription:', error);
            // Don't throw - caching failure shouldn't break the flow
        }
    }

    /**
     * Get cached access result
     */
    async getCachedAccess(cacheKey) {
        try {
            const cached = await this.redis.get(cacheKey);
            if (cached) {
                const data = JSON.parse(cached);
                // Check if cache is still valid
                if (new Date(data.cached_at).getTime() + (this.config.cacheTimeout * 1000) > Date.now()) {
                    return data;
                }
            }
            return null;
        } catch (error) {
            console.error('❌ Cache retrieval failed:', error);
            return null;
        }
    }

    /**
     * Emergency access for when systems are down
     */
    async getEmergencyAccess(userId, codexType) {
        try {
            const emergencyKey = `emergency_access:${userId}`;
            const cached = await this.redis.get(emergencyKey);
            
            if (cached) {
                const data = JSON.parse(cached);
                const gracePeriod = this.config.offlineGracePeriod * 1000;
                
                // Allow access if within grace period
                if (Date.now() - new Date(data.last_successful_access).getTime() < gracePeriod) {
                    return {
                        granted: data.last_tier !== 'free' || codexType === 'free',
                        reason: 'emergency_access_granted',
                        tier: data.last_tier,
                        emergency: true,
                        grace_period_expires: new Date(
                            new Date(data.last_successful_access).getTime() + gracePeriod
                        ).toISOString()
                    };
                }
            }
            
            return null;
        } catch (error) {
            console.error('❌ Emergency access check failed:', error);
            return null;
        }
    }

    /**
     * ========================================
     * PAYSTACK WEBHOOK HANDLING
     * ========================================
     */

    /**
     * Process Paystack webhook events
     */
    async processWebhookEvent(event, signature) {
        // Verify webhook signature
        if (!this.verifyWebhookSignature(event, signature)) {
            throw new Error('Invalid webhook signature');
        }

        const eventType = event.event;
        console.log(`📡 Processing Paystack webhook: ${eventType}`);

        try {
            switch (eventType) {
                case 'subscription.create':
                    return await this.handleSubscriptionCreate(event.data);
                    
                case 'subscription.not_renew':
                case 'subscription.disable':
                    return await this.handleSubscriptionCancel(event.data);
                    
                case 'invoice.payment_failed':
                    return await this.handlePaymentFailed(event.data);
                    
                case 'charge.success':
                    return await this.handleChargeSuccess(event.data);
                    
                default:
                    console.log(`ℹ️ Unhandled webhook event: ${eventType}`);
                    return { processed: false, reason: 'unhandled_event' };
            }
        } catch (error) {
            console.error(`❌ Webhook processing failed for ${eventType}:`, error);
            throw error;
        }
    }

    /**
     * Verify Paystack webhook signature
     */
    verifyWebhookSignature(event, signature) {
        const hash = crypto
            .createHmac('sha512', this.config.paystackSecretKey)
            .update(JSON.stringify(event))
            .digest('hex');
            
        return hash === signature;
    }

    /**
     * ========================================
     * SUBSCRIPTION LIFECYCLE MANAGEMENT
     * ========================================
     */

    /**
     * Handle subscription creation
     */
    async handleSubscriptionCreate(data) {
        console.log('🎉 New subscription created:', data.customer.email);
        return await this.createSubscription(data);
    }

    /**
     * Handle subscription cancellation
     */
    async handleSubscriptionCancel(data) {
        const client = await this.db.connect();
        
        try {
            await client.query(`
                UPDATE user_subscriptions 
                SET status = 'cancelled', cancelled_at = NOW()
                WHERE paystack_subscription_code = $1
            `, [data.subscription_code]);
            
            // Clear cache
            const user = await this.findUserBySubscriptionCode(data.subscription_code);
            if (user) {
                await this.clearUserCache(user.id);
                console.log(`❌ Subscription cancelled: ${user.email}`);
            }
            
            return { success: true, action: 'cancelled' };
            
        } finally {
            client.release();
        }
    }

    /**
     * ========================================
     * UTILITY METHODS
     * ========================================
     */

    /**
     * Find or create user by email
     */
    async findOrCreateUser(client, email) {
        let result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            result = await client.query(`
                INSERT INTO users (email, ascension_phase) 
                VALUES ($1, 'seeker') 
                RETURNING *
            `, [email]);
        }
        
        return result.rows[0];
    }

    /**
     * Get user's current subscription
     */
    async getUserSubscription(userId) {
        const result = await this.db.query(`
            SELECT us.*, st.name as tier_name, st.features, st.limits
            FROM user_subscriptions us
            JOIN subscription_tiers st ON us.tier_id = st.id
            WHERE us.user_id = $1 AND us.status = 'active'
            ORDER BY us.created_at DESC
            LIMIT 1
        `, [userId]);
        
        return result.rows[0] || null;
    }

    /**
     * Log access attempt for analytics
     */
    async logCodexAccess(userId, codexType, codexWeek, codexDrop, accessResult, options = {}) {
        try {
            await this.db.query(`
                INSERT INTO codex_access_log 
                (user_id, codex_type, codex_week, codex_drop, access_granted, denial_reason, ip_address, user_agent)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `, [
                userId, codexType, codexWeek, codexDrop,
                accessResult.granted, accessResult.reason,
                options.ipAddress, options.userAgent
            ]);
        } catch (error) {
            console.error('❌ Failed to log access:', error);
            // Don't throw - logging failure shouldn't break access
        }
    }

    /**
     * Calculate subscription period end
     */
    calculatePeriodEnd(interval) {
        const now = new Date();
        if (interval === 'annually') {
            return new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
        }
        // Default to monthly
        return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    }

    /**
     * Close connections gracefully
     */
    async close() {
        await this.db.end();
        await this.redis.quit();
    }
}

module.exports = SubscriptionService;