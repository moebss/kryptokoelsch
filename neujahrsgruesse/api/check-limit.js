// ===========================
// API: Check Limit
// Rate-Limiting + Fingerprint-Tracking
// ===========================

// In-Memory Rate-Limiter (für Vercel Serverless)
const rateLimitMap = new Map();

function cleanupOldEntries() {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    for (const [key, value] of rateLimitMap.entries()) {
        if (value.timestamp < oneDayAgo) {
            rateLimitMap.delete(key);
        }
    }
}

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { fingerprint, timestamp } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Anti-Replay: Check timestamp (prevent replay attacks)
    const requestAge = Date.now() - timestamp;
    if (requestAge > 60000 || requestAge < -60000) { // 1 minute tolerance
        return res.status(400).json({ error: 'Invalid timestamp' });
    }

    // Cleanup old entries
    cleanupOldEntries();

    // Unique key: Kombination aus IP + Fingerprint
    const uniqueKey = `${ip}:${fingerprint}`;
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `${uniqueKey}:${today}`;

    // Get current count
    const cached = rateLimitMap.get(cacheKey);
    const currentCount = cached ? cached.count : 0;

    const dailyLimit = 3;
    const remaining = Math.max(0, dailyLimit - currentCount);

    // Rate-Limit check
    if (currentCount >= dailyLimit) {
        return res.status(429).json({
            allowed: false,
            count: currentCount,
            remaining: 0,
            message: 'Daily limit reached'
        });
    }

    // Update count
    rateLimitMap.set(cacheKey, {
        count: currentCount,
        timestamp: Date.now(),
        ip: ip,
        fingerprint: fingerprint
    });

    // Supabase logging (optional - for persistent storage)
    try {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey) {
            await fetch(`${supabaseUrl}/rest/v1/greeting_usage`, {
                method: 'POST',
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'resolution=merge-duplicates'
                },
                body: JSON.stringify({
                    fingerprint: fingerprint,
                    ip_address: ip,
                    date: today,
                    count: currentCount,
                    timestamp: new Date().toISOString()
                })
            });
        }
    } catch (err) {
        // Non-critical - continue even if logging fails
        console.error('Supabase logging failed:', err);
    }

    return res.status(200).json({
        allowed: true,
        count: currentCount,
        remaining: remaining
    });
}
