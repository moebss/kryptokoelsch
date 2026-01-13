// ===========================
// GRUSSGENERATOR.DE PROMO
// Newsletter Signup Integration
// ===========================

(function () {
    'use strict';

    const promoForm = document.getElementById('promoSubscribeForm');
    const promoEmail = document.getElementById('promoEmail');
    const promoSuccess = document.getElementById('promoSuccess');

    if (promoForm) {
        promoForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const email = promoEmail.value.trim();

            if (!email) return;

            console.log('📧 Promo newsletter signup:', email);

            try {
                const response = await fetch('/api/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: email,
                        source: 'grussgenerator_promo_section'
                    })
                });

                if (response.ok) {
                    // Success
                    promoForm.style.display = 'none';
                    promoSuccess.classList.add('show');

                    // Confetti!
                    if (typeof createConfetti === 'function') {
                        createConfetti();
                    }

                    console.log('✅ Promo newsletter signup successful');
                } else {
                    throw new Error('Subscription failed');
                }

            } catch (err) {
                console.error('Promo newsletter error:', err);
                alert('Fehler beim Eintragen. Bitte versuche es später nochmal.');
            }
        });
    }

    console.log('✅ Grussgenerator Promo loaded');
})();
