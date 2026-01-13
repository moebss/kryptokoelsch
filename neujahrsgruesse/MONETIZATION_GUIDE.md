# 💰 Monetarisierungs-Guide: Neujahrsgruß 2026

## 🎯 Strategie: Freemium + Pay-Per-Use

### Pricing-Struktur:
- **Free:** 3 Grüße/Tag (mit Wasserzeichen)
- **€0.99:** 10 Extra-Grüße (einmalig)
- **€2.99/Monat:** Premium Unlimited (kein Wasserzeichen, HD-Export)

---

## 📋 Implementation Checklist

### Phase 1: Basis-Limitierung (Tag 1-2)
- [ ] LocalStorage-basiertes Limit implementieren
- [ ] Upgrade-Modal erstellen
- [ ] Remaining Counter anzeigen

### Phase 2: Backend-Tracking (Tag 3-5)
- [ ] Supabase-Tabelle `greeting_usage` erstellen
- [ ] API-Route `/api/check-limit` implementieren
- [ ] IP-basiertes Tracking aktivieren

### Phase 3: Payment-Integration (Tag 6-10)
- [ ] Stripe-Account erstellen & verifizieren
- [ ] Produkte in Stripe anlegen
- [ ] Checkout-Flow implementieren
- [ ] Webhook für Subscription-Updates

### Phase 4: Premium-Features (Tag 11-15)
- [ ] Wasserzeichen für Free-User
- [ ] HD/4K Export nur für Premium
- [ ] Premium-Badge im UI

---

## 🔧 Technische Umsetzung

### 1. Limitierung mit LocalStorage

```javascript
// utils/rateLimit.js
export function checkDailyLimit() {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('greetingData');
    const data = stored ? JSON.parse(stored) : { date: null, count: 0 };
    
    if (data.date !== today) {
        data.date = today;
        data.count = 0;
    }
    
    const remaining = 3 - data.count;
    
    return {
        allowed: data.count < 3,
        count: data.count,
        remaining: Math.max(0, remaining)
    };
}

export function incrementUsage() {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('greetingData');
    const data = stored ? JSON.parse(stored) : { date: today, count: 0 };
    
    data.count++;
    localStorage.setItem('greetingData', JSON.stringify(data));
}
```

---

### 2. Upgrade-Modal HTML

```html
<!-- In index.html einfügen -->
<div id="upgradeModal" class="upgrade-modal hidden">
    <div class="upgrade-content">
        <button class="close-upgrade" onclick="closeUpgradeModal()">×</button>
        
        <h2>🎉 Tageslimit erreicht!</h2>
        <p>Du hast heute bereits <strong>3 kostenlose Grüße</strong> erstellt.</p>
        
        <div class="upgrade-options">
            <!-- Option 1: 10 Extra Grüße -->
            <div class="pricing-card">
                <h3>10 Extra-Grüße</h3>
                <div class="price">€0.99</div>
                <p>Einmalige Zahlung</p>
                <ul>
                    <li>✅ 10 zusätzliche Grüße</li>
                    <li>✅ Kein Wasserzeichen</li>
                    <li>✅ HD-Export</li>
                </ul>
                <button class="btn-upgrade" onclick="buyCredits()">
                    Jetzt kaufen
                </button>
            </div>
            
            <!-- Option 2: Premium Abo -->
            <div class="pricing-card featured">
                <div class="badge">Beliebteste Wahl</div>
                <h3>Premium Unlimited</h3>
                <div class="price">€2.99<span>/Monat</span></div>
                <p>Jederzeit kündbar</p>
                <ul>
                    <li>✅ Unbegrenzte Grüße</li>
                    <li>✅ Kein Wasserzeichen</li>
                    <li>✅ 4K HD-Export</li>
                    <li>✅ PDF-Export</li>
                    <li>✅ Story-Format</li>
                    <li>✅ Alle Styles</li>
                </ul>
                <button class="btn-upgrade premium" onclick="subscribePremium()">
                    Premium werden
                </button>
            </div>
        </div>
        
        <p class="upgrade-note">
            🔒 Sichere Zahlung mit Stripe • 14 Tage Geld-zurück-Garantie
        </p>
    </div>
</div>
```

---

### 3. Stripe Checkout Integration

```javascript
// payment.js
const STRIPE_PUBLISHABLE_KEY = 'pk_live_...'; // Aus Vercel Env Vars

async function buyCredits() {
    try {
        const response = await fetch('/api/create-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                priceId: 'price_credits_10', // Stripe Price ID
                mode: 'payment' // One-time payment
            })
        });
        
        const { url } = await response.json();
        window.location.href = url; // Redirect to Stripe Checkout
        
    } catch (err) {
        alert('Fehler beim Zahlungsvorgang: ' + err.message);
    }
}

async function subscribePremium() {
    try {
        const response = await fetch('/api/create-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                priceId: 'price_premium_monthly', // Stripe Price ID  
                mode: 'subscription' // Recurring
            })
        });
        
        const { url } = await response.json();
        window.location.href = url;
        
    } catch (err) {
        alert('Fehler beim Abo-Abschluss: ' + err.message);
    }
}
```

