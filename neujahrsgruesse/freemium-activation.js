// ===========================
// FREEMIUM SYSTEM - AKTIVIERUNG
// Rate-Limiting + Wasserzeichen
// ===========================

(function () {
    'use strict';

    console.log('🚀 Activating Freemium System...');

    // Wait for all scripts to load
    window.addEventListener('load', async function () {

        // Initialize remaining counter on page load
        setTimeout(async () => {
            if (window.freemiumManager) {
                const limitCheck = await window.freemiumManager.checkLimit();
                updateRemainingCounter(limitCheck.remaining);
            }
        }, 1000);

        // ===========================
        // 1. RATE-LIMITING ACTIVATION
        // ===========================

        const greetingForm = document.getElementById('greetingForm');

        if (greetingForm) {
            console.log('✅ Found greeting form - activating rate limiting');

            greetingForm.addEventListener('submit', async function (event) {

                // Check limit BEFORE allowing form submission
                if (window.freemiumManager) {
                    const limitCheck = await window.freemiumManager.checkLimit();

                    if (!limitCheck.allowed) {
                        event.preventDefault();
                        event.stopImmediatePropagation();

                        console.warn('🔴 Daily limit reached!');
                        showUpgradeModal();
                        updateRemainingCounter(0);

                        return false;
                    }

                    console.log(`✅ Limit OK - ${limitCheck.remaining} remaining`);

                    // Increment usage counter
                    window.freemiumManager.incrementUsage();

                    // Update counter
                    updateRemainingCounter(limitCheck.remaining - 1);

                    // Add watermark to generated message after generation
                    setTimeout(() => {
                        addWatermarkToGeneratedMessage();
                    }, 2000);
                }
            }, true); // Use capture phase to run FIRST

        } else {
            console.warn('⚠️ Greeting form not found');
        }

        // ===========================
        // 2. WATERMARK ACTIVATION
        // ===========================

        function addWatermarkToGeneratedMessage() {
            if (!window.watermarkManager) return;

            if (window.watermarkManager.shouldShowWatermark()) {
                const outputCard = document.querySelector('#outputSection .card');
                if (outputCard) {
                    window.watermarkManager.addWatermarkToElement(outputCard);
                    console.log('✅ Watermark added to preview');
                }
            }
        }

        // ===========================
        // 3. EXPORT WATERMARK
        // ===========================

        // Override exportAsImage function
        const originalExportAsImage = window.exportAsImage;

        if (typeof originalExportAsImage === 'function') {
            window.exportAsImage = async function (format) {

                // Check if user has permission
                const isPremium = window.freemiumManager?.isPremium();
                const hasSingleCredit = checkSingleImageCredit();

                if (!isPremium && !hasSingleCredit) {
                    // Show payment modal
                    alert('💰 Ohne Wasserzeichen für nur €0.99!\n\nKlicke auf "Upgrade" um fortzufahren.');
                    showUpgradeModal();
                    return;
                }

                // Call original function
                await originalExportAsImage.call(this, format);

                // Consume credit if used
                if (hasSingleCredit && !isPremium) {
                    consumeSingleImageCredit();
                }
            };

            console.log('✅ Export function wrapped with watermark check');
        }

        // Override exportAsPDF function  
        const originalExportAsPDF = window.exportAsPDF;

        if (typeof originalExportAsPDF === 'function') {
            window.exportAsPDF = async function () {

                const isPremium = window.freemiumManager?.isPremium();

                if (!isPremium) {
                    alert('📄 PDF-Export ist ein Premium-Feature!\n\nUpgrade für €4.99/Monat');
                    showUpgradeModal();
                    return;
                }

                await originalExportAsPDF.call(this);
            };

            console.log('✅ PDF export wrapped with premium check');
        }

        console.log('🎉 Freemium System fully activated!');
    });

})();
