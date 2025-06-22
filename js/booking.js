// Mummy's Messy Makers - Booking System

import { BOOKING_CONFIG } from './config.js';
import { isDateBlockedForBankHoliday, getBankHolidayName } from './bank-holidays.js';

// Booking System State
export const bookingState = {
    selectedVenue: null,
    selectedDate: null,
    availableDates: new Map(), // venue -> array of dates
    bookedDates: new Map(), // venue -> array of booked dates
    sessionBookings: new Map(), // venue -> Map<dateStr, bookingCount>
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear()
};

// DOM Elements (booking-specific)
export const bookingElements = {
    bookingSystem: null,
    venueSelector: null,
    calendar: null,
    sessionModal: null
};

// Initialize booking system
export function initializeBookingSystem() {
    bookingElements.bookingSystem = document.getElementById('bookingSystem');
    bookingElements.venueSelector = document.getElementById('venueSelector');
    bookingElements.calendar = document.getElementById('calendar');
    bookingElements.sessionModal = document.getElementById('sessionModal');
    
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
    
    // Initialize session booking counts with sample data
    initializeSessionBookings();
}

// Initialize session booking counts with sample data
function initializeSessionBookings() {
    const mondayBookings = new Map();
    const fridayBookings = new Map();
    
    // Add some sample bookings for demonstration
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    // Sample: Some sessions have different booking counts
    const allMondayDates = bookingState.availableDates.get('monday') || [];
    const allFridayDates = bookingState.availableDates.get('friday') || [];
    
    // Initialize all sessions with 0 bookings (15 spaces available)
    allMondayDates.forEach((date, index) => {
        const dateStr = date.toISOString().split('T')[0];
        mondayBookings.set(dateStr, 0);
    });
    
    allFridayDates.forEach((date, index) => {
        const dateStr = date.toISOString().split('T')[0];
        fridayBookings.set(dateStr, 0);
    });
    
    bookingState.sessionBookings.set('monday', mondayBookings);
    bookingState.sessionBookings.set('friday', fridayBookings);
}

// Get spaces remaining for a session
function getSpacesRemaining(venueKey, dateStr) {
    const maxCapacity = BOOKING_CONFIG.maxCapacity;
    const venueBookings = bookingState.sessionBookings.get(venueKey);
    
    if (!venueBookings) return maxCapacity;
    
    const currentBookings = venueBookings.get(dateStr) || 0;
    return Math.max(0, maxCapacity - currentBookings);
}

// Check if session is full
function isSessionFull(venueKey, dateStr) {
    return getSpacesRemaining(venueKey, dateStr) === 0;
}

// Increment booking count for a session
export function incrementBookingCount(venueKey, dateStr) {
    const venueBookings = bookingState.sessionBookings.get(venueKey);
    if (venueBookings) {
        const currentCount = venueBookings.get(dateStr) || 0;
        venueBookings.set(dateStr, currentCount + 1);
        
        // Update calendar display
        updateCalendarDisplay();
    }
}

