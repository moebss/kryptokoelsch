// ===========================
// PREMIUM FEATURES v2.0
// Neujahrsgruß 2026 - Interactive Enhancements
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    initPremiumFeatures();
});

function initPremiumFeatures() {
    initDarkMode();
    initSettingsPanel();
    initOnboarding();
    initExportPreview();
    initButtonHierarchy();
    initMicroAnimations();
    initSmartNewsletter();
    initGamification();
}

// ===========================
// DARK MODE
// ===========================
function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    const sunIcon = toggle?.querySelector('.sun-icon');
    const moonIcon = toggle?.querySelector('.moon-icon');

    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedMode = localStorage.getItem('darkMode');

    const isDark = savedMode ? savedMode === 'true' : prefersDark;

    if (isDark) {
        document.documentElement.setAttribute('data-mode', 'dark');
        sunIcon?.classList.add('hidden');
        moonIcon?.classList.remove('hidden');
    }

    toggle?.addEventListener('click', () => {
        const currentMode = document.documentElement.getAttribute('data-mode');
        const newMode = currentMode === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-mode', newMode);
        localStorage.setItem('darkMode', newMode === 'dark');

        if (newMode === 'dark') {
            sunIcon?.classList.add('hidden');
            moonIcon?.classList.remove('hidden');
        } else {
            sunIcon?.classList.remove('hidden');
            moonIcon?.classList.add('hidden');
        }

        showToast(`${newMode === 'dark' ? 'Dark' : 'Light'} Mode aktiviert`);
    });
}

// ===========================
// SETTINGS PANEL
// ===========================
function initSettingsPanel() {
    const settingsBtn = document.getElementById('settingsToggle');
    const settingsPanel = document.getElementById('settingsPanel');
    const closeBtn = document.getElementById('closeSettings');
    const animationsToggle = document.getElementById('animationsToggle');

    settingsBtn?.addEventListener('click', () => {
        settingsPanel?.classList.remove('hidden');
    });

    closeBtn?.addEventListener('click', () => {
        settingsPanel?.classList.add('hidden');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!settingsPanel?.contains(e.target) && e.target !== settingsBtn) {
            setTimeout(() => {
                settingsPanel?.classList.add('hidden');
            }, 100);
        }
    });

    // Animations toggle
    const animationsEnabled = localStorage.getItem('animationsEnabled') !== 'false';
    if (animationsToggle) {
        animationsToggle.checked = animationsEnabled;
    }

    animationsToggle?.addEventListener('change', (e) => {
        const enabled = e.target.checked;
        localStorage.setItem('animationsEnabled', enabled);
        document.documentElement.style.setProperty(
            '--transition-multiplier',
            enabled ? '1' : '0'
        );
        showToast(`Animationen ${enabled ? 'aktiviert' : 'deaktiviert'}`);
    });

    // Theme switcher in settings
    document.querySelectorAll('.theme-switcher-inline .theme-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            const theme = dot.dataset.theme;
            document.documentElement.setAttribute('data-theme', theme);
            document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
            document.querySelectorAll(`[data-theme="${theme}"]`).forEach(d => d.classList.add('active'));
            localStorage.setItem('user-theme', theme);
        });
    });
}

// ===========================
// ONBOARDING
// ===========================
function initOnboarding() {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');

    if (!hasSeenOnboarding) {
        setTimeout(() => {
            showOnboarding();
        }, 1000);
    }
}

function showOnboarding() {
    const overlay = document.getElementById('onboardingOverlay');
    const nextBtn = overlay?.querySelector('.btn-onboarding-next');

    overlay?.classList.remove('hidden');

    nextBtn?.addEventListener('click', () => {
        overlay.classList.add('hidden');
        localStorage.setItem('hasSeenOnboarding', 'true');
        showToast('Viel Spaß beim Erstellen! 🎉');
    });

    // Close on outside click
    overlay?.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.add('hidden');
            localStorage.setItem('hasSeenOnboarding', 'true');
        }
    });
}

