// ===========================
// WATERMARK SYSTEM
// For Free Users
// ===========================

class WatermarkManager {
    constructor() {
        this.watermarkText = 'neujahrsgruss2026.de';
        this.watermarkOpacity = 0.15;
    }

    // Add watermark to preview (before download)
    addWatermarkToElement(element) {
        // Remove existing watermark first
        this.removeWatermarkFromElement(element);

        const watermark = document.createElement('div');
        watermark.className = 'greeting-watermark';
        watermark.setAttribute('data-watermark', 'true');

        // Diagonal watermarks across the image
        for (let i = 0; i < 5; i++) {
            const mark = document.createElement('div');
            mark.className = 'watermark-text';
            mark.textContent = this.watermarkText;
            mark.style.top = `${20 + i * 20}%`;
            mark.style.left = `${10 + (i % 2) * 30}%`;
            watermark.appendChild(mark);
        }

        element.appendChild(watermark);
    }

    removeWatermarkFromElement(element) {
        const existing = element.querySelector('[data-watermark="true"]');
        if (existing) {
            existing.remove();
        }
    }

    // Add watermark directly to canvas (for download)
    addWatermarkToCanvas(canvas) {
        const ctx = canvas.getContext('2d');

        // Save current state
        ctx.save();

        // Set watermark style
        ctx.globalAlpha = this.watermarkOpacity;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';

        // Rotate for diagonal text
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 6); // -30 degrees

        // Draw multiple watermarks
        const spacing = 300;
        for (let y = -canvas.height; y < canvas.height * 2; y += spacing) {
            for (let x = -canvas.width; x < canvas.width * 2; x += spacing * 2) {
                ctx.fillText(this.watermarkText, x, y);
            }
        }

        // Restore state
        ctx.restore();
    }

    // Check if user should see watermark
    shouldShowWatermark() {
        return !window.freemiumManager?.isPremium();
    }
}

// Global instance
window.watermarkManager = new WatermarkManager();
