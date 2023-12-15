class CookieConsent {
    constructor() {
        this.ccp = document.getElementById('ccp');
        this.modal = document.getElementById('cookieModal');
        this.close = document.getElementsByClassName("close")[0];
        if (!this.ccp) {
            console.error('CookieConsent: No element found with ID #ccp');
            return;
        }
        this.initialize();
    }

    initialize() {
        this.primaryButtonColor = this.getPrimaryButtonColor();
        this.applyStyles();
        this.addEventListeners();
        this.ccp.style.display = 'block';
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
        this.ccp.querySelectorAll('button.accept, button.decline').forEach(button => {
            button.style.backgroundColor = this.primaryButtonColor || 'transparent';
            button.style.color = 'white';
        });
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

    addEventListeners() {
        const settingsButton = this.ccp.querySelector('.settings');
        const acceptButton = this.ccp.querySelector('.accept');
        const declineButton = this.ccp.querySelector('.decline');

        if (settingsButton) {
            settingsButton.addEventListener('click', () => this.showModal());
        }
        if (acceptButton) {
            acceptButton.addEventListener('click', () => this.handleAccept());
        }
        if (declineButton) {
            declineButton.addEventListener('click', () => this.handleDecline());
        }
        if (this.close) {
            this.close.addEventListener('click', () => this.hideModal());
        }
        window.addEventListener('click', (event) => {
            if (event.target == this.modal) {
                this.hideModal();
            }
        });
    }

    showModal() {
        this.modal.style.display = "block";
    }

    hideModal() {
        this.modal.style.display = "none";
    }

    handleAccept() {
        this.setConsent(true);
        this.hide();
    }

    handleDecline() {
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
