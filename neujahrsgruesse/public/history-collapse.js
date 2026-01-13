// ===========================
// COLLAPSIBLE HISTORY
// Toggle & Update Logic
// ===========================

(function () {
    'use strict';

    const historyToggle = document.getElementById('historyToggle');
    const historyContent = document.getElementById('historyContent');
    const historyBadge = document.getElementById('historyBadge');
    const historyListElement = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    // Toggle collapse
    if (historyToggle) {
        historyToggle.addEventListener('click', function () {
            const isOpen = historyContent.classList.contains('show');

            if (isOpen) {
                historyContent.classList.remove('show');
                historyContent.classList.add('hidden');
                historyToggle.classList.remove('active');
            } else {
                historyContent.classList.remove('hidden');
                historyContent.classList.add('show');
                historyToggle.classList.add('active');
            }
        });
    }

    // Update badge count
    function updateHistoryBadge() {
        const history = JSON.parse(localStorage.getItem('greetingHistory') || '[]');
        if (historyBadge) {
            historyBadge.textContent = history.length;

            if (history.length === 0) {
                historyBadge.style.display = 'none';
            } else {
                historyBadge.style.display = 'inline-block';
            }
        }
    }

    // Update history list
    function updateHistoryList() {
        if (!historyListElement) return;

        const history = JSON.parse(localStorage.getItem('greetingHistory') || '[]');

        if (history.length === 0) {
            historyListElement.innerHTML = '<p class="empty-history">Noch keine Grüße erstellt.</p>';
            return;
        }

        historyListElement.innerHTML = '';

        history.slice(-5).reverse().forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            if (index === 0) {
                historyItem.classList.add('new-item');
            }

            const preview = item.message.substring(0, 100) + (item.message.length > 100 ? '...' : '');
            const date = new Date(item.timestamp).toLocaleString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });

            historyItem.innerHTML = `
                <div class="history-preview">${preview}</div>
                <div class="history-meta">
                    <span>${date}</span>
                    <span class="history-lang">${item.language || 'de'}</span>
                </div>
            `;

            historyItem.addEventListener('click', function () {
                loadHistoryItem(item);
            });

            historyListElement.appendChild(historyItem);
        });

        updateHistoryBadge();
    }

    // Load history item
    function loadHistoryItem(item) {
        const messageDisplay = document.getElementById('generatedMessage');
        const outputSection = document.getElementById('outputSection');

        if (messageDisplay && outputSection) {
            messageDisplay.textContent = item.message;
            outputSection.classList.remove('hidden');
            outputSection.style.display = 'block';

            // Scroll to output
            outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            // Close history
            if (historyContent) {
                historyContent.classList.remove('show');
                historyContent.classList.add('hidden');
                historyToggle.classList.remove('active');
            }
        }
    }

    // Clear history
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', function () {
            if (confirm('Möchtest du wirklich alle Grüße aus dem Verlauf löschen?')) {
                localStorage.removeItem('greetingHistory');
                updateHistoryList();
                console.log('📜 History cleared');
            }
        });
    }

    // Listen for history updates (from other scripts)
    window.addEventListener('historyUpdated', function () {
        updateHistoryList();
    });

    // Initial load
    updateHistoryList();

    console.log('✅ Collapsible History loaded');

})();
