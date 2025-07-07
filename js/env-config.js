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
    
}

// Create global instance
export const envConfig = new EnvironmentConfig();

