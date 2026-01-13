// ===========================
// MOBILE STICKY BUTTON LOGIC
// ===========================

(function () {
    'use strict';

    const stickyControls = document.getElementById('stickyControls');
    const stickyBtn = document.getElementById('stickyGenerateBtn');
    const mainGenerateBtn = document.getElementById('generateBtn');
    const formSection = document.getElementById('generatorForm');

    // Only run if elements exist
    if (!stickyControls || !stickyBtn || !mainGenerateBtn) return;

    // 1. INTERSECTION OBSERVER
    // Show sticky button when main button scrolls OUT of view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Main button visible -> Hide sticky
                stickyControls.classList.remove('visible');
            } else {
                // Main button hidden -> Show sticky (if we are below header)
                if (window.scrollY > 200) {
                    stickyControls.classList.add('visible');
                }
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.1
    });

    observer.observe(mainGenerateBtn);

    // 2. CLICK HANDLER
    stickyBtn.addEventListener('click', function () {
        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(10);

        // Scroll smoothly to form center
        formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Highlight the main button
        setTimeout(() => {
            mainGenerateBtn.classList.add('pulse-highlight');
            setTimeout(() => mainGenerateBtn.classList.remove('pulse-highlight'), 1000);
        }, 500);
    });

    // 3. COOKIE BANNER ADJUSTMENT
    // If cookie banner is shown, move sticky button up
    const checkCookieBanner = setInterval(() => {
        const cookieBanner = document.querySelector('.cookie-banner');
        if (cookieBanner && cookieBanner.classList.contains('show')) {
            document.body.classList.add('has-cookie-banner');
        } else {
            document.body.classList.remove('has-cookie-banner');
        }
    }, 1000);

    // 4. LANGUAGE HANDLING
    function updateLanguage(lang) {
        if (!window.uiTranslations || !window.uiTranslations[lang]) return;
        const text = window.uiTranslations[lang]['sticky-btn'] || '✨ Jetzt Gruß erstellen';
        stickyBtn.textContent = text;
    }

    // Listen to changes
    window.addEventListener('languageChanged', (e) => updateLanguage(e.detail.language));

    // Initial load
    const currentLang = localStorage.getItem('preferredLanguage') || 'de';
    updateLanguage(currentLang);

})();
