# 🚀 STRIPE SETUP-ANLEITUNG

## ✅ Was wurde implementiert:

- ✅ `/api/create-checkout.js` - Erstellt Stripe Checkout Sessions
- ✅ `/api/webhook.js` - Empf ängt Payment-Bestätigungen
- ✅ `/api/verify-payment.js` - Verifiziert Zahlungen
- ✅ `success.html` - Success-Page mit Confetti
- ✅ Frontend Payment-Integration - Echte Stripe-Calls
- ✅ `package.json` - Stripe NPM-Dependency

---

## 📋 SETUP (30-60 Min):

### **Schritt 1: Stripe-Account erstellen (5 Min)**

1. Gehe zu: https://stripe.com/de
2. Klicke "Jetzt starten"
3. Registriere dich mit E-Mail
4 Bestätige E-Mail
5. **Wichtig:** Aktiviere **Test-Mode** (oben rechts Toggle)

---

### **Schritt 2: API-Keys holen (2 Min)**

1. In Stripe Dashboard → **Developers** → **API Keys**
2. Du siehst:
   - **Publishable key** (pk_test_...)
   - **Secret key** (sk_test_...) ← Klicke "Reveal"

3. **Kopiere beide** (wir brauchen sie gleich)

---

### **Schritt 3: Produkte erstellen (15 Min)**

#### **Produkt 1: Einzelnes Bild (€0.99)**

1. Dashboard → **Products** → **Add product**
2. **Name:** `Einzelnes Bild ohne Wasserzeichen`
3. **Description:** `1 Greeting ohne Wasserzeichen, HD-Export`
4. **Pricing:**
   - **One-time payment**
   - **Amount:** `€0.99`
5. **Save**
6. **Kopiere die Price-ID** (sieht aus wie `price_1QWz...`)

#### **Produkt 2: 10 Grüße Credits (€2.99)**

1. **Add product**
2. **Name:** `10 Extra-Grüße`
3. **Description:** `10 zusätzliche Grüße, 30 Tage gültig`
4. **Pricing:**
   - **One-time payment**
   - **Amount:** `€2.99`
5. **Save**
6. **Kopiere die Price-ID**

#### **Produkt 3: Premium (€4.99/Monat)**

1. **Add product**
2. **Name:** `Premium Unlimited`
3. **Description:** `Unbegrenzte Grüße, alle Features`
4. **Pricing:**
   - **Recurring**
   - **Billing period:** Monthly
   - **Amount:** `€4.99`
5. **Save**
6. **Kopiere die Price-ID**

---

### **Schritt 4: Webhook einrichten (5 Min)**

1. Dashboard → **Developers** → **Webhooks**
2. **Add endpoint**
3. **Endpoint URL:**
   ```
   https://neujahrsgruss2026.de/api/webhook
   ```

4. **Events to listen:**
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

5. **Add endpoint**
6. **Kopiere den Signing Secret** (`whsec_...`)

---

### **Schritt 5: Vercel Environment Variables (5 Min)**

1. Gehe zu: https://vercel.com
2. Dein Projekt → **Settings** → **Environment Variables**
3. **Füge hinzu:**

```
STRIPE_SECRET_KEY = sk_test_... (von Schritt 2)
STRIPE_PUBLISHABLE_KEY = pk_test_... (von Schritt 2)
STRIPE_WEBHOOK_SECRET = whsec_... (von Schritt 4)
```

4. **Save**
5. **WICHTIG:** Redeploy triggern!

---

### **Schritt 6: Price-IDs im Code einfügen (2 Min)**

Öffne: `freemium-integration.js`

**Ersetze die Platzhalter:**

```javascript
// Zeile 56:
priceId: 'price_1QWz...', // ← HIER deine Single-Image Price-ID

// Zeile 87:
priceId: 'price_1QWz...', // ← HIER deine 10-Credits Price-ID

// Zeile 119:
priceId: 'price_1QWz...', // ← HIER deine Premium Price-ID
```

---

