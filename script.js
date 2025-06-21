// Mummy's Messy Makers - Main JavaScript

// Import modules
import { initializeElements, loadLogos, setupEventListeners, setupScrollAnimations, validateForm, showSuccessMessage, showLoadingMessage, showBookingSuccessMessage, closeSuccessModal } from './js/ui.js';
import { initializeBookingSystem, bookingState, showBookingForm, resetBookingState, closeSessionModal } from './js/booking.js';
import { sendConfirmationEmail } from './js/email.js';
import { generateBookingId } from './js/utils.js';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    setupScrollAnimations();
    loadLogos();
    initializeBookingSystem();
    setupFormHandlers();
});

// Setup form handlers
function setupFormHandlers() {
    const bookingForm = document.getElementById('bookingForm');
    const contactForm = document.getElementById('contactForm');

    // Booking form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                handleBookingSubmission(this);
            }
        });
    }

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

// Handle booking form submission
function handleBookingSubmission(form) {
    const formData = new FormData(form);
    const bookingData = {
        parentName: formData.get('parent-name'),
        childName: formData.get('child-name'),
        childAge: formData.get('child-age'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        specialRequirements: formData.get('special-requirements'),
        venue: formData.get('selected-venue'),
        date: formData.get('selected-date'),
        time: formData.get('selected-time'),
        address: formData.get('selected-address'),
        bookingId: generateBookingId(),
        submittedAt: new Date().toISOString()
    };
    
    // Show loading state
    showLoadingMessage('Processing your booking...');
    
    // Simulate API call (replace with actual backend integration)
    setTimeout(() => {
        // Send confirmation email
        sendConfirmationEmail(bookingData);
        
        // Show success message
        showBookingSuccessMessage(bookingData);
        
        // Reset form and booking state
        form.reset();
        resetBookingState();
        
        // Hide selected session display
        document.getElementById('selected-session-display').style.display = 'none';
    }, 2000);
}

// Export functions to global scope for onclick handlers
window.proceedToBooking = function() {
    closeSessionModal();
    showBookingForm();
};

window.closeSuccessModal = closeSuccessModal;