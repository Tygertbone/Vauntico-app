-- ========================================
-- VAUNTICO PRODUCTION DATABASE SCHEMA
-- Sacred Architecture for Legacy Systems
-- ========================================

-- Users table - The foundation of all identity
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP,
    password_hash VARCHAR(255), -- Optional for OAuth users
    profile JSONB DEFAULT '{}', -- Flexible profile data
    preferences JSONB DEFAULT '{}', -- User preferences
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_active_at TIMESTAMP DEFAULT NOW(),
    
    -- Sacred user metadata
    ascension_phase VARCHAR(50) DEFAULT 'seeker', -- seeker, alchemist, oracle
    spiritual_alignment JSONB DEFAULT '{}', -- Custom spiritual profile
    legacy_score INTEGER DEFAULT 0, -- Gamification element
    
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
    CONSTRAINT valid_phase CHECK (ascension_phase IN ('seeker', 'alchemist', 'oracle', 'transcendant'))
);

-- Subscription tiers - The sacred pricing architecture  
CREATE TABLE subscription_tiers (
    id VARCHAR(50) PRIMARY KEY, -- 'seeker', 'alchemist', 'oracle'
    name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    price_monthly_cents INTEGER NOT NULL,
    price_annual_cents INTEGER,
    paystack_plan_code VARCHAR(100), -- Paystack integration
    features JSONB NOT NULL DEFAULT '[]',
    limits JSONB NOT NULL DEFAULT '{}', -- Access limits per tier
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User subscriptions - The binding contracts
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tier_id VARCHAR(50) NOT NULL REFERENCES subscription_tiers(id),
    
    -- Paystack integration fields
    paystack_customer_code VARCHAR(100),
    paystack_subscription_code VARCHAR(100) UNIQUE,
    paystack_authorization_code VARCHAR(100),
    
    -- Subscription state
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, active, cancelled, expired, suspended
    billing_cycle VARCHAR(20) DEFAULT 'monthly', -- monthly, annual
    amount_cents INTEGER NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    
    -- Dates
    trial_ends_at TIMESTAMP,
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancelled_at TIMESTAMP,
    expires_at TIMESTAMP,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT valid_status CHECK (status IN ('pending', 'active', 'cancelled', 'expired', 'suspended', 'trial')),
    CONSTRAINT valid_billing_cycle CHECK (billing_cycle IN ('monthly', 'annual')),
    CONSTRAINT unique_active_subscription UNIQUE (user_id) WHERE status = 'active'
);

-- Codex access log - Track sacred transmission delivery
CREATE TABLE codex_access_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES user_subscriptions(id),
    
    -- Access details
    codex_type VARCHAR(50) NOT NULL, -- 'daily', 'archive', 'premium'
    codex_week INTEGER,
    codex_drop INTEGER,
    access_granted BOOLEAN DEFAULT FALSE,
    denial_reason VARCHAR(255), -- If access denied
    
    -- Session information
    ip_address INET,
    user_agent TEXT,
    device_fingerprint VARCHAR(255),
    
    -- Timing
    accessed_at TIMESTAMP DEFAULT NOW(),
    
    -- Offline resilience
    cached_until TIMESTAMP, -- When cached access expires
    retry_count INTEGER DEFAULT 0,
    
    INDEX idx_user_access (user_id, accessed_at),
    INDEX idx_codex_access (codex_type, codex_week, codex_drop),
    INDEX idx_subscription_access (subscription_id, accessed_at)
);

-- Payment events - Sacred transaction history
CREATE TABLE payment_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES user_subscriptions(id),
    
    -- Paystack webhook data
    paystack_event_type VARCHAR(100) NOT NULL,
    paystack_transaction_id VARCHAR(100),
    paystack_reference VARCHAR(100) UNIQUE,
    
    -- Payment details
    event_type VARCHAR(50) NOT NULL, -- subscription.create, charge.success, etc.
    amount_cents INTEGER,
    currency VARCHAR(10),
    status VARCHAR(50),
    
    -- Raw webhook payload for debugging
    webhook_payload JSONB,
    processed_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_user_payments (user_id, created_at),
    INDEX idx_paystack_events (paystack_event_type, created_at),
    INDEX idx_payment_status (status, created_at)
);

