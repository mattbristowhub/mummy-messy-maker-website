// Mummy's Messy Makers - UI and DOM Management

import { CONFIG } from './config.js';
import { isValidEmail } from './utils.js';
import { sanitizeHTML, createSafeElement, sanitizeFormData } from './security.js';

// DOM Elements
export const elements = {
    mobileMenu: null,
    navLinks: null,
    logoImage: null,
    heroLogo: null,
    bookingForm: null,
    contactForm: null
};

// Initialize DOM elements
export function initializeElements() {
    elements.mobileMenu = document.getElementById('mobileMenu');
    elements.navLinks = document.getElementById('navLinks');
    elements.logoImage = document.getElementById('logoImage');
    elements.heroLogo = document.getElementById('heroLogo');
    elements.bookingForm = document.getElementById('bookingForm');
    elements.contactForm = document.getElementById('contactForm');
}

// Load logo images
export function loadLogos() {
    if (elements.logoImage) {
        elements.logoImage.src = CONFIG.logoPath;
    }
    if (elements.heroLogo) {
        elements.heroLogo.src = CONFIG.logoPath;
    }
}

// Setup all event listeners
export function setupEventListeners() {
    setupMobileMenu();
    setupSmoothScrolling();
    setupFormValidation();
    setupKeyboardNavigation();
    setupScrollNavigation();
}

// Mobile menu functionality
function setupMobileMenu() {
    if (elements.mobileMenu && elements.navLinks) {
        elements.mobileMenu.addEventListener('click', () => {
            elements.navLinks.classList.toggle('active');
        });
    }
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                if (elements.navLinks) {
                    elements.navLinks.classList.remove('active');
                }
            }
        });
    });
}

// Form validation - Main entry point
export function validateForm(form) {
    const validator = new FormValidator(form);
    return validator.validate();
}

// Form Validation Service
class FormValidator {
    constructor(form) {
        this.form = form;
        this.errors = [];
        this.isValid = true;
    }
    
    validate() {
        this.reset();
        const requiredFields = this.form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            this.validateField(field);
        });
        
        this.handleValidationResults();
        return this.isValid;
    }
    
    reset() {
        this.errors = [];
        this.isValid = true;
        hideValidationSummary();
    }
    
    validateField(field) {
        const fieldLabel = this.getFieldLabel(field);
        const errorElement = document.getElementById(field.name + '-error');
        
        // Required field validation
        if (!this.validateRequired(field)) {
            const message = 'This field is required';
            this.addError(field, errorElement, fieldLabel, message);
            return;
        }
        
        // Clear previous errors for valid required fields
        clearFieldError(field, errorElement);
        
        // Type-specific validation
        this.validateFieldType(field, errorElement, fieldLabel);
    }
    
    validateRequired(field) {
        return field.value.trim().length > 0;
    }
    
    validateFieldType(field, errorElement, fieldLabel) {
        // Email validation
        if (field.type === 'email' && !isValidEmail(field.value)) {
            const message = 'Please enter a valid email address';
            this.addError(field, errorElement, fieldLabel, message);
            return;
        }
        
        // Age validation
        if (field.name === 'child-age' && !isValidAge(field.value)) {
            const message = 'Please enter a valid age (e.g., "18 months", "2 years")';
            this.addError(field, errorElement, fieldLabel, message);
            return;
        }
    }
    
    addError(field, errorElement, fieldLabel, message) {
        showFieldError(field, errorElement, message);
        this.errors.push(`${fieldLabel}: ${message}`);
        this.isValid = false;
    }
    
    getFieldLabel(field) {
        return this.form.querySelector(`label[for="${field.id}"]`)?.textContent.replace('*', '').trim() || field.name;
    }
    
    handleValidationResults() {
        if (!this.isValid) {
            showValidationSummary(this.errors);
            this.scrollToValidationSummary();
        }
    }
    
    scrollToValidationSummary() {
        const summary = document.getElementById('validation-summary');
        if (summary) {
            summary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
}

// Show field error
function showFieldError(field, errorElement, message) {
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('sr-only');
    }
    field.setAttribute('aria-invalid', 'true');
}

// Clear field error
function clearFieldError(field, errorElement) {
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.add('sr-only');
    }
    field.removeAttribute('aria-invalid');
}

// Show validation summary
function showValidationSummary(errors) {
    const summary = document.getElementById('validation-summary');
    const errorsList = document.getElementById('validation-errors');
    
    if (summary && errorsList) {
        errorsList.innerHTML = '';
        errors.forEach(error => {
            const li = document.createElement('li');
            li.textContent = error;
            errorsList.appendChild(li);
        });
        summary.classList.add('show');
    }
}

// Hide validation summary
function hideValidationSummary() {
    const summary = document.getElementById('validation-summary');
    if (summary) {
        summary.classList.remove('show');
    }
}

