export default async (req, res) => {
    // CORS Header setzen
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Preflight Request behandeln
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Nur POST-Anfragen sind erlaubt' });
    }

    const { email } = req.body;

    if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Ungültige E-Mail-Adresse' });
    }

    // Supabase Konfiguration aus Environment Variablen (mit Bereinigung)
    const supabaseUrl = process.env.SUPABASE_URL?.trim().replace(/\/$/, '');
    const supabaseKey = process.env.SUPABASE_ANON_KEY?.trim();

    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({ error: 'Konfigurationsfehler: SUPABASE_URL oder SUPABASE_ANON_KEY fehlt bei Vercel.' });
    }

    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        const response = await fetch(`${supabaseUrl}/rest/v1/newsletter`, {
            method: 'POST',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                email: email,
                created_at: new Date().toISOString(),
                signup_ip: ip,
                confirmed: false
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Supabase raw error:', errorData);

            // Wenn E-Mail schon existiert
            if (errorData.code === '23505') {
                return res.status(200).json({ success: true, message: 'Already subscribed' });
            }

            return res.status(response.status).json({
                error: `Supabase meldet: ${errorData.message || 'Unbekannter Fehler'}`
            });
        }

        return res.status(200).json({ success: true });

    } catch (err) {
        console.error('SERVER ERROR:', err);
        return res.status(500).json({ error: `Server-Fehler: ${err.message}` });
    }
};
