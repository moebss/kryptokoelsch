// ===========================
// GRUSSGENERATOR BANNER
// Cross-Promotion & Newsletter
// ===========================

(function () {
    'use strict';

    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBanner);
    } else {
        initBanner();
    }

    function initBanner() {
        console.log('🎯 Banner init started');

        const banner = document.querySelector('.grussgenerator-banner');
        const closeBtn = document.getElementById('closeBanner');
        const form = document.getElementById('bannerSubscribeForm');
        const successMsg = document.getElementById('bannerSuccess');

        if (!banner) {
            console.error('❌ Banner element not found!');
            return;
        }

        console.log('✅ Banner element found');

        // Check if banner was closed before
        const bannerClosed = localStorage.getItem('grussgenerator_banner_closed');
        if (bannerClosed) {
            console.log('ℹ️ Banner was previously closed');
            banner.classList.add('hidden');
            return;
        }

        // Close button handler
        if (closeBtn) {
            console.log('✅ Close button found');

            closeBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔴 Close button clicked!');

                banner.classList.add('hidden');
                localStorage.setItem('grussgenerator_banner_closed', 'true');

                // Auto-remove from localstorage after 7 days
                setTimeout(function () {
                    localStorage.removeItem('grussgenerator_banner_closed');
                }, 7 * 24 * 60 * 60 * 1000);
            });

            // Additional click handler to ensure it works
            closeBtn.onclick = function () {
                console.log('🔴 Close button onclick fired!');
                banner.style.display = 'none';
                localStorage.setItem('grussgenerator_banner_closed', 'true');
            };
        } else {
            console.error('❌ Close button not found!');
        }

        // Form submission
        if (form) {
            form.addEventListener('submit', async function (e) {
                e.preventDefault();

                const emailInput = document.getElementById('bannerEmail');
                const email = emailInput?.value.trim();

                if (!email || !email.includes('@')) {
                    alert('Bitte gib eine gültige E-Mail ein');
                    return;
                }

                const submitBtn = form.querySelector('.btn-banner-subscribe');
                const originalText = submitBtn?.innerHTML;

                // Loading state
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<span>⏳ Wird gesendet...</span>';
                }

                try {
                    const response = await fetch('/api/subscribe', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: email,
                            source: 'neujahrsgruesse_grussgenerator_banner'
                        })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        // Success
                        form.style.display = 'none';
                        if (successMsg) {
                            successMsg.classList.add('show');
                        }

                        localStorage.setItem('grussgenerator_subscribed', 'true');
                        alert('🎉 Du bist für grussgenerator.de angemeldet!');

                        // Auto-hide banner after 5 seconds
                        setTimeout(function () {
                            banner.classList.add('hidden');
                        }, 5000);

                    } else {
                        throw new Error(data.error || 'Fehler beim Anmelden');
                    }

                } catch (err) {
                    console.error('Banner subscription error:', err);
                    alert('Fehler: ' + err.message);

                    // Reset button
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                    }
                }
            });
        }

        // Show banner with animation
        setTimeout(function () {
            if (banner) {
                banner.style.opacity = '1';
            }
        }, 500);

        console.log('✅ Banner fully initialized');
    }
})();
