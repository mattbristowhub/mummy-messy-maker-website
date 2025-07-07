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
            e.preventDefault(); // Always prevent default for AJAX submission
            
            // Validate form first
            if (!validateForm(this)) {
                return;
            }
            
            // Submit via AJAX
            submitContactForm(this);
        });
    }
}

// Submit contact form via AJAX
async function submitContactForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    try {
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Prepare form data
        const formData = new FormData(form);
        
        // Submit to FormSubmit.co
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            // Success - show success message
            showSuccessMessage('Thank you for your message! We will get back to you soon.');
            form.reset(); // Clear the form
        } else {
            // Error response from FormSubmit.co
            throw new Error('Form submission failed');
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        // Show error message
        showSuccessMessage('Sorry, there was an error sending your message. Please try again or contact us directly at hello@mummysmessymakers.com');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}


// Export functions to global scope for onclick handlers if needed
window.closeSuccessModal = closeSuccessModal;