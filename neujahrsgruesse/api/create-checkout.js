// ===========================
// STRIPE CHECKOUT API
// Creates Stripe Checkout Sessions
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

    const { priceId, mode, metadata } = req.body;

    // Validate input
    if (!priceId || !mode) {
        return res.status(400).json({
            error: 'Missing required fields: priceId and mode'
        });
    }

    // Validate mode
    if (!['payment', 'subscription'].includes(mode)) {
        return res.status(400).json({
            error: 'Mode must be either "payment" or "subscription"'
        });
    }

    try {
        const origin = req.headers.origin || 'https://neujahrsgruss2026.de';

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            mode: mode,
            line_items: [{
                price: priceId,
                quantity: 1
            }],
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/?canceled=true`,
            automatic_tax: { enabled: true },
            billing_address_collection: 'required',
            metadata: metadata || {},
            invoice_creation: mode === 'payment' ? {
                enabled: true
            } : undefined
        });

        return res.status(200).json({
            url: session.url,
            sessionId: session.id
        });

    } catch (err) {
        console.error('Stripe error:', err);
        return res.status(500).json({
            error: err.message || 'Failed to create checkout session'
        });
    }
}
