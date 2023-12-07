class CookieConsent {
    constructor() {
        this.ccp = document.getElementById('ccp');
        if (!this.ccp) {
            console.error('CookieConsent: No element found with ID #ccp');
            return;
        }
        this.initialize();
    }

    initialize() {
        console.log('Initializing CookieConsent...');
        this.primaryButtonColor = this.getPrimaryButtonColor();
        this.applyStyles();
        this.addEventListeners();
        this.ccp.style.display = this.hasConsent() ? 'none' : 'block';
    }

    extractRGB(color) {
        return color.match(/\d+/g).map(Number);
    }

    blendWithWhite([r, g, b], alpha) {
        return `rgb(${r + (1 - alpha) * (255 - r)}, ${g + (1 - alpha) * (255 - g)}, ${b + (1 - alpha) * (255 - b)})`;
    }

    getPrimaryButtonColor() {
        const buttons = [...document.querySelectorAll('button, input[type="submit"], input[type="button"], .btn, .button, .submit-btn, .action-button')];
        for (const button of buttons) {
            let color = window.getComputedStyle(button).backgroundColor;
            if (color.startsWith('rgba')) {
                color = color.replace(/[^,]+(?=\))/, '1');
            }
            if (color !== 'rgba(0, 0, 0, 0)' && color !== 'rgb(255, 255, 255)') {
                return color;
            }
        }
        return null;
    }

    applyStyles() {
        if (this.primaryButtonColor) {
            const blendedColor = this.blendWithWhite(this.extractRGB(this.primaryButtonColor), 0.2);
            this.ccp.style.backgroundColor = blendedColor;
            this.setButtonStyles(this.primaryButtonColor);
        } else {
            this.setButtonStyles('black');
        }
    }

    setButtonStyles(textColor) {
        this.ccp.querySelectorAll('button').forEach(button => {
            if (button.classList.contains('accept')) {
                button.style.color = this.primaryButtonColor;
            } else {
                button.style.color = textColor;
            }
            button.style.backgroundColor = 'transparent';
            button.style.borderColor = 'transparent';
        });
    }

    addEventListeners() {
        const acceptButton = this.ccp.querySelector('.accept');
        const declineButton = this.ccp.querySelector('.decline');

        if (acceptButton) {
            acceptButton.addEventListener('click', () => this.handleAccept());
        }

        if (declineButton) {
            declineButton.addEventListener('click', () => this.handleDecline());
        }
    }

    handleAccept() {
        console.info('Consent accepted');
        this.setConsent(true);
        this.hide();
    }

    handleDecline() {
        console.info('Consent declined');
        this.setConsent(false);
        this.hide();
    }

    hide() {
        this.ccp.style.display = 'none';
    }

    setConsent(value) {
        localStorage.setItem('cc', value ? '1' : '0');
    }

    hasConsent() {
        return localStorage.getItem('cc') === '1';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CookieConsent();
});
