// Mummy's Messy Makers - Main JavaScript

// Configuration
const CONFIG = {
    logoPath: 'images/MMM_TRANSPARENT_LOGO.png', // Update this path
    animationDuration: 600,
    scrollOffset: 100
};

// DOM Elements
const elements = {
    mobileMenu: null,
    navLinks: null,
    logoImage: null,
    heroLogo: null,
    bookingForm: null,
    contactForm: null
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    setupScrollAnimations();
    loadLogos();
});

// Initialize DOM elements
function initializeElements() {
    elements.mobileMenu = document.getElementById('mobileMenu');
    elements.navLinks = document.getElementById('navLinks');
    elements.logoImage = document.getElementById('logoImage');
    elements.heroLogo = document.getElementById('heroLogo');
    elements.bookingForm = document.getElementById('bookingForm');
    elements.contactForm = document.getElementById('contactForm');
}

// Load logo images
function loadLogos() {
    if (elements.logoImage) {
        elements.logoImage.src = CONFIG.logoPath;
    }
    if (elements.heroLogo) {
        elements.heroLogo.src = CONFIG.logoPath;
    }
}

// Setup all event listeners
function setupEventListeners() {
    setupMobileMenu();
    setupSmoothScrolling();
    setupFormHandlers();
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
function validateForm(form) {
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

// Email validation helper
function isValidEmail(email) {
    return email.includes('@') && email.includes('.');
}

// Setup form handlers
function setupFormHandlers() {
    // Booking form submission
    if (elements.bookingForm) {
        elements.bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                showSuccessMessage('Thank you for your booking request! We will contact you within 24 hours to confirm your class.');
                this.reset();
            }
        });
    }

    // Contact form submission
    if (elements.contactForm) {
        elements.contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                showSuccessMessage('Thank you for your message! We will get back to you soon.');
                this.reset();
            }
        });
    }
}

// Show success message
function showSuccessMessage(message) {
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
function setupScrollAnimations() {
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

// Utility functions
const utils = {
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, elements, utils };
}