// Mummy's Messy Makers - UI and DOM Management

import { CONFIG } from './config.js';
import { isValidEmail } from './utils.js';

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

// Form validation
export function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        const errorElement = document.getElementById(field.name + '-error');
        
        if (!field.value.trim()) {
            showFieldError(field, errorElement, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field, errorElement);
            
            // Email validation
            if (field.type === 'email' && !isValidEmail(field.value)) {
                showFieldError(field, errorElement, 'Please enter a valid email address');
                isValid = false;
            }
        }
    });
    
    return isValid;
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

// Show success message
export function showSuccessMessage(message) {
    // In a real implementation, you might want to show a nicer modal or notification
    alert(message);
}

// Setup real-time form validation
function setupFormValidation() {
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('input', function() {
            const errorElement = document.getElementById(this.name + '-error');
            clearFieldError(this, errorElement);
        });
    });
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
    
    modal.innerHTML = `
        <div style="background: white; padding: 3rem; border-radius: 15px; text-align: center; max-width: 400px;">
            <div style="margin-bottom: 2rem;">
                <div style="border: 4px solid #f3f3f3; border-top: 4px solid #FF6B9D; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
            </div>
            <h3 style="color: #FF6B9D; margin-bottom: 1rem;">${message}</h3>
            <p style="color: #666;">Please wait while we process your booking...</p>
        </div>
    `;
    
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
    
    modal.innerHTML = `
        <div style="background: white; padding: 3rem; border-radius: 20px; text-align: center; max-width: 500px; width: 100%;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
            <h2 style="color: #4ECDC4; margin-bottom: 1rem;">Booking Confirmed!</h2>
            <div style="background: #FFF8F0; padding: 2rem; border-radius: 15px; margin: 2rem 0; text-align: left;">
                <h3 style="color: #FF6B9D; margin-bottom: 1rem; text-align: center;">Your Session Details</h3>
                <p><strong>Booking ID:</strong> ${bookingData.bookingId}</p>
                <p><strong>Child:</strong> ${bookingData.childName}</p>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Venue:</strong> ${bookingData.venue}</p>
                <p><strong>Time:</strong> ${bookingData.time}</p>
            </div>
            <div style="background: #e8f5e8; padding: 1.5rem; border-radius: 10px; margin: 1.5rem 0;">
                <p style="margin: 0; color: #2e7d32;"><strong>📧 Confirmation email sent to:</strong> ${bookingData.email}</p>
            </div>
            <p style="color: #666; margin-bottom: 2rem;">Please check your email for full details and instructions. We can't wait to see you both!</p>
            <button onclick="window.closeSuccessModal()" style="background: linear-gradient(135deg, #4ECDC4, #FF6B9D); color: white; border: none; padding: 15px 30px; border-radius: 25px; font-size: 1.1rem; cursor: pointer; font-weight: bold;">
                Close
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// Close success modal
export function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}