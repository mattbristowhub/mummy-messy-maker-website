// Environment Configuration Manager
// This handles environment variables in a secure way

class EnvironmentConfig {
    constructor() {
        this.config = new Map();
        this.loadFromMetaTags();
    }
    
    // Load configuration from meta tags (secure way to pass server-side config to client)
    loadFromMetaTags() {
        const metaTags = document.querySelectorAll('meta[name^="app-config-"]');
        metaTags.forEach(tag => {
            const key = tag.name.replace('app-config-', '').toUpperCase();
            const value = tag.content;
            this.config.set(key, value);
        });
    }
    
    // Get configuration value
    get(key, defaultValue = null) {
        return this.config.get(key.toUpperCase()) || defaultValue;
    }
    
    // Check if configuration exists
    has(key) {
        return this.config.has(key.toUpperCase());
    }
    
    // Get EmailJS configuration safely
    getEmailJSConfig() {
        return {
            serviceId: this.get('EMAILJS_SERVICE_ID'),
            templateId: this.get('EMAILJS_TEMPLATE_ID'),
            publicKey: this.get('EMAILJS_PUBLIC_KEY'),
            enabled: this.get('EMAILJS_ENABLED', 'false') === 'true'
        };
    }
    
    // Validate required configuration
    validateEmailJSConfig() {
        const config = this.getEmailJSConfig();
        const required = ['serviceId', 'templateId', 'publicKey'];
        const missing = required.filter(key => !config[key]);
        
        if (missing.length > 0) {
            console.warn(`Missing EmailJS configuration: ${missing.join(', ')}`);
            return false;
        }
        
        return config.enabled;
    }
}

// Create global instance
export const envConfig = new EnvironmentConfig();

// Legacy export for backwards compatibility
export const EMAIL_CONFIG = envConfig.getEmailJSConfig();