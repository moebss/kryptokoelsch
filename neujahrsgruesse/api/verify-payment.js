// ===========================
// VERIFY PAYMENT API
// Verifies Stripe payment and returns details
// ===========================

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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

    const { sessionId } = req.body;

    if (!sessionId) {
        return res.status(400).json({ error: 'Session ID required' });
    }

    try {
        // Retrieve the session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== 'paid') {
            return res.status(400).json({
                success: false,
                error: 'Payment not completed'
            });
        }

        // Extract metadata
        const metadata = session.metadata || {};
        const type = metadata.type || 'unknown';
        const amount = metadata.amount;

        return res.status(200).json({
            success: true,
            type: type,
            amount: session.amount_total,
            currency: session.currency,
            customerEmail: session.customer_email,
            metadata: metadata
        });

    } catch (err) {
        console.error('Payment verification error:', err);
        return res.status(500).json({
            success: false,
            error: err.message || 'Verification failed'
        });
    }
}
