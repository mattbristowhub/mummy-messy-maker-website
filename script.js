// Mummy's Messy Makers - Main JavaScript

// Import modules
import { initializeElements, loadLogos, setupEventListeners, setupScrollAnimations, validateForm, showSuccessMessage, closeSuccessModal } from './js/ui.js';
import { initializeBookwhen } from './js/bookwhen.js';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    setupScrollAnimations();
    loadLogos();
    initializeBookwhen();
    setupFormHandlers();
});

// Setup form handlers
function setupFormHandlers() {
    const contactForm = document.getElementById('contactForm');

    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                showSuccessMessage('Thank you for your message! We will get back to you soon.');
                this.reset();
            }
        });
    }
}

// Export functions to global scope for onclick handlers if needed
window.closeSuccessModal = closeSuccessModal;