// Setup booking system event listeners
function setupBookingEventListeners() {
    // Venue selection
    document.addEventListener('click', (e) => {
        const venueButton = e.target.closest('[data-venue]');
        if (venueButton) {
            selectVenue(venueButton.dataset.venue);
        }
        
        const dateButton = e.target.closest('[data-date]');
        if (dateButton) {
            selectDate(dateButton.dataset.date, dateButton.dataset.venue);
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
    const calendar = bookingElements.calendar;
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
                const isBankHoliday = isDateBlockedForBankHoliday(date);
                const bankHolidayName = getBankHolidayName(date);
                const spacesRemaining = getSpacesRemaining(venueKey, dateStr);
                const isFull = isSessionFull(venueKey, dateStr);
                const isDisabled = isBooked || isPast || isBankHoliday || isFull;
                
                let statusText = `${spacesRemaining} spaces left`;
                let statusClass = '';
                
                if (isPast) {
                    statusText = 'Past';
                    statusClass = 'past';
                } else if (isBooked) {
                    statusText = 'Booked';
                    statusClass = 'booked';
                } else if (isBankHoliday) {
                    statusText = 'Bank Holiday';
                    statusClass = 'bank-holiday';
                } else if (isFull) {
                    statusText = 'Full';
                    statusClass = 'full';
                } else if (spacesRemaining <= 3) {
                    statusClass = 'low-availability';
                }
                
                return `
                    <div class="calendar-date ${statusClass}" 
                         data-date="${dateStr}" 
                         data-venue="${venueKey}"
                         ${isDisabled ? 'disabled' : ''}
                         ${isBankHoliday ? `title="${bankHolidayName || 'Bank Holiday'}"` : ''}>
                        <div class="date-number">${date.getDate()}</div>
                        <div class="date-month">${date.toLocaleDateString('en-GB', {month: 'short'})}</div>
                        <div class="date-status">
                            ${statusText}
                        </div>
                        ${!isPast && !isBooked && !isBankHoliday && !isFull ? `<div class="spaces-indicator">${spacesRemaining}/15</div>` : ''}
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
    bookingState.selectedVenue = venueKey;
    
    // Add visual feedback - highlight selected date
    document.querySelectorAll('.calendar-date').forEach(el => el.classList.remove('selected'));
    const selectedDateElement = document.querySelector(`[data-date="${dateStr}"]`);
    if (selectedDateElement) {
        selectedDateElement.classList.add('selected');
    }
    
    // Auto-navigate to booking form after brief delay for visual feedback
    setTimeout(() => {
        navigateToBookingForm(venueKey, date);
    }, 300);
}

// Navigate to booking form after date selection
function navigateToBookingForm(venueKey, date) {
    const venue = BOOKING_CONFIG.venues[venueKey];
    const formattedDate = date.toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Update selected session display
    const selectedSessionDisplay = document.getElementById('selected-session-display');
    if (selectedSessionDisplay) {
        selectedSessionDisplay.innerHTML = `
            <div class="selected-session-info">
                <h4>Selected Session:</h4>
                <p><strong>${venue.name}</strong></p>
                <p>${formattedDate}</p>
                <p>${venue.time}</p>
                <p>${venue.address}</p>
            </div>
        `;
        selectedSessionDisplay.style.display = 'block';
    }
    
    // Show booking form section
    const bookingSection = document.querySelector('.booking-section');
    if (bookingSection) {
        bookingSection.style.display = 'block';
        bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Set form values
    const venueInput = document.querySelector('input[name="selected-venue"]');
    const dateInput = document.querySelector('input[name="selected-date"]');
    const timeInput = document.querySelector('input[name="selected-time"]');
    const addressInput = document.querySelector('input[name="selected-address"]');
    
    if (venueInput) venueInput.value = venue.name;
    if (dateInput) dateInput.value = date.toISOString().split('T')[0];
    if (timeInput) timeInput.value = venue.time;
    if (addressInput) addressInput.value = venue.address;
}

// Show session details modal
function showSessionModal(venueKey, date) {
    const venue = BOOKING_CONFIG.venues[venueKey];
    const modal = bookingElements.sessionModal;
    if (!modal) return;
    
    const formattedDate = date.toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const dateStr = date.toISOString().split('T')[0];
    const spacesRemaining = getSpacesRemaining(venueKey, dateStr);
    const maxCapacity = BOOKING_CONFIG.maxCapacity;
    const currentBookings = maxCapacity - spacesRemaining;
    
    modal.innerHTML = `
        <div class="session-modal-content">
            <button class="session-modal-close" aria-label="Close modal">&times;</button>
            <div class="session-details">
                <h3>Session Details</h3>
                
                <div class="capacity-info">
                    <div class="capacity-display">
                        <span class="spaces-remaining">${spacesRemaining}</span>
                        <span class="capacity-text">spaces remaining</span>
                        <div class="capacity-bar">
                            <div class="capacity-filled" style="width: ${(currentBookings / maxCapacity) * 100}%"></div>
                        </div>
                        <div class="capacity-numbers">${currentBookings}/${maxCapacity} booked</div>
                    </div>
                </div>
                
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
                    <button class="book-session-btn" onclick="window.proceedToBooking()">
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
export function closeSessionModal() {
    const modal = bookingElements.sessionModal;
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Show booking confirmation form
export function showBookingForm() {
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

// Reset booking state
export function resetBookingState() {
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