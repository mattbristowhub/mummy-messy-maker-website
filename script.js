// Mummy's Messy Makers - Main JavaScript

// Configuration
const CONFIG = {
    logoPath: 'images/MMM_TRANSPARENT_LOGO.png', // Update this path
    animationDuration: 600,
    scrollOffset: 100
};

// EmailJS Configuration - Update these with your EmailJS details
// SETUP INSTRUCTIONS:
// 1. Go to https://www.emailjs.com and create free account
// 2. Add email service (Gmail recommended)
// 3. Create email template with variables listed below
// 4. Get Service ID, Template ID, and Public Key from dashboard
// 5. Update values below and set enabled: true
const EMAIL_CONFIG = {
    serviceId: 'service_zy2pzfb', // From EmailJS dashboard
    templateId: 'template_8fx9dbj', // From EmailJS dashboard  
    publicKey: '6w6FB_exinVULW6wL', // From EmailJS dashboard
    enabled: true // Set to true after setup
};

// EMAIL TEMPLATE VARIABLES (use these in your EmailJS template):
// {{to_email}} {{to_name}} {{subject}} {{booking_id}} {{child_name}} 
// {{child_age}} {{venue_name}} {{session_date}} {{session_time}} 
// {{venue_address}} {{venue_entry}} {{arrival_note}} {{parent_phone}}
// {{special_requirements}} {{what_to_bring}} {{what_we_provide}} {{important_notes}}

// Booking System Configuration
const BOOKING_CONFIG = {
    venues: {
        monday: {
            name: 'Bersted Jubilee Hall',
            day: 'Monday',
            time: '10:00am - 11:00am',
            address: 'PO21 5TU',
            entry: 'Main double doors, turn right',
            startTime: '10:00am',
            arrivalNote: 'Arrive early for 10:00am prompt start'
        },
        friday: {
            name: 'Felpham Memorial Village Hall',
            day: 'Friday',
            time: '09:30am - 10:30am',
            address: 'PO22 7DZ',
            entry: 'Main double doors into main hall',
            startTime: '09:30am',
            arrivalNote: 'Arrive early for 09:30am prompt start'
        }
    },
    ageRange: '6 months - 5 years',
    sessionDuration: 60, // minutes
    maxCapacity: 15,
    instructions: {
        whatToBring: [
            'Change of clothes for your little one',
            'Baby wipes',
            'Water bottle',
            'Camera for memories (optional)'
        ],
        whatWeProvide: [
            'All sensory play materials',
            'Protective floor coverings',
            'Cleaning supplies',
            'Hand sanitizer',
            'Paper towels'
        ],
        importantNotes: [
            'Sessions are suitable for ages 6 months to 5 years',
            'Parent/guardian must remain with child at all times',
            'All materials are non-toxic and child-safe',
            'Please arrive on time as sessions start promptly',
            'Late arrivals may not be admitted for safety reasons'
        ]
    }
};

// DOM Elements
const elements = {
    mobileMenu: null,
    navLinks: null,
    logoImage: null,
    heroLogo: null,
    bookingForm: null,
    contactForm: null,
    bookingSystem: null,
    venueSelector: null,
    calendar: null,
    sessionModal: null
};

// Booking System State
const bookingState = {
    selectedVenue: null,
    selectedDate: null,
    availableDates: new Map(), // venue -> array of dates
    bookedDates: new Map(), // venue -> array of booked dates
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear()
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    setupScrollAnimations();
    loadLogos();
    initializeBookingSystem();
});

// Initialize DOM elements
function initializeElements() {
    elements.mobileMenu = document.getElementById('mobileMenu');
    elements.navLinks = document.getElementById('navLinks');
    elements.logoImage = document.getElementById('logoImage');
    elements.heroLogo = document.getElementById('heroLogo');
    elements.bookingForm = document.getElementById('bookingForm');
    elements.contactForm = document.getElementById('contactForm');
    elements.bookingSystem = document.getElementById('bookingSystem');
    elements.venueSelector = document.getElementById('venueSelector');
    elements.calendar = document.getElementById('calendar');
    elements.sessionModal = document.getElementById('sessionModal');
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
                handleBookingSubmission(this);
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

// =================
// BOOKING SYSTEM
// =================

// Initialize booking system
function initializeBookingSystem() {
    generateAvailableDates();
    setupBookingEventListeners();
}

// Generate available dates for both venues
function generateAvailableDates() {
    const today = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 3); // 3 months ahead
    
    const mondayDates = [];
    const fridayDates = [];
    
    // Generate Mondays
    let current = new Date(today);
    while (current.getDay() !== 1) {
        current.setDate(current.getDate() + 1);
    }
    
    while (current <= endDate) {
        if (current >= today) {
            mondayDates.push(new Date(current));
        }
        current.setDate(current.getDate() + 7);
    }
    
    // Generate Fridays
    current = new Date(today);
    while (current.getDay() !== 5) {
        current.setDate(current.getDate() + 1);
    }
    
    while (current <= endDate) {
        if (current >= today) {
            fridayDates.push(new Date(current));
        }
        current.setDate(current.getDate() + 7);
    }
    
    bookingState.availableDates.set('monday', mondayDates);
    bookingState.availableDates.set('friday', fridayDates);
    
    // Initialize some sample booked dates
    bookingState.bookedDates.set('monday', []);
    bookingState.bookedDates.set('friday', []);
}