// Validate age input
function isValidAge(ageStr) {
    if (!ageStr || !ageStr.trim()) return false;
    
    const age = ageStr.toLowerCase().trim();
    
    // Check for common age formats
    const agePatterns = [
        /^\d+\s*(months?|mths?|m)$/,  // "18 months", "6 m"
        /^\d+\s*(years?|yrs?|y)$/,    // "2 years", "3 y"
        /^\d+$/,                      // Just a number (assume years)
        /^\d+\.\d+\s*(years?|yrs?|y)?$/, // "2.5 years"
        /^\d+\s*-\s*\d+\s*(months?|years?)$/ // "18-24 months"
    ];
    
    return agePatterns.some(pattern => pattern.test(age));
}

// Show success message
export function showSuccessMessage(message) {
    showContactSuccessMessage(message);
}

// Show contact form success message
function showContactSuccessMessage(message) {
    // Remove any existing modal
    const existingModal = document.getElementById('contactSuccessModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'contactSuccessModal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); display: flex; justify-content: center;
        align-items: center; z-index: 3000; padding: 2rem;
    `;
    
    // Create modal content safely
    const modalContent = createSafeElement('div', '', {
        style: 'background: white; padding: 3rem; border-radius: 20px; text-align: center; max-width: 500px; width: 100%;'
    });
    
    // Success emoji
    const emoji = createSafeElement('div', '✅', {
        style: 'font-size: 4rem; margin-bottom: 1rem;'
    });
    
    // Title
    const title = createSafeElement('h2', 'Message Sent!', {
        style: 'color: #4ECDC4; margin-bottom: 1rem;'
    });
    
    // Message
    const messageP = createSafeElement('p', sanitizeHTML(message), {
        style: 'color: #666; margin-bottom: 2rem; line-height: 1.6;'
    });
    
    // Close button
    const closeBtn = createSafeElement('button', 'Close', {
        style: 'background: linear-gradient(135deg, #4ECDC4, #FF6B9D); color: white; border: none; padding: 15px 30px; border-radius: 25px; font-size: 1.1rem; cursor: pointer; font-weight: bold;'
    });
    
    closeBtn.addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = 'auto';
    });
    
    modalContent.appendChild(emoji);
    modalContent.appendChild(title);
    modalContent.appendChild(messageP);
    modalContent.appendChild(closeBtn);
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// Setup real-time form validation using event delegation
function setupFormValidation() {
    // Use event delegation on document for better performance
    document.addEventListener('input', handleFieldInput);
    document.addEventListener('blur', handleFieldBlur);
}

// Handle input events using event delegation
function handleFieldInput(event) {
    const field = event.target;
    if (!isFormField(field)) return;
    
    const errorElement = document.getElementById(field.name + '-error');
    clearFieldError(field, errorElement);
    
    // Hide validation summary when user starts correcting errors
    const form = field.closest('form');
    if (form) {
        const hasErrors = form.querySelectorAll('[aria-invalid="true"]').length > 1;
        if (!hasErrors) {
            hideValidationSummary();
        }
    }
}

// Handle blur events using event delegation
function handleFieldBlur(event) {
    const field = event.target;
    if (!isFormField(field)) return;
    
    const errorElement = document.getElementById(field.name + '-error');
    
    if (field.hasAttribute('required') && !field.value.trim()) {
        showFieldError(field, errorElement, 'This field is required');
    } else if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
        showFieldError(field, errorElement, 'Please enter a valid email address');
    } else if (field.name === 'child-age' && field.value && !isValidAge(field.value)) {
        showFieldError(field, errorElement, 'Please enter a valid age (e.g., "18 months", "2 years")');
    } else {
        clearFieldError(field, errorElement);
    }
}

// Check if element is a form field we want to validate
function isFormField(element) {
    return element.matches('input, select, textarea') && element.form;
}

// Setup scroll animations
export function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animation
    document.querySelectorAll('.feature-card, .service-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity ${CONFIG.animationDuration}ms ease, transform ${CONFIG.animationDuration}ms ease`;
        observer.observe(el);
    });
}

// Keyboard navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && elements.navLinks && elements.navLinks.classList.contains('active')) {
            elements.navLinks.classList.remove('active');
            if (elements.mobileMenu) {
                elements.mobileMenu.focus();
            }
        }
    });
}

// Active navigation highlighting
function setupScrollNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    function updateActiveNavItem() {
        const scrollPosition = window.scrollY + CONFIG.scrollOffset;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navItems.forEach(item => item.classList.remove('active'));
                if (navItems[index]) {
                    navItems[index].classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavItem);
    updateActiveNavItem(); // Initialize on load
}

