// ===========================
// STRIPE WEBHOOK
// Handles payment confirmations
// ===========================

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export const config = {
    api: {
        bodyParser: false, // Disable body parsing, need raw body for webhook
    },
};

// Helper to get raw body
async function getRawBody(req) {
    return new Promise((resolve, reject) => {
        let buffer = '';
        req.on('data', chunk => {
            buffer += chunk;
        });
        req.on('end', () => {
            resolve(Buffer.from(buffer));
        });
        req.on('error', reject);
    });
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error('⚠️ Webhook secret not configured');
        return res.status(500).json({ error: 'Webhook not configured' });
    }

    let event;

    try {
        const rawBody = await getRawBody(req);
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err) {
        console.error('⚠️ Webhook signature verification failed:', err.message);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    // Handle the event
    try {
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutCompleted(event.data.object);
                break;

            case 'customer.subscription.created':
            case 'customer.subscription.updated':
                await handleSubscriptionUpdate(event.data.object);
                break;

            case 'customer.subscription.deleted':
                await handleSubscriptionCanceled(event.data.object);
                break;

            case 'payment_intent.succeeded':
                console.log('✅ Payment succeeded:', event.data.object.id);
                break;

            case 'payment_intent.payment_failed':
                console.log('❌ Payment failed:', event.data.object.id);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return res.status(200).json({ received: true });

    } catch (err) {
        console.error('Error handling webhook:', err);
        return res.status(500).json({ error: 'Webhook handler failed' });
    }
}

// Handle successful checkout
async function handleCheckoutCompleted(session) {
    console.log('🎉 Checkout completed:', session.id);

    const metadata = session.metadata || {};
    const customerEmail = session.customer_email;

    // Log to Supabase (optional)
    try {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey) {
            await fetch(`${supabaseUrl}/rest/v1/payments`, {
                method: 'POST',
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session_id: session.id,
                    customer_email: customerEmail,
                    amount: session.amount_total,
                    currency: session.currency,
                    payment_status: session.payment_status,
                    metadata: metadata,
                    created_at: new Date().toISOString()
                })
            });

            console.log('✅ Payment logged to Supabase');
        }
    } catch (err) {
        console.error('Failed to log payment:', err);
    }
}

// Handle subscription updates
async function handleSubscriptionUpdate(subscription) {
    console.log('📊 Subscription updated:', subscription.id);
    console.log('Status:', subscription.status);
    console.log('Customer:', subscription.customer);

    // TODO: Update user's premium status in database
}

// Handle subscription cancellation
async function handleSubscriptionCanceled(subscription) {
    console.log('❌ Subscription canceled:', subscription.id);

    // TODO: Remove user's premium status
}
