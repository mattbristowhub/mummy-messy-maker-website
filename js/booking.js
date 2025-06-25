// Mummy's Messy Makers - Booking System

import { BOOKING_CONFIG_MERGED as BOOKING_CONFIG } from './config.js';
import { isDateBlockedForBankHoliday, getBankHolidayName } from './bank-holidays.js';
import { sanitizeHTML, createSafeElement, safeTemplateUpdate } from './security.js';
import { announceToScreenReader } from './accessibility.js';

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
    
    const venue = BOOKING_CONFIG.venues[venueKey];
    announceToScreenReader(`Selected ${venue.name}. Calendar loaded with available session dates.`);
    
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
    
    // Clear calendar
    calendar.innerHTML = '';
    
    // Create calendar header
    const header = createCalendarHeader(venue);
    calendar.appendChild(header);
    
    // Create calendar grid
    const grid = createCalendarGrid(venueKey, availableDates, bookedDates);
    calendar.appendChild(grid);
}

// Create calendar header safely
function createCalendarHeader(venue) {
    const header = createSafeElement('div', '', { class: 'calendar-header' });
    
    const title = createSafeElement('h3', `${venue.name} - ${venue.day}s`);
    const time = createSafeElement('p', venue.time, { class: 'calendar-time' });
    
    header.appendChild(title);
    header.appendChild(time);
    
    return header;
}

// Create calendar grid safely
function createCalendarGrid(venueKey, availableDates, bookedDates) {
    const grid = createSafeElement('div', '', { class: 'calendar-grid' });
    
    availableDates.forEach(date => {
        const dateElement = createCalendarDateElement(venueKey, date, bookedDates);
        grid.appendChild(dateElement);
    });
    
    return grid;
}

// Create individual calendar date element safely
function createCalendarDateElement(venueKey, date, bookedDates) {
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
    
    const attributes = {
        class: `calendar-date ${statusClass}`,
        'data-date': dateStr,
        'data-venue': venueKey
    };
    
    if (isDisabled) attributes.disabled = 'true';
    if (isBankHoliday && bankHolidayName) attributes.title = bankHolidayName;
    
    const dateElement = createSafeElement('div', '', attributes);
    
    const dateNumber = createSafeElement('div', date.getDate().toString(), { class: 'date-number' });
    const dateMonth = createSafeElement('div', date.toLocaleDateString('en-GB', {month: 'short'}), { class: 'date-month' });
    const dateStatus = createSafeElement('div', statusText, { class: 'date-status' });
    
    dateElement.appendChild(dateNumber);
    dateElement.appendChild(dateMonth);
    dateElement.appendChild(dateStatus);
    
    if (!isPast && !isBooked && !isBankHoliday && !isFull) {
        const spacesIndicator = createSafeElement('div', `${spacesRemaining}/15`, { class: 'spaces-indicator' });
        dateElement.appendChild(spacesIndicator);
    }
    
    return dateElement;
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
    
    const venue = BOOKING_CONFIG.venues[venueKey];
    const formattedDate = date.toLocaleDateString('en-GB', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });
    announceToScreenReader(`Selected ${formattedDate} at ${venue.name}. Proceeding to booking form.`);
    
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
        selectedSessionDisplay.innerHTML = '';
        
        const sessionInfo = createSafeElement('div', '', { class: 'selected-session-info' });
        const title = createSafeElement('h4', 'Selected Session:');
        const venueName = createSafeElement('p');
        const venueStrong = createSafeElement('strong', venue.name);
        venueName.appendChild(venueStrong);
        
        const dateP = createSafeElement('p', formattedDate);
        const timeP = createSafeElement('p', venue.time);
        const addressP = createSafeElement('p', venue.address);
        
        sessionInfo.appendChild(title);
        sessionInfo.appendChild(venueName);
        sessionInfo.appendChild(dateP);
        sessionInfo.appendChild(timeP);
        sessionInfo.appendChild(addressP);
        
        selectedSessionDisplay.appendChild(sessionInfo);
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
    
    // Create modal content safely
    modal.innerHTML = '';
    const modalContent = createSessionModalContent(venue, formattedDate, spacesRemaining, maxCapacity, currentBookings);
    modal.appendChild(modalContent);
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Create session modal content safely
function createSessionModalContent(venue, formattedDate, spacesRemaining, maxCapacity, currentBookings) {
    const content = createSafeElement('div', '', { class: 'session-modal-content' });
    
    // Close button
    const closeBtn = createSafeElement('button', '×', { 
        class: 'session-modal-close', 
        'aria-label': 'Close modal' 
    });
    
    // Session details container
    const details = createSafeElement('div', '', { class: 'session-details' });
    
    // Title
    const title = createSafeElement('h3', 'Session Details');
    details.appendChild(title);
    
    // Capacity info
    const capacityInfo = createCapacityInfoSection(spacesRemaining, maxCapacity, currentBookings);
    details.appendChild(capacityInfo);
    
    // Session info
    const sessionInfo = createSessionInfoSection(venue, formattedDate);
    details.appendChild(sessionInfo);
    
    // Instructions
    const instructions = createInstructionsSection(venue);
    details.appendChild(instructions);
    
    // Booking actions
    const actions = createBookingActionsSection();
    details.appendChild(actions);
    
    content.appendChild(closeBtn);
    content.appendChild(details);
    
    return content;
}

