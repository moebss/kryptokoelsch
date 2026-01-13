// ===========================
// FREEMIUM SYSTEM v1.0
// Rate-Limiting + Fingerprinting
// ===========================

class FreemiumManager {
    constructor() {
        this.dailyLimit = 3;
        this.fingerprint = null;
        this.init();
    }

    async init() {
        this.fingerprint = await this.generateFingerprint();
    }

    // Browser-Fingerprint (schwerer zu manipulieren als LocalStorage)
    async generateFingerprint() {
        const components = [
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            screen.colorDepth,
            new Date().getTimezoneOffset(),
            !!window.sessionStorage,
            !!window.localStorage,
            navigator.hardwareConcurrency || 0
        ];

        const fingerprint = components.join('|');
        const hash = await this.hashString(fingerprint);
        return hash.substring(0, 16);
    }

    async hashString(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Kombiniert LocalStorage + Fingerprint + API-Check
    async checkLimit() {
        const today = new Date().toDateString();

        // 1. LocalStorage Check
        const localData = this.getLocalData();

        if (localData.date !== today) {
            localData.date = today;
            localData.count = 0;
            localData.fingerprint = this.fingerprint;
        }

        // 2. Fingerprint-Mismatch Detection (User versucht zu täuschen)
        if (localData.fingerprint !== this.fingerprint) {
            console.warn('🔴 Fingerprint mismatch detected');
            // Nutze höheren der beiden Werte
            const apiData = await this.checkAPILimit();
            localData.count = Math.max(localData.count, apiData.count);
        }

        // 3. API-Limit Check (final authority)
        const apiData = await this.checkAPILimit();

        // Nutze das Maximum aus beiden Quellen
        const actualCount = Math.max(localData.count, apiData.count);
        const remaining = Math.max(0, this.dailyLimit - actualCount);

        return {
            allowed: actualCount < this.dailyLimit,
            count: actualCount,
            remaining: remaining,
            fingerprint: this.fingerprint
        };
    }

    async checkAPILimit() {
        try {
            const response = await fetch('/api/check-limit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fingerprint: this.fingerprint,
                    timestamp: Date.now()
                })
            });

            if (!response.ok) {
                throw new Error('API check failed');
            }

            return await response.json();
        } catch (err) {
            console.error('API limit check failed:', err);
            // Fallback auf LocalStorage bei API-Fehler
            return this.getLocalData();
        }
    }

    incrementUsage() {
        const data = this.getLocalData();
        data.count++;
        this.saveLocalData(data);
    }

    getLocalData() {
        const stored = localStorage.getItem('greetingData');
        return stored ? JSON.parse(stored) : {
            date: new Date().toDateString(),
            count: 0,
            fingerprint: this.fingerprint
        };
    }

    saveLocalData(data) {
        localStorage.setItem('greetingData', JSON.stringify(data));
    }

    // Premium-Status Check
    isPremium() {
        const premiumData = localStorage.getItem('premiumStatus');
        if (!premiumData) return false;

        try {
            const data = JSON.parse(premiumData);
            // Verify with timestamp (prevent manipulation)
            if (Date.now() - data.verified > 3600000) { // 1 hour
                return false; // Re-verify needed
            }
            return data.active === true;
        } catch {
            return false;
        }
    }

    setPremiumStatus(active) {
        localStorage.setItem('premiumStatus', JSON.stringify({
            active: active,
            verified: Date.now()
        }));
    }
}

// Global instance
const freemiumManager = new FreemiumManager();

// Export für andere Scripts
window.freemiumManager = freemiumManager;