// ===========================
// EXPORT PREVIEW MODAL
// ===========================
function initExportPreview() {
    // Override the existing download button
    const downloadBtn = document.getElementById('downloadBtn');
    if (!downloadBtn) return;

    // Store original click handler
    const originalHandler = downloadBtn.onclick;

    downloadBtn.onclick = async (e) => {
        e.preventDefault();
        await showExportPreview();
    };
}

async function showExportPreview() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('exportPreviewModal');

    if (!modal) {
        modal = createExportPreviewModal();
        document.body.appendChild(modal);
    }

    modal.classList.remove('hidden');

    // Get current style
    const currentStyle = document.querySelector('.export-style-btn.active')?.dataset.style || 'classic';

    // Highlight current style in preview
    document.querySelectorAll('.preview-style-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.style === currentStyle) {
            card.classList.add('selected');
        }
    });
}

function createExportPreviewModal() {
    const modal = document.createElement('div');
    modal.id = 'exportPreviewModal';
    modal.className = 'export-preview-modal hidden';

    modal.innerHTML = `
        <div class="export-preview-content">
            <div class="preview-header">
                <h3>📸 Export-Vorschau</h3>
                <button class="close-preview">×</button>
            </div>
            
            <div class="preview-styles-grid">
                <div class="preview-style-card" data-style="classic">
                    <div class="preview-style-label">Classic</div>
                    <div class="preview-img-placeholder">🎆</div>
                </div>
                <div class="preview-style-card" data-style="elegant">
                    <div class="preview-style-label">Elegant</div>
                    <div class="preview-img-placeholder">✨</div>
                </div>
                <div class="preview-style-card" data-style="playful">
                    <div class="preview-style-label">Playful</div>
                    <div class="preview-img-placeholder">🎉</div>
                </div>
            </div>
            
            <div class="preview-actions">
                <button class="btn-confirm-download">
                    <span>Download starten 📥</span>
                </button>
            </div>
        </div>
    `;

    // Close handlers
    const closeBtn = modal.querySelector('.close-preview');
    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    // Style selection
    modal.querySelectorAll('.preview-style-card').forEach(card => {
        card.addEventListener('click', () => {
            modal.querySelectorAll('.preview-style-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            // Update the actual style button
            const style = card.dataset.style;
            document.querySelectorAll('.export-style-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.style === style) {
                    btn.classList.add('active');
                }
            });
        });
    });

    // Confirm download
    const confirmBtn = modal.querySelector('.btn-confirm-download');
    confirmBtn.addEventListener('click', async () => {
        modal.classList.add('hidden');

        // Trigger the original download function
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn && downloadBtn._originalClick) {
            await downloadBtn._originalClick();
        } else {
            // Fallback: trigger click
            downloadBtn.click();
        }

        showToast('Download gestartet! 📥');
    });

    return modal;
}

// ===========================
// BUTTON HIERARCHY ENHANCEMENT
// ===========================
function initButtonHierarchy() {
    // Add data attributes for tracking
    const actionButtons = document.querySelectorAll('.btn-action');

    actionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            trackButtonClick(btn);
        });
    });
}

function trackButtonClick(btn) {
    // Analytics placeholder
    const btnType = btn.className.includes('download') ? 'primary' :
        btn.className.includes('whatsapp') ? 'primary' :
            btn.className.includes('copy') ? 'secondary' :
                btn.className.includes('email') ? 'secondary' : 'tertiary';

    console.log(`Button clicked: ${btn.textContent.trim()} (${btnType})`);
}

// ===========================
// MICRO-ANIMATIONS
// ===========================
function initMicroAnimations() {
    // Ripple effect for all buttons
    document.querySelectorAll('button, .btn-action').forEach(btn => {
        btn.addEventListener('click', function (e) {
            createRipple(e, this);
        });
    });

    // Copy success animation
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        const originalHandler = copyBtn.onclick;
        copyBtn.onclick = async function (e) {
            if (originalHandler) await originalHandler.call(this, e);
            showCopySuccess(this);
        };
    }

    // Input focus animations
    document.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement?.classList.add('focused');
        });

        input.addEventListener('blur', function () {
            this.parentElement?.classList.remove('focused');
        });
    });
}