---

### 4. Backend: Stripe Checkout API

```javascript
// api/create-checkout.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { priceId, mode } = req.body;
    
    try {
        const session = await stripe.checkout.sessions.create({
            mode: mode, // 'payment' or 'subscription'
            line_items: [{
                price: priceId,
                quantity: 1
            }],
            success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/`,
            automatic_tax: { enabled: true }
        });
        
        return res.status(200).json({ url: session.url });
        
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
```

---

### 5. Success-Page

```javascript
// success.html oder in index.html als Modal
const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('session_id');

if (sessionId) {
    // Verify payment
    fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            // Update LocalStorage
            if (data.type === 'credits') {
                addCredits(10); // 10 Extra Grüße
            } else {
                setPremiumStatus(true);
            }
            
            showSuccessModal('Zahlung erfolgreich! 🎉');
        }
    });
}
```

---

## 📊 Supabase-Schema

```sql
-- User Subscriptions
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    status TEXT, -- 'active', 'canceled', 'past_due'
    plan TEXT, -- 'premium_monthly'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Credits (für Pay-Per-Use)
CREATE TABLE user_credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,  -- Kann auch NULL sein für anonyme User
    ip_address TEXT,
    credits INTEGER DEFAULT 0,
    purchased_at TIMESTAMP DEFAULT NOW()
);

-- Usage Tracking
CREATE TABLE greeting_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    ip_address TEXT,
    date DATE NOT NULL,
    count INTEGER DEFAULT 0,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(ip_address, date)
);
```

---

## 🎨 CSS für Upgrade-Modal

```css
.upgrade-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(10px);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.upgrade-modal.hidden {
    display: none;
}

.upgrade-content {
    background: linear-gradient(135deg, #1a0a2e, #0f0520);
    border: 2px solid #ffd700;
    border-radius: 24px;
    padding: 3rem;
    max-width: 900px;
    position: relative;
    animation: scaleIn 0.4s ease;
}

.upgrade-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin: 2rem 0;
}

.pricing-card {
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 215, 0, 0.3);
    border-radius: 16px;
    padding: 2rem;
    transition: all 0.3s ease;
}

.pricing-card.featured {
    border-color: #ffd700;
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.4);
    transform: scale(1.05);
}

.pricing-card .price {
    font-size: 3rem;
    font-weight: 900;
    background: linear-gradient(135deg, #ffd700, #ffed4e);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 1rem 0;
}

.btn-upgrade {
    width: 100%;
    padding: 1rem;
    background: linear-gradient(135deg, #ffd700, #ffed4e);
    color: #000;
    border: none;
    border-radius: 12px;
    font-weight: 700;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-upgrade:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(255, 215, 0, 0.5);
}

.badge {
    background: #ffd700;
    color: #000;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 700;
    margin-bottom: 1rem;
    display: inline-block;
}
```

---

## 🚀 Deployment-Checklist

### Stripe Setup:
1. [ ] Stripe-Account erstellen
2. [ ] 2 Produkte anlegen:
   - "10 Grüße Credits" (€0.99 one-time)
   - "Premium Unlimited" (€2.99/month recurring)
3. [ ] Price-IDs kopieren
4. [ ] In Vercel Env Vars einfügen:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLISHABLE_KEY`

### Testing:
- [ ] Mit Stripe Test-Mode testen
- [ ] Test-Kreditkarte: 4242 4242 4242 4242
- [ ] Alle 3 Flows testen:
  - Free → 3 Grüße → Modal
  - Kauf 10 Grüße → Success
  - Abo → Success → Premium-Status

### Live-Schaltung:
- [ ] Stripe auf Live-Mode umstellen
- [ ] Rechtliches: Impressum, Widerruf, AGB
- [ ] Datenschutz: Stripe in Datenschutzerklärung
- [ ] First Sale testen! 🎉

---

## 💡 Pro-Tips:

1. **14-Tage-Geld-zurück:** Erhöht Conversion um ~30%
2. **Social Proof:** "127 zufriedene Premium-Nutzer"
3. **Countdown:** "Nur noch heute: Erster Monat -50%"
4. **Exit-Intent:** Modal bei Mouse-Leave mit Rabatt

---

## 📈 Erwartete Zahlen (Realistic):

**Monat 1:**
- 1.000 Free-User
- 20 Conversions (2%)
- €50-60 Umsatz

**Monat 3:**
- 5.000 Free-User
- 100-150 Conversions (2-3%)
- €250-450 Umsatz

**Monat 6 (mit Marketing):**
- 20.000 Free-User
- 400-600 Conversions (2-3%)
- €1.000-1.800 Umsatz

---

**Entwickelt von Alexander Rheindorf • 2026**