// Show loading message
export function showLoadingMessage(message) {
    const existingModal = document.getElementById('loadingModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'loadingModal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); display: flex; justify-content: center;
        align-items: center; z-index: 3000;
    `;
    
    // Create modal content safely
    const modalContent = createSafeElement('div', '', {
        style: 'background: white; padding: 3rem; border-radius: 15px; text-align: center; max-width: 400px;'
    });
    
    // Spinner container
    const spinnerContainer = createSafeElement('div', '', {
        style: 'margin-bottom: 2rem;'
    });
    const spinner = createSafeElement('div', '', {
        style: 'border: 4px solid #f3f3f3; border-top: 4px solid #FF6B9D; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto;'
    });
    spinnerContainer.appendChild(spinner);
    
    // Message elements
    const title = createSafeElement('h3', sanitizeHTML(message), {
        style: 'color: #FF6B9D; margin-bottom: 1rem;'
    });
    const description = createSafeElement('p', 'Please wait while we process your booking...', {
        style: 'color: #666;'
    });
    
    modalContent.appendChild(spinnerContainer);
    modalContent.appendChild(title);
    modalContent.appendChild(description);
    
    modal.appendChild(modalContent);
    
    // Add spinner animation
    const style = document.createElement('style');
    style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
    document.head.appendChild(style);
    
    document.body.appendChild(modal);
}

// Show booking success message
export function showBookingSuccessMessage(bookingData) {
    // Remove loading modal
    const loadingModal = document.getElementById('loadingModal');
    if (loadingModal) {
        loadingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'successModal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); display: flex; justify-content: center;
        align-items: center; z-index: 3000; padding: 2rem;
    `;
    
    const formattedDate = new Date(bookingData.date).toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Sanitize booking data
    const safeBookingData = sanitizeFormData(bookingData);
    
    // Create modal content safely
    const modalContent = createBookingSuccessModalContent(safeBookingData, formattedDate);
    modal.appendChild(modalContent);
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// Create booking success modal content safely
function createBookingSuccessModalContent(bookingData, formattedDate) {
    const modalContent = createSafeElement('div', '', {
        style: 'background: white; padding: 3rem; border-radius: 20px; text-align: center; max-width: 500px; width: 100%;'
    });
    
    // Celebration emoji
    const emoji = createSafeElement('div', '🎉', {
        style: 'font-size: 4rem; margin-bottom: 1rem;'
    });
    
    // Title
    const title = createSafeElement('h2', 'Booking Confirmed!', {
        style: 'color: #4ECDC4; margin-bottom: 1rem;'
    });
    
    // Session details container
    const detailsContainer = createSafeElement('div', '', {
        style: 'background: #FFF8F0; padding: 2rem; border-radius: 15px; margin: 2rem 0; text-align: left;'
    });
    
    const detailsTitle = createSafeElement('h3', 'Your Session Details', {
        style: 'color: #FF6B9D; margin-bottom: 1rem; text-align: center;'
    });
    
    const details = [
        { label: 'Booking ID:', value: bookingData.bookingId },
        { label: 'Child:', value: bookingData.childName },
        { label: 'Date:', value: formattedDate },
        { label: 'Venue:', value: bookingData.venue },
        { label: 'Time:', value: bookingData.time }
    ];
    
    detailsContainer.appendChild(detailsTitle);
    
    details.forEach(detail => {
        const p = createSafeElement('p');
        const label = createSafeElement('strong', detail.label);
        const value = createSafeElement('span', ` ${detail.value}`);
        p.appendChild(label);
        p.appendChild(value);
        detailsContainer.appendChild(p);
    });
    
    // Email confirmation
    const emailContainer = createSafeElement('div', '', {
        style: 'background: #e8f5e8; padding: 1.5rem; border-radius: 10px; margin: 1.5rem 0;'
    });
    
    const emailP = createSafeElement('p', '', {
        style: 'margin: 0; color: #2e7d32;'
    });
    const emailLabel = createSafeElement('strong', '📧 Confirmation email sent to:');
    const emailValue = createSafeElement('span', ` ${bookingData.email}`);
    emailP.appendChild(emailLabel);
    emailP.appendChild(emailValue);
    emailContainer.appendChild(emailP);
    
    // Instructions
    const instructions = createSafeElement('p', 'Please check your email for full details and instructions. We can\'t wait to see you both!', {
        style: 'color: #666; margin-bottom: 2rem;'
    });
    
    // Close button
    const closeBtn = createSafeElement('button', 'Close', {
        style: 'background: linear-gradient(135deg, #4ECDC4, #FF6B9D); color: white; border: none; padding: 15px 30px; border-radius: 25px; font-size: 1.1rem; cursor: pointer; font-weight: bold;'
    });
    
    closeBtn.addEventListener('click', closeSuccessModal);
    
    modalContent.appendChild(emoji);
    modalContent.appendChild(title);
    modalContent.appendChild(detailsContainer);
    modalContent.appendChild(emailContainer);
    modalContent.appendChild(instructions);
    modalContent.appendChild(closeBtn);
    
    return modalContent;
}

// Close success modal
export function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}