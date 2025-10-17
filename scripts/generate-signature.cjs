const crypto = require('crypto');

const payload = JSON.stringify({ message: 'Hello from Vauntico' });
const timestamp = '2025-10-16T23:30:00Z';
const secret = 'vauntico-secret-2025';

const data = `${timestamp}.${payload}`;
const signature = crypto.createHmac('sha256', secret).update(data).digest('hex');

console.log('✅ Generated signature:', signature);