// Setup booking system event listeners
function setupBookingEventListeners() {
    // Venue selection
    document.addEventListener('click', (e) => {
        if (e.target.matches('[data-venue]')) {
            selectVenue(e.target.dataset.venue);
        }
        
        if (e.target.matches('[data-date]')) {
            selectDate(e.target.dataset.date, e.target.dataset.venue);
        }
        
        if (e.target.matches('.session-modal-close')) {
            closeSessionModal();
        }
        
        if (e.target.matches('#sessionModal')) {
            closeSessionModal();
        }
    });
}

// Select venue and show calendar
function selectVenue(venueKey) {
    bookingState.selectedVenue = venueKey;
    document.querySelectorAll('[data-venue]').forEach(btn => {
        btn.classList.remove('selected');
    });
    document.querySelector(`[data-venue="${venueKey}"]`).classList.add('selected');
    
    renderCalendar(venueKey);
    showCalendarSection();
}

// Render calendar for selected venue
function renderCalendar(venueKey) {
    const calendar = elements.calendar;
    if (!calendar) return;
    
    const venue = BOOKING_CONFIG.venues[venueKey];
    const availableDates = bookingState.availableDates.get(venueKey) || [];
    const bookedDates = bookingState.bookedDates.get(venueKey) || [];
    
    calendar.innerHTML = `
        <div class="calendar-header">
            <h3>${venue.name} - ${venue.day}s</h3>
            <p class="calendar-time">${venue.time}</p>
        </div>
        <div class="calendar-grid">
            ${availableDates.map(date => {
                const dateStr = date.toISOString().split('T')[0];
                const isBooked = bookedDates.some(bookedDate => 
                    bookedDate.toISOString().split('T')[0] === dateStr
                );
                const isPast = date < new Date().setHours(0,0,0,0);
                
                return `
                    <div class="calendar-date ${isBooked ? 'booked' : ''} ${isPast ? 'past' : ''}" 
                         data-date="${dateStr}" 
                         data-venue="${venueKey}"
                         ${!isBooked && !isPast ? '' : 'disabled'}>
                        <div class="date-number">${date.getDate()}</div>
                        <div class="date-month">${date.toLocaleDateString('en-GB', {month: 'short'})}</div>
                        <div class="date-status">
                            ${isBooked ? 'Booked' : isPast ? 'Past' : 'Available'}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Show calendar section
function showCalendarSection() {
    const calendarSection = document.querySelector('.calendar-section');
    if (calendarSection) {
        calendarSection.style.display = 'block';
        calendarSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Select date and show session details
function selectDate(dateStr, venueKey) {
    const date = new Date(dateStr + 'T12:00:00');
    bookingState.selectedDate = date;
    showSessionModal(venueKey, date);
}

// Show session details modal
function showSessionModal(venueKey, date) {
    const venue = BOOKING_CONFIG.venues[venueKey];
    const modal = elements.sessionModal;
    if (!modal) return;
    
    const formattedDate = date.toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    modal.innerHTML = `
        <div class="session-modal-content">
            <button class="session-modal-close" aria-label="Close modal">&times;</button>
            <div class="session-details">
                <h3>Session Details</h3>
                <div class="session-info">
                    <div class="info-item">
                        <strong>Date:</strong> ${formattedDate}
                    </div>
                    <div class="info-item">
                        <strong>Time:</strong> ${venue.time}
                    </div>
                    <div class="info-item">
                        <strong>Venue:</strong> ${venue.name}
                    </div>
                    <div class="info-item">
                        <strong>Address:</strong> ${venue.address}
                    </div>
                    <div class="info-item">
                        <strong>Entry:</strong> ${venue.entry}
                    </div>
                    <div class="info-item">
                        <strong>Age Range:</strong> ${BOOKING_CONFIG.ageRange}
                    </div>
                </div>
                
                <div class="session-instructions">
                    <details class="instruction-section">
                        <summary>What to Bring</summary>
                        <ul>
                            ${BOOKING_CONFIG.instructions.whatToBring.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </details>
                    
                    <details class="instruction-section">
                        <summary>What We Provide</summary>
                        <ul>
                            ${BOOKING_CONFIG.instructions.whatWeProvide.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </details>
                    
                    <details class="instruction-section">
                        <summary>Important Information</summary>
                        <ul>
                            ${BOOKING_CONFIG.instructions.importantNotes.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                        <div class="arrival-note">
                            <strong>Arrival:</strong> ${venue.arrivalNote}
                        </div>
                    </details>
                </div>
                
                <div class="booking-actions">
                    <button class="book-session-btn" onclick="proceedToBooking()">
                        Book This Session
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close session modal
function closeSessionModal() {
    const modal = elements.sessionModal;
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Proceed to booking form
function proceedToBooking() {
    closeSessionModal();
    showBookingForm();
}

// Show booking confirmation form
function showBookingForm() {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
        
        // Pre-populate form with selected session details
        const venue = BOOKING_CONFIG.venues[bookingState.selectedVenue];
        const dateStr = bookingState.selectedDate.toLocaleDateString('en-GB');
        const formattedDate = bookingState.selectedDate.toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Update form to show selected session
        const formTitle = document.querySelector('#booking .section-title');
        if (formTitle) {
            formTitle.textContent = `Confirm Your Booking`;
        }
        
        // Populate hidden fields
        document.getElementById('selected-venue').value = venue.name;
        document.getElementById('selected-date').value = dateStr;
        document.getElementById('selected-time').value = venue.time;
        document.getElementById('selected-address').value = venue.address;
        
        // Show session summary
        document.getElementById('display-venue').textContent = venue.name;
        document.getElementById('display-date').textContent = formattedDate;
        document.getElementById('display-time').textContent = venue.time;
        document.getElementById('selected-session-display').style.display = 'block';
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

// Generate unique booking ID
function generateBookingId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `MMM-${timestamp}-${random}`.toUpperCase();
}

// Send confirmation email
function sendConfirmationEmail(bookingData) {
    const emailContent = generateConfirmationEmailContent(bookingData);
    
    // Log email content for development
    console.log('Confirmation Email Content:', emailContent);
    
    if (EMAIL_CONFIG.enabled && typeof emailjs !== 'undefined') {
        // Initialize EmailJS with your public key
        emailjs.init(EMAIL_CONFIG.publicKey);
        
        // Format date for email
        const formattedDate = new Date(bookingData.date).toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Send email using EmailJS
        emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, {
            to_email: bookingData.email,
            to_name: bookingData.parentName,
            subject: emailContent.subject,
            booking_id: bookingData.bookingId,
            child_name: bookingData.childName,
            child_age: bookingData.childAge,
            venue_name: bookingData.venue,
            session_date: formattedDate,
            session_time: bookingData.time,
            venue_address: bookingData.address,
            venue_entry: getVenueEntry(bookingData.venue),
            arrival_note: getVenueArrivalNote(bookingData.venue),
            parent_phone: bookingData.phone || 'Not provided',
            special_requirements: bookingData.specialRequirements || 'None',
            what_to_bring: BOOKING_CONFIG.instructions.whatToBring.join('\n• '),
            what_we_provide: BOOKING_CONFIG.instructions.whatWeProvide.join('\n• '),
            important_notes: BOOKING_CONFIG.instructions.importantNotes.join('\n• ')
        }).then(
            function(response) {
                console.log('Email sent successfully:', response);
            },
            function(error) {
                console.error('Email sending failed:', error);
                // Show user-friendly error message
                alert('Booking confirmed, but there was an issue sending the confirmation email. Please screenshot your booking details.');
            }
        );
    } else {
        console.log('EmailJS not configured. Email content prepared:', emailContent);
        // In development/testing, you could show the email content in a modal
        if (!EMAIL_CONFIG.enabled) {
            console.warn('EmailJS is disabled. Set EMAIL_CONFIG.enabled = true after configuration.');
        }
    }
}

// Helper functions for venue details
function getVenueEntry(venueName) {
    const venue = Object.values(BOOKING_CONFIG.venues).find(v => v.name === venueName);
    return venue?.entry || 'Main entrance';
}

function getVenueArrivalNote(venueName) {
    const venue = Object.values(BOOKING_CONFIG.venues).find(v => v.name === venueName);
    return venue?.arrivalNote || 'Please arrive on time';
}

// Generate confirmation email content
function generateConfirmationEmailContent(bookingData) {
    const venue = Object.values(BOOKING_CONFIG.venues).find(v => v.name === bookingData.venue);
    const formattedDate = new Date(bookingData.date).toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #FF6B9D, #4ECDC4); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #fff; padding: 30px; border: 1px solid #ddd; }
                .booking-details { background: #FFF8F0; padding: 20px; border-radius: 10px; margin: 20px 0; }
                .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #666; }
                .highlight { color: #FF6B9D; font-weight: bold; }
                .instructions { background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0; }
                .important { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ffc107; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Booking Confirmed!</h1>
                    <p>Your sensory play adventure is booked</p>
                </div>
                
                <div class="content">
                    <h2>Dear ${bookingData.parentName},</h2>
                    <p>Thank you for booking a session with <strong>Mummy's Messy Makers</strong>! We're excited to welcome you and ${bookingData.childName} to our sensory play session.</p>
                    
                    <div class="booking-details">
                        <h3>📅 Your Booking Details</h3>
                        <p><strong>Booking ID:</strong> <span class="highlight">${bookingData.bookingId}</span></p>
                        <p><strong>Child:</strong> ${bookingData.childName} (${bookingData.childAge})</p>
                        <p><strong>Date:</strong> ${formattedDate}</p>
                        <p><strong>Time:</strong> ${bookingData.time}</p>
                        <p><strong>Venue:</strong> ${bookingData.venue}</p>
                        <p><strong>Address:</strong> ${bookingData.address}</p>
                        <p><strong>Entry Instructions:</strong> ${venue?.entry || 'Main entrance'}</p>
                    </div>
                    
                    <div class="important">
                        <h3>⏰ Important Reminder</h3>
                        <p><strong>${venue?.arrivalNote || 'Please arrive on time'}</strong></p>
                        <p>Late arrivals may not be admitted for safety reasons.</p>
                    </div>
                    
                    <div class="instructions">
                        <h3>📝 What to Bring</h3>
                        <ul>
                            ${BOOKING_CONFIG.instructions.whatToBring.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                        
                        <h3>🎨 What We Provide</h3>
                        <ul>
                            ${BOOKING_CONFIG.instructions.whatWeProvide.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <p>If you have any questions or need to make changes to your booking, please don't hesitate to contact us:</p>
                    <p>📞 <strong>+44 7123 456 789</strong><br>
                    ✉️ <strong>hello@mummysmessymakers.co.uk</strong></p>
                    
                    <p>We can't wait to see you both!</p>
                    <p>Best regards,<br><strong>The Mummy's Messy Makers Team</strong></p>
                </div>
                
                <div class="footer">
                    <p>© 2025 Mummy's Messy Makers. All rights reserved.</p>
                    <p>This is an automated confirmation email. Please keep this for your records.</p>
                </div>
            </div>
        </body>
        </html>
    `;
    
    const emailText = `
Booking Confirmed - Mummy's Messy Makers

Dear ${bookingData.parentName},

Thank you for booking a session with Mummy's Messy Makers! We're excited to welcome you and ${bookingData.childName} to our sensory play session.

YOUR BOOKING DETAILS:
Booking ID: ${bookingData.bookingId}
Child: ${bookingData.childName} (${bookingData.childAge})
Date: ${formattedDate}
Time: ${bookingData.time}
Venue: ${bookingData.venue}
Address: ${bookingData.address}
Entry Instructions: ${venue?.entry || 'Main entrance'}

IMPORTANT REMINDER:
${venue?.arrivalNote || 'Please arrive on time'}
Late arrivals may not be admitted for safety reasons.

WHAT TO BRING:
${BOOKING_CONFIG.instructions.whatToBring.map(item => `• ${item}`).join('\n')}

WHAT WE PROVIDE:
${BOOKING_CONFIG.instructions.whatWeProvide.map(item => `• ${item}`).join('\n')}

If you have any questions or need to make changes to your booking, please contact us:
Phone: +44 7123 456 789
Email: hello@mummysmessymakers.co.uk

We can't wait to see you both!

Best regards,
The Mummy's Messy Makers Team

© 2025 Mummy's Messy Makers. All rights reserved.
This is an automated confirmation email. Please keep this for your records.
    `;
    
    return {
        html: emailHtml,
        text: emailText,
        subject: `Booking Confirmed - ${bookingData.venue} on ${formattedDate}`
    };
}

// Show loading message
function showLoadingMessage(message) {
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
function showBookingSuccessMessage(bookingData) {
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
            <button onclick="closeSuccessModal()" style="background: linear-gradient(135deg, #4ECDC4, #FF6B9D); color: white; border: none; padding: 15px 30px; border-radius: 25px; font-size: 1.1rem; cursor: pointer; font-weight: bold;">
                Close
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// Close success modal
function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Reset booking state
function resetBookingState() {
    bookingState.selectedVenue = null;
    bookingState.selectedDate = null;
    
    // Reset venue selection
    document.querySelectorAll('[data-venue]').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Hide calendar
    const calendarSection = document.querySelector('.calendar-section');
    if (calendarSection) {
        calendarSection.style.display = 'none';
    }
    
    // Reset form title
    const formTitle = document.querySelector('#booking .section-title');
    if (formTitle) {
        formTitle.textContent = 'Book Your Class';
    }
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, BOOKING_CONFIG, elements, utils, bookingState };
}