// Create capacity info section
function createCapacityInfoSection(spacesRemaining, maxCapacity, currentBookings) {
    const capacityInfo = createSafeElement('div', '', { class: 'capacity-info' });
    const capacityDisplay = createSafeElement('div', '', { class: 'capacity-display' });
    
    const spacesRemainingSpan = createSafeElement('span', spacesRemaining.toString(), { class: 'spaces-remaining' });
    const capacityText = createSafeElement('span', 'spaces remaining', { class: 'capacity-text' });
    
    const capacityBar = createSafeElement('div', '', { class: 'capacity-bar' });
    const capacityFilled = createSafeElement('div', '', { 
        class: 'capacity-filled',
        style: `width: ${(currentBookings / maxCapacity) * 100}%`
    });
    capacityBar.appendChild(capacityFilled);
    
    const capacityNumbers = createSafeElement('div', `${currentBookings}/${maxCapacity} booked`, { class: 'capacity-numbers' });
    
    capacityDisplay.appendChild(spacesRemainingSpan);
    capacityDisplay.appendChild(capacityText);
    capacityDisplay.appendChild(capacityBar);
    capacityDisplay.appendChild(capacityNumbers);
    
    capacityInfo.appendChild(capacityDisplay);
    return capacityInfo;
}

// Create session info section
function createSessionInfoSection(venue, formattedDate) {
    const sessionInfo = createSafeElement('div', '', { class: 'session-info' });
    
    const infoItems = [
        { label: 'Date:', value: formattedDate },
        { label: 'Time:', value: venue.time },
        { label: 'Venue:', value: venue.name },
        { label: 'Address:', value: venue.address },
        { label: 'Entry:', value: venue.entry },
        { label: 'Age Range:', value: BOOKING_CONFIG.ageRange }
    ];
    
    infoItems.forEach(item => {
        const infoItem = createSafeElement('div', '', { class: 'info-item' });
        const label = createSafeElement('strong', item.label);
        const value = createSafeElement('span', ` ${item.value}`);
        
        infoItem.appendChild(label);
        infoItem.appendChild(value);
        sessionInfo.appendChild(infoItem);
    });
    
    return sessionInfo;
}

// Create instructions section
function createInstructionsSection(venue) {
    const instructions = createSafeElement('div', '', { class: 'session-instructions' });
    
    // What to Bring
    const bringSection = createInstructionDetailsSection('What to Bring', BOOKING_CONFIG.instructions.whatToBring);
    instructions.appendChild(bringSection);
    
    // What We Provide
    const provideSection = createInstructionDetailsSection('What We Provide', BOOKING_CONFIG.instructions.whatWeProvide);
    instructions.appendChild(provideSection);
    
    // Important Information
    const importantSection = createImportantInfoSection(venue);
    instructions.appendChild(importantSection);
    
    return instructions;
}

// Create instruction details section
function createInstructionDetailsSection(title, items) {
    const details = createSafeElement('details', '', { class: 'instruction-section' });
    const summary = createSafeElement('summary', title);
    const list = createSafeElement('ul');
    
    items.forEach(item => {
        const listItem = createSafeElement('li', item);
        list.appendChild(listItem);
    });
    
    details.appendChild(summary);
    details.appendChild(list);
    
    return details;
}

// Create important info section with arrival note
function createImportantInfoSection(venue) {
    const details = createSafeElement('details', '', { class: 'instruction-section' });
    const summary = createSafeElement('summary', 'Important Information');
    const list = createSafeElement('ul');
    
    BOOKING_CONFIG.instructions.importantNotes.forEach(note => {
        const listItem = createSafeElement('li', note);
        list.appendChild(listItem);
    });
    
    const arrivalNote = createSafeElement('div', '', { class: 'arrival-note' });
    const arrivalLabel = createSafeElement('strong', 'Arrival:');
    const arrivalText = createSafeElement('span', ` ${venue.arrivalNote}`);
    
    arrivalNote.appendChild(arrivalLabel);
    arrivalNote.appendChild(arrivalText);
    
    details.appendChild(summary);
    details.appendChild(list);
    details.appendChild(arrivalNote);
    
    return details;
}

// Create booking actions section
function createBookingActionsSection() {
    const actions = createSafeElement('div', '', { class: 'booking-actions' });
    const bookBtn = createSafeElement('button', 'Book This Session', { class: 'book-session-btn' });
    
    bookBtn.addEventListener('click', () => {
        if (window.proceedToBooking) {
            window.proceedToBooking();
        }
    });
    
    actions.appendChild(bookBtn);
    return actions;
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