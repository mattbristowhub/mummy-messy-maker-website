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
            // Only prevent default if form validation fails
            if (!validateForm(this)) {
                e.preventDefault();
                return;
            }
            
            // If validation passes, let the form submit naturally to FormSubmit.co
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
        });
    }
}


// Export functions to global scope for onclick handlers if needed
window.closeSuccessModal = closeSuccessModal;