-- Sacred session management - For authentication
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255) UNIQUE,
    
    -- Session metadata
    ip_address INET,
    user_agent TEXT,
    device_name VARCHAR(255),
    
    -- Expiration
    expires_at TIMESTAMP NOT NULL,
    last_used_at TIMESTAMP DEFAULT NOW(),
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_user_sessions (user_id, expires_at),
    INDEX idx_session_token (session_token),
    INDEX idx_refresh_token (refresh_token)
);

-- ========================================
-- SACRED INDEXES FOR PERFORMANCE
-- ========================================

-- User lookup optimization
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(last_active_at) WHERE last_active_at > NOW() - INTERVAL '30 days';

-- Subscription queries
CREATE INDEX idx_subscriptions_active ON user_subscriptions(user_id, status, current_period_end) 
    WHERE status = 'active';
CREATE INDEX idx_subscriptions_paystack ON user_subscriptions(paystack_subscription_code) 
    WHERE paystack_subscription_code IS NOT NULL;

-- Access control
CREATE INDEX idx_codex_access_recent ON codex_access_log(user_id, accessed_at) 
    WHERE accessed_at > NOW() - INTERVAL '7 days';

-- ========================================
-- SACRED FUNCTIONS FOR BUSINESS LOGIC
-- ========================================

-- Check if user has access to specific Codex content
CREATE OR REPLACE FUNCTION check_codex_access(
    p_user_id UUID,
    p_codex_type VARCHAR(50),
    p_codex_week INTEGER DEFAULT NULL,
    p_codex_drop INTEGER DEFAULT NULL
) 
RETURNS BOOLEAN AS $$
DECLARE
    v_subscription user_subscriptions%ROWTYPE;
    v_tier subscription_tiers%ROWTYPE;
    v_has_access BOOLEAN := FALSE;
BEGIN
    -- Get active subscription
    SELECT * INTO v_subscription
    FROM user_subscriptions 
    WHERE user_id = p_user_id 
        AND status = 'active' 
        AND (expires_at IS NULL OR expires_at > NOW())
        AND current_period_end > NOW();
    
    -- No active subscription - only free content
    IF NOT FOUND THEN
        RETURN p_codex_type = 'free';
    END IF;
    
    -- Get tier details
    SELECT * INTO v_tier
    FROM subscription_tiers
    WHERE id = v_subscription.tier_id;
    
    -- Apply tier-based access logic
    IF v_tier.id = 'seeker' THEN
        v_has_access := p_codex_type IN ('free', 'daily');
    ELSIF v_tier.id = 'alchemist' THEN
        v_has_access := p_codex_type IN ('free', 'daily', 'archive');
    ELSIF v_tier.id = 'oracle' THEN
        v_has_access := TRUE; -- Full access
    END IF;
    
    RETURN v_has_access;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- INITIAL SACRED DATA
-- ========================================

INSERT INTO subscription_tiers (id, name, display_name, description, price_monthly_cents, price_annual_cents, features, limits, sort_order) VALUES
('free', 'Free', 'Seeker (Free)', 'Basic Codex access for spiritual seekers', 0, 0, 
    '["Free Codex samples", "Community access", "Email support"]',
    '{"daily_transmissions": 0, "archive_access": false, "premium_content": false}', 
    1),
    
('seeker', 'Seeker', 'Seeker', 'Daily personalized transmissions', 900, 9600, 
    '["Daily personalized transmission", "Morning alignment prompt", "Access to transmission archive", "Email delivery"]',
    '{"daily_transmissions": 1, "archive_access": true, "premium_content": false}', 
    2),
    
('alchemist', 'Alchemist', 'Alchemist', 'Advanced spiritual transformation tools', 2900, 31200, 
    '["Everything in Seeker", "AI-voiced meditations (weekly)", "Personalized insight reports", "Moon phase rituals", "Priority support"]',
    '{"daily_transmissions": 1, "archive_access": true, "premium_content": true, "ai_meditations": true}', 
    3),
    
('oracle', 'Oracle', 'Oracle', 'Ultimate legacy builder access', 7900, 85200, 
    '["Everything in Alchemist", "Quarterly Legacy Reports", "Your journey mapped & analyzed", "Private community access", "Early access to new rituals", "1:1 monthly guidance call"]',
    '{"daily_transmissions": 1, "archive_access": true, "premium_content": true, "ai_meditations": true, "legacy_reports": true, "private_community": true, "guidance_calls": true}', 
    4);

-- Sacred triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tiers_updated_at BEFORE UPDATE ON subscription_tiers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();