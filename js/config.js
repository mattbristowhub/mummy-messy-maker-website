// Mummy's Messy Makers - Configuration
// This is the main configuration file that imports and re-exports
// all configuration modules for backwards compatibility

// Import separate configuration modules
import { UI_CONFIG } from './config/ui-config.js';
import { BOOKING_CONFIG } from './config/booking-config.js';
import { VENUE_CONFIG } from './config/venue-config.js';
import { BOOKWHEN_CONFIG } from './config/bookwhen-config.js';
import { CONTACT_CONFIG } from './config/contact-config.js';

// Re-export for backwards compatibility
export const CONFIG = UI_CONFIG;

// Merge booking and venue configurations
export const BOOKING_CONFIG_MERGED = {
    ...BOOKING_CONFIG,
    venues: VENUE_CONFIG.venues
};

// Export for legacy compatibility (will be deprecated)
export { BOOKWHEN_CONFIG };
export { CONTACT_CONFIG };

// DEPRECATED: Use BOOKING_CONFIG_MERGED instead
export const BOOKING_CONFIG_LEGACY = BOOKING_CONFIG_MERGED;

// EMAIL TEMPLATE VARIABLES (use these in your EmailJS template):
// {{to_email}} {{to_name}} {{subject}} {{booking_id}} {{child_name}} 
// {{child_age}} {{venue_name}} {{session_date}} {{session_time}} 
// {{venue_address}} {{venue_entry}} {{arrival_note}} {{parent_phone}}
// {{special_requirements}} {{what_to_bring}} {{what_we_provide}} {{important_notes}}

// EmailJS Configuration - MOVED TO ENVIRONMENT CONFIG
// SECURITY UPDATE: EmailJS configuration has been moved to environment variables
// for better security. API keys should not be exposed in client-side code.
// 
// SETUP INSTRUCTIONS:
// 1. Copy .env.example to .env
// 2. Update the environment variables with your EmailJS details
// 3. Add meta tags to your HTML to pass config securely to client
// 4. Use envConfig.getEmailJSConfig() to access configuration
//
// For backwards compatibility, EMAIL_CONFIG is still exported from env-config.js