### **Schritt 7: Git Push (1 Min)**

```powershell
cd "c:\Users\arheindorf\OneDrive - HON Service GmbH\Dokumente\KryptoKoelsch\neujahrsgruesse"
git add .
git commit -m "💰 Complete Stripe Integration - Ready for payments!"
git push
```

**Warte 2-3 Min bis Vercel deployed**

---

### **Schritt 8: TESTING (10 Min)**

#### **Test 1: Checkout-Flow**

1. Öffne: https://neujahrsgruss2026.de
2. Klicke 4x "Generieren" → Modal erscheint
3. Klicke "Einzelnes Bild - €0.99"
4. Du wirst zu **Stripe Checkout** redirected
5. **Test-Kreditkarte:**
   ```
   Kartennummer: 4242 4242 4242 4242
   Ablaufdatum: 12/34
   CVC: 123
   PLZ: 12345
   ```

6. Klicke "Pay"
7. Du wirst zu `success.html` redirected
8. **Confetti** sollte regnen! 🎉

#### **Test 2: Credit-Verification**

1. Öffne Console (F12)
2. Gib ein:
   ```javascript
   localStorage.getItem('singleImageCredit')
   ```
3. Sollte zeigen: `"available"`

#### **Test 3: Export ohne Wasserzeichen**

1. Klicke "Als Bild speichern"
2. Download sollte **OHNE Wasserzeichen** sein!

#### **Test 4: Webhook**

1. Gehe zu Stripe → **Developers** → **Webhooks**
2. Klicke auf deinen Endpoint
3. Schau unter "Events" → Sollte `checkout.session.completed` sehen

---

## 🎯 **LIVE-MODE aktivieren (später!):**

**NUR wenn du echtes Geld akzeptieren willst:**

1. Stripe → **Test Mode** Toggle → **OFF**
2. **Verification** durchlaufen (Identität, Bankinfo)
3. Neue API-Keys holen (pk_live_... / sk_live_...)
4. Vercel Env Vars updaten
5. **Price-IDs erneut kopieren** (Produkte in Live-Mode neu erstellen!)

---

## 📊 **Erwartete Zahlung:**

- **Einzelbild:** €0.99 + ~€0.28 Stripe-Fee = **€0.71 netto**
- **10 Grüße:** €2.99 + ~€0.38 = **€2.61 netto**
- **Premium:** €4.99 + ~€0.44 = **€4.55 netto/Monat**

**Bei 100 Zahlungen/Monat:** ~€150-300 Umsatz (Mix)

---

## 🐛 **Troubleshooting:**

### **Problem: "Stripe not defined"**

**Lösung:**
```powershell
cd neujahrsgruesse
npm install stripe
git add package-lock.json node_modules
git commit -m "Add Stripe dependency"
git push
```

### **Problem: Webhook nicht empfangen**

**Check:**
1. Stripe → Webhooks → Event Log schauen
2. URL stimmt? `https://neujahrsgruss2026.de/api/webhook`
3. Signing Secret korrekt in Vercel?

### **Problem: "Price ID not found"**

**Lösung:** Price-IDs nochmal von Stripe kopieren und in Code einfügen

---

## ✅ **Fertig-Checklist:**

- [ ] Stripe-Account erstellt
- [ ] Test-Mode aktiviert
- [ ] API-Keys in Vercel
- [ ] 3 Produkte erstellt
- [ ] Price-IDs im Code
- [ ] Webhook eingerichtet
- [ ] Git gepusht
- [ ] Test-Zahlung durchgeführt
- [ ] Credit funktioniert
- [ ] Export ohne Wasserzeichen

---

**Nach diesem Setup ist dein System LIVE und akzeptiert Zahlungen! 💰**

---

## 🚀 **Quick-Start Script:**

```bash
# 1. Dependencies installieren
npm install stripe

# 2. Alles committen
git add .
git commit -m "💰 Stripe Integration Complete"
git push

# 3. Warte 2 Min → Dann teste!
```

---

**Du bist ready!! 🎉**
