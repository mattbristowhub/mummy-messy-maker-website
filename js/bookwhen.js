// Bookwhen Integration Module
import { BOOKWHEN_CONFIG } from './config.js';

class BookwhenIntegration {
    constructor() {
        this.iframe = null;
        this.container = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        
        this.container = document.getElementById('bookwhen-container');
        if (!this.container) {
            console.error('Bookwhen container not found');
            return;
        }

        this.createIframe();
        this.setupEventListeners();
        this.initialized = true;
    }

    createIframe() {
        this.iframe = document.createElement('iframe');
        this.iframe.src = BOOKWHEN_CONFIG.iframeUrl;
        this.iframe.style.width = BOOKWHEN_CONFIG.iframe.width;
        this.iframe.style.height = BOOKWHEN_CONFIG.iframe.height;
        this.iframe.style.border = BOOKWHEN_CONFIG.iframe.border;
        this.iframe.style.borderRadius = BOOKWHEN_CONFIG.iframe.borderRadius;
        this.iframe.setAttribute('title', 'Book a class with Bookwhen');
        this.iframe.setAttribute('allow', 'payment');
        
        // Add loading state
        this.showLoadingState();
        
        // Handle iframe load
        this.iframe.onload = () => {
            this.hideLoadingState();
        };
        
        this.container.appendChild(this.iframe);
    }

    showLoadingState() {
        const loader = document.createElement('div');
        loader.className = 'bookwhen-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <p>Loading booking system...</p>
            </div>
        `;
        this.container.appendChild(loader);
    }

    hideLoadingState() {
        const loader = this.container.querySelector('.bookwhen-loader');
        if (loader) {
            loader.remove();
        }
    }

    setupEventListeners() {
        // Handle messages from Bookwhen iframe (for future enhancements)
        window.addEventListener('message', (event) => {
            if (event.origin !== new URL(BOOKWHEN_CONFIG.iframeUrl).origin) {
                return;
            }
            
            // Handle Bookwhen events here if needed
            this.handleBookwhenEvent(event.data);
        });

        // Handle window resize to maintain responsive iframe
        window.addEventListener('resize', () => {
            this.adjustIframeHeight();
        });
    }

    handleBookwhenEvent(data) {
        // Handle events from Bookwhen iframe
        // This can be extended based on what events Bookwhen sends
        console.log('Bookwhen event:', data);
    }

    adjustIframeHeight() {
        if (!this.iframe) return;
        
        // Responsive height adjustment logic
        const viewportHeight = window.innerHeight;
        const minHeight = 600;
        const maxHeight = Math.floor(viewportHeight * 0.8);
        
        if (maxHeight > minHeight) {
            this.iframe.style.height = `${maxHeight}px`;
        }
    }

    // Method to update iframe URL if needed
    updateIframeUrl(newUrl) {
        if (this.iframe) {
            this.iframe.src = newUrl;
        }
    }

    // Method to reload iframe
    reload() {
        if (this.iframe) {
            this.iframe.src = this.iframe.src;
        }
    }

    // Method to hide/show iframe
    setVisibility(visible) {
        if (this.iframe) {
            this.iframe.style.display = visible ? 'block' : 'none';
        }
    }
}

// Export the integration class
export default BookwhenIntegration;

// Export initialization function for easy use
export function initializeBookwhen() {
    const bookwhen = new BookwhenIntegration();
    bookwhen.init();
    return bookwhen;
}