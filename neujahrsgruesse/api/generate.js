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

    // --- SIMPLE RATE LIMITING (In-Memory) ---
    // Note: In serverless, memory is not persistent across all calls, but this catches burst attacks on the same instance.
    // For production scaling, use KV stores (like Vercel KV).
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const rateLimitMap = global.rateLimitMap || new Map();
    global.rateLimitMap = rateLimitMap;

    const now = Date.now();
    const windowMs = 60 * 1000; // 1 Minute
    const maxRequests = 10; // Max requests per minute

    const requestLog = rateLimitMap.get(ip) || [];
    const recentRequests = requestLog.filter(time => time > now - windowMs);

    if (recentRequests.length >= maxRequests) {
        return res.status(429).json({ error: 'Zu viele Anfragen. Bitte warte eine Minute. ⏳' });
    }

    recentRequests.push(now);
    rateLimitMap.set(ip, recentRequests);
    // ----------------------------------------

    const { name, relation, info, tone, lang } = req.body;

    // Check, ob der API Key überhaupt da ist
    if (!process.env.PPLX_API_KEY) {
        return res.status(500).json({ error: 'Konfigurationsfehler: API Key fehlt in Vercel' });
    }

    try {
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.PPLX_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'sonar-pro',
                messages: [
                    {
                        role: 'system',
                        content: `You are a helpful assistant writing New Year's greetings for 2026. 
                        - IMPORTANT: Write ONLY in the language requested: "${lang}". 
                        - If "${lang}" is 'de' write in German. 
                        - If "${lang}" is 'en' write in English.
                        - If "${lang}" is 'tr' write in Turkish.
                        - If "${lang}" is 'es' write in Spanish.
                        - If "${lang}" is 'fr' write in French.
                        - If "${lang}" is 'it' write in Italian.
                        - If "${lang}" is 'bg' write in Bulgarian.
                        
                        - Output ONLY the greeting text. 
                        - Do NOT include any intro or outro like "Here is your text:".
                        - Do NOT include placeholders like "[Your Name]" at the end.`
                    },
                    { role: 'user', content: `Write a ${tone} greeting for ${name} (Relationship: ${relation}). Additional Info: ${info}` }
                ],
                max_tokens: 600,
                temperature: 0.8
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: `Perplexity API Error: ${data.error?.message || response.statusText}` });
        }

        return res.status(200).json({ text: data.choices[0].message.content.trim() });

    } catch (err) {
        console.error('SERVER ERROR:', err);
        return res.status(500).json({ error: `Server-Fehler: ${err.message}` });
    }
};
