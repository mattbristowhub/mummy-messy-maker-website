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

