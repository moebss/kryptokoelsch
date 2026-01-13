
// ===========================
// FREEMIUM SYSTEM INTEGRATION
// ===========================

// Show/Hide Upgrade Modal
function showUpgradeModal() {
    const modal = document.getElementById('upgradeModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeUpgradeModal() {
    const modal = document.getElementById('upgradeModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Update Remaining Counter
function updateRemainingCounter(remaining) {
    const counter = document.getElementById('remainingCounter');
    const countEl = document.getElementById('remainingCount');

    if (!counter || !countEl) return;

    if (remaining <= 0) {
        counter.classList.add('hidden');
        return;
    }

    counter.classList.remove('hidden');
    countEl.textContent = remaining;

    if (remaining === 1) {
        counter.classList.add('low');
    } else {
        counter.classList.remove('low');
    }
}

// ===========================
// STRIPE PAYMENT FUNCTIONS
// ===========================

// Single Image Payment (€0.99)
async function buySingleImage() {
    console.log('🛒 Single Image purchase initiated');

    try {
        const response = await fetch('/api/create-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                priceId: 'price_1SkoF46aDZs44RPVoEAyarvl', // Single Image €0.99
                mode: 'payment',
                metadata: {
                    type: 'single_image',
                    product: 'Single Image No Watermark'
                }
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create checkout');
        }

        const data = await response.json();
        window.location.href = data.url; // Redirect to Stripe

    } catch (err) {
        console.error('Payment error:', err);
        alert('Fehler beim Zahlungsvorgang. Bitte versuche es erneut.');
    }
}

// 10 Credits (€2.99)
async function buyCredits() {
    console.log('🛒 Credits purchase initiated');

    try {
        const response = await fetch('/api/create-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                priceId: 'price_1SkoG16aDZs44RPV7n8l3x23', // 10 Credits €2.99
                mode: 'payment',
                metadata: {
                    type: 'credits',
                    amount: 10,
                    product: '10 Extra Grüße'
                }
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create checkout');
        }

        const data = await response.json();
        window.location.href = data.url;

    } catch (err) {
        console.error('Payment error:', err);
        alert('Fehler beim Zahlungsvorgang. Bitte versuche es erneut.');
    }
}

// Premium Subscription (€4.99/month)
async function subscribePremium() {
    console.log('🛒 Premium subscription initiated');

    try {
        const response = await fetch('/api/create-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                priceId: 'price_1SkoGt6aDZs44RPVbPiraiZC', // Premium €4.99/month
                mode: 'subscription',
                metadata: {
                    type: 'premium',
                    product: 'Premium Unlimited Monthly'
                }
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create checkout');
        }

        const data = await response.json();
        window.location.href = data.url;

    } catch (err) {
        console.error('Payment error:', err);
        alert('Fehler beim Abo-Abschluss. Bitte versuche es erneut.');
    }
}

// Check single image credit
function checkSingleImageCredit() {
    const credit = localStorage.getItem('singleImageCredit');
    return credit === 'available';
}

// Consume single image credit
function consumeSingleImageCredit() {
    localStorage.removeItem('singleImageCredit');
    showToast('✅ Bild ohne Wasserzeichen heruntergeladen!');
}

// Set single image credit (after successful payment)
function setSingleImageCredit() {
    localStorage.setItem('singleImageCredit', 'available');
}

// Check extra credits
function getExtraCredits() {
    return parseInt(localStorage.getItem('extraCredits') || '0');
}

// Use extra credit
function useExtraCredit() {
    const credits = getExtraCredits();
    if (credits > 0) {
        localStorage.setItem('extraCredits', credits - 1);
        return true;
    }
    return false;
}

console.log('✅ Freemium System Integration loaded');