function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.className = 'ripple';

    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

function showCopySuccess(button) {
    const icon = button.querySelector('.icon');
    const originalText = icon?.textContent;

    if (icon) {
        icon.textContent = '✓';
        icon.classList.add('copy-success');

        setTimeout(() => {
            icon.textContent = originalText;
            icon.classList.remove('copy-success');
        }, 2000);
    }
}

// ===========================
// SMART NEWSLETTER (Less Aggressive)
// ===========================
function initSmartNewsletter() {
    const greetingCount = parseInt(localStorage.getItem('greetingCount') || '0');
    const hasSubscribed = localStorage.getItem('newsletter_subscribed') === 'true';
    const hasSnoozed = localStorage.getItem('newsletter_snoozed');

    // Only show after 3rd greeting, if not subscribed and not snoozed
    if (greetingCount >= 3 && !hasSubscribed && !hasSnoozed) {
        // Original modal logic stays, but with "Later" button
        addLaterButtonToNewsletterModal();
    }
}

function addLaterButtonToNewsletterModal() {
    const modal = document.getElementById('newsletterModal');
    const modalContent = modal?.querySelector('.modal-content');

    if (!modalContent || modalContent.querySelector('.btn-later')) return;

    const laterBtn = document.createElement('button');
    laterBtn.className = 'btn-later';
    laterBtn.textContent = 'Später erinnern';
    laterBtn.style.cssText = 'margin-top: 1rem; background: transparent; border: 1px solid rgba(255,255,255,0.3); padding: 0.8rem; border-radius: 8px; cursor: pointer;';

    laterBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        localStorage.setItem('newsletter_snoozed', Date.now());
        setTimeout(() => {
            localStorage.removeItem('newsletter_snoozed');
        }, 24 * 60 * 60 * 1000); // 24 hours

        showToast('Okay, wir fragen später nochmal! 👍');
    });

    modalContent.appendChild(laterBtn);
}

// ===========================
// GAMIFICATION
// ===========================
function initGamification() {
    // Track greeting count
    window.addEventListener('greetingGenerated', () => {
        const count = parseInt(localStorage.getItem('greetingCount') || '0') + 1;
        localStorage.setItem('greetingCount', count);

        checkAchievements(count);
    });
}

function checkAchievements(count) {
    const milestones = {
        1: { title: 'Erster Gruß!', emoji: '🎉', message: 'Du hast deinen ersten Gruß erstellt!' },
        5: { title: 'Grußmeister!', emoji: '🌟', message: '5 Grüße erstellt - du bist auf Feuer!' },
        10: { title: 'Grußexperte!', emoji: '🏆', message: '10 Grüße! Du bist ein Profi!' },
        25: { title: 'Grußlegende!', emoji: '👑', message: '25 Grüße - unfassbar!' }
    };

    const milestone = milestones[count];
    if (milestone) {
        showAchievement(milestone);
    }
}

function showAchievement(achievement) {
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
        <div class="achievement-content">
            <span class="achievement-emoji">${achievement.emoji}</span>
            <div>
                <strong>${achievement.title}</strong>
                <p>${achievement.message}</p>
            </div>
        </div>
    `;

    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(255, 215, 0, 0.95);
        color: #000;
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(255, 215, 0, 0.5);
        z-index: 10000;
        animation: slideInRight 0.5s, slideOutRight 0.5s 4.5s;
    `;

    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 5000);
}

// ===========================
// HELPER: Toast Notifications
// ===========================
function showToast(message) {
    // Use existing toast system if available
    if (window.showToast) {
        window.showToast(message);
    } else {
        console.log('Toast:', message);
    }
}

// ===========================
// EVENT: Greeting Generated
// ===========================
// Dispatch custom event when greeting is generated
const originalGenerateHandler = document.getElementById('generateBtn')?.onclick;
if (originalGenerateHandler) {
    document.getElementById('generateBtn').onclick = async function (e) {
        await originalGenerateHandler.call(this, e);
        window.dispatchEvent(new CustomEvent('greetingGenerated'));
    };
}
