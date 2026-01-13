// ===========================
// SOCIAL PROOF + PERFORMANCE
// ===========================

(function () {
    'use strict';

    // ===========================
    // SOCIAL PROOF COUNTER
    // ===========================

    const counterElement = document.getElementById('greetingCounter');

    // Base count + localStorage count
    const BASE_COUNT = 2500;
    const localCount = parseInt(localStorage.getItem('localGreetingCount') || '0');
    let currentCount = BASE_COUNT + localCount;

    // Update counter display
    function updateCounter() {
        // Always fetch fresh element in case it was re-rendered
        const el = document.getElementById('greetingCounter');
        if (el && el.parentElement) {
            const lang = localStorage.getItem('preferredLanguage') || 'de';

            // Get template
            let tmpl = 'Bereits <strong id="greetingCounter">{n}</strong> Grüße erstellt!';
            if (window.uiTranslations && window.uiTranslations[lang] && window.uiTranslations[lang]['social-proof-text']) {
                tmpl = window.uiTranslations[lang]['social-proof-text'];
            }

            // Replace placeholder with HTML number
            const numberHtml = `<strong id="greetingCounter">${currentCount.toLocaleString('de-DE')}</strong>`;
            el.parentElement.innerHTML = tmpl.replace('{n}', numberHtml);
        }
    }

    // Listen to changes
    window.addEventListener('languageChanged', updateCounter);


    // Increment counter (called after generating a greeting)
    window.incrementSocialProof = function () {
        currentCount++;
        localStorage.setItem('localGreetingCount', (localCount + 1).toString());
        updateCounter();

        // Animate the number
        if (counterElement) {
            counterElement.style.transform = 'scale(1.2)';
            counterElement.style.transition = 'transform 0.3s ease';
            setTimeout(() => {
                counterElement.style.transform = 'scale(1)';
            }, 300);
        }
    };

    // Random increment to simulate activity
    function simulateActivity() {
        const randomIncrement = Math.floor(Math.random() * 3) + 1;
        currentCount += randomIncrement;
        updateCounter();
    }

    // Simulate activity every 30-60 seconds
    setInterval(() => {
        if (Math.random() > 0.5) {
            simulateActivity();
        }
    }, 45000);

    // Initial update
    updateCounter();

    // ===========================
    // PERFORMANCE OPTIMIZATIONS
    // ===========================

    // Lazy load images
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-image');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Defer non-critical JS
    function deferNonCritical() {
        // Add non-critical scripts after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                // Any heavy operations can go here
                console.log('📊 Non-critical scripts loaded');
            }, 2000);
        });
    }

    // Preload critical resources
    function preloadResources() {
        const criticalFonts = [
            'https://fonts.gstatic.com/s/outfit/v11/QGYvz_MVcBeNP4NJuktqQ4E.woff2'
        ];

        criticalFonts.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'font';
            link.type = 'font/woff2';
            link.crossOrigin = 'anonymous';
            link.href = font;
            document.head.appendChild(link);
        });
    }

    // Initialize performance optimizations
    if ('IntersectionObserver' in window) {
        lazyLoadImages();
    }
    deferNonCritical();

    console.log('✅ Social Proof & Performance loaded');

})();
