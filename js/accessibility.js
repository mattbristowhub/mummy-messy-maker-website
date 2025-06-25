// Accessibility Enhancements
// This module provides ARIA support and keyboard navigation improvements

// Initialize accessibility enhancements
export function initializeAccessibility() {
    enhanceFormAccessibility();
    enhanceCalendarAccessibility();
    enhanceModalAccessibility();
    enhanceNavigationAccessibility();
    setupLiveRegions();
    setupSkipLinks();
}

// Enhance form accessibility
function enhanceFormAccessibility() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Add form role and labels
        if (!form.hasAttribute('role')) {
            form.setAttribute('role', 'form');
        }
        
        // Add fieldset and legend for better screen reader support
        if (!form.querySelector('fieldset')) {
            const fieldset = document.createElement('fieldset');
            const legend = document.createElement('legend');
            const formTitle = form.closest('section')?.querySelector('h2, h3')?.textContent || 'Form';
            
            legend.textContent = formTitle;
            legend.className = 'sr-only'; // Screen reader only
            
            // Move all form children into fieldset
            while (form.firstChild) {
                fieldset.appendChild(form.firstChild);
            }
            
            fieldset.insertBefore(legend, fieldset.firstChild);
            form.appendChild(fieldset);
        }
        
        // Enhance form fields
        enhanceFormFields(form);
    });
}

// Enhance individual form fields
function enhanceFormFields(form) {
    const fields = form.querySelectorAll('input, select, textarea');
    
    fields.forEach(field => {
        // Ensure proper label association
        const label = form.querySelector(`label[for="${field.id}"]`);
        if (label && !field.hasAttribute('aria-labelledby')) {
            field.setAttribute('aria-labelledby', label.id || generateId('label'));
            if (!label.id) {
                label.id = field.getAttribute('aria-labelledby');
            }
        }
        
        // Add aria-describedby for error messages
        const errorElement = document.getElementById(field.name + '-error');
        if (errorElement && !field.hasAttribute('aria-describedby')) {
            field.setAttribute('aria-describedby', errorElement.id);
        }
        
        // Add required indicator for screen readers
        if (field.hasAttribute('required')) {
            field.setAttribute('aria-required', 'true');
        }
    });
}

// Enhance calendar accessibility
function enhanceCalendarAccessibility() {
    const calendar = document.getElementById('calendar');
    if (!calendar) return;
    
    // Add calendar role and labels
    calendar.setAttribute('role', 'application');
    calendar.setAttribute('aria-label', 'Session booking calendar');
    
    // Setup keyboard navigation for calendar
    setupCalendarKeyboardNavigation(calendar);
}

// Setup calendar keyboard navigation
function setupCalendarKeyboardNavigation(calendar) {
    calendar.addEventListener('keydown', (e) => {
        const currentDate = calendar.querySelector('.calendar-date:focus');
        if (!currentDate) return;
        
        const allDates = Array.from(calendar.querySelectorAll('.calendar-date:not([disabled])'));
        const currentIndex = allDates.indexOf(currentDate);
        
        let targetIndex;
        
        switch (e.key) {
            case 'ArrowRight':
                e.preventDefault();
                targetIndex = Math.min(currentIndex + 1, allDates.length - 1);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                targetIndex = Math.max(currentIndex - 1, 0);
                break;
            case 'ArrowDown':
                e.preventDefault();
                targetIndex = Math.min(currentIndex + 7, allDates.length - 1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                targetIndex = Math.max(currentIndex - 7, 0);
                break;
            case 'Home':
                e.preventDefault();
                targetIndex = 0;
                break;
            case 'End':
                e.preventDefault();
                targetIndex = allDates.length - 1;
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                currentDate.click();
                break;
        }
        
        if (targetIndex !== undefined && allDates[targetIndex]) {
            allDates[targetIndex].focus();
        }
    });
    
    // Make calendar dates focusable and add ARIA attributes
    calendar.addEventListener('DOMSubtreeModified', updateCalendarDatesAccessibility);
    updateCalendarDatesAccessibility(); // Initial setup
}

// Update calendar dates with accessibility attributes
function updateCalendarDatesAccessibility() {
    const calendarDates = document.querySelectorAll('.calendar-date');
    
    calendarDates.forEach((date, index) => {
        // Make focusable
        date.setAttribute('tabindex', index === 0 ? '0' : '-1');
        date.setAttribute('role', 'button');
        
        // Add descriptive labels
        const dateText = date.querySelector('.date-number')?.textContent;
        const monthText = date.querySelector('.date-month')?.textContent;
        const statusText = date.querySelector('.date-status')?.textContent;
        
        if (dateText && monthText) {
            const label = `${dateText} ${monthText}${statusText ? ', ' + statusText : ''}`;
            date.setAttribute('aria-label', label);
        }
        
        // Add state information
        if (date.hasAttribute('disabled')) {
            date.setAttribute('aria-disabled', 'true');
        }
        
        if (date.classList.contains('selected')) {
            date.setAttribute('aria-pressed', 'true');
        }
    });
}

// Enhance modal accessibility
function enhanceModalAccessibility() {
    const modals = document.querySelectorAll('[id*="modal"], [id*="Modal"]');
    
    modals.forEach(modal => {
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        
        // Add aria-labelledby if modal has a title
        const title = modal.querySelector('h1, h2, h3, h4, h5, h6');
        if (title && !modal.hasAttribute('aria-labelledby')) {
            title.id = title.id || generateId('modal-title');
            modal.setAttribute('aria-labelledby', title.id);
        }
        
        // Focus management
        setupModalFocusManagement(modal);
    });
}

// Setup modal focus management
function setupModalFocusManagement(modal) {
    modal.addEventListener('show', () => {
        // Store previously focused element
        modal.dataset.previousFocus = document.activeElement?.id || '';
        
        // Focus first focusable element in modal
        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    });
    
    modal.addEventListener('hide', () => {
        // Restore focus to previously focused element
        const previousElement = document.getElementById(modal.dataset.previousFocus);
        if (previousElement) {
            previousElement.focus();
        }
    });
    
    // Trap focus within modal
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            trapFocusInModal(e, modal);
        }
        
        if (e.key === 'Escape') {
            const closeButton = modal.querySelector('.close, [aria-label="Close"], [aria-label="Close modal"]');
            if (closeButton) {
                closeButton.click();
            }
        }
    });
}

// Trap focus within modal
function trapFocusInModal(e, modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
        if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        }
    } else {
        if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
}

// Enhance navigation accessibility
function enhanceNavigationAccessibility() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Main navigation');
    
    // Mobile menu button
    const mobileMenuButton = document.getElementById('mobileMenu');
    if (mobileMenuButton) {
        mobileMenuButton.setAttribute('aria-expanded', 'false');
        mobileMenuButton.setAttribute('aria-controls', 'navLinks');
        
        // Update aria-expanded when menu toggles
        const observer = new MutationObserver(() => {
            const navLinks = document.getElementById('navLinks');
            const isExpanded = navLinks?.classList.contains('active');
            mobileMenuButton.setAttribute('aria-expanded', isExpanded.toString());
        });
        
        const navLinks = document.getElementById('navLinks');
        if (navLinks) {
            observer.observe(navLinks, { attributes: true, attributeFilter: ['class'] });
        }
    }
}

// Setup live regions for dynamic content announcements
function setupLiveRegions() {
    // Create live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.id = 'live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
    
    // Create assertive live region for urgent announcements
    const assertiveLiveRegion = document.createElement('div');
    assertiveLiveRegion.id = 'assertive-live-region';
    assertiveLiveRegion.setAttribute('aria-live', 'assertive');
    assertiveLiveRegion.setAttribute('aria-atomic', 'true');
    assertiveLiveRegion.className = 'sr-only';
    document.body.appendChild(assertiveLiveRegion);
}

// Announce message to screen readers
export function announceToScreenReader(message, assertive = false) {
    const liveRegionId = assertive ? 'assertive-live-region' : 'live-region';
    const liveRegion = document.getElementById(liveRegionId);
    
    if (liveRegion) {
        liveRegion.textContent = message;
        
        // Clear after announcement
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
}

// Setup skip links for keyboard navigation
function setupSkipLinks() {
    const skipLinksContainer = document.createElement('div');
    skipLinksContainer.className = 'skip-links';
    
    const skipToMain = document.createElement('a');
    skipToMain.href = '#main';
    skipToMain.textContent = 'Skip to main content';
    skipToMain.className = 'skip-link';
    
    const skipToNav = document.createElement('a');
    skipToNav.href = '#navigation';
    skipToNav.textContent = 'Skip to navigation';
    skipToNav.className = 'skip-link';
    
    skipLinksContainer.appendChild(skipToMain);
    skipLinksContainer.appendChild(skipToNav);
    
    document.body.insertBefore(skipLinksContainer, document.body.firstChild);
}

// Utility function to generate unique IDs
function generateId(prefix = 'id') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Add CSS for screen reader only content and skip links
export function addAccessibilityCSS() {
    const style = document.createElement('style');
    style.textContent = `
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
        
        .skip-links {
            position: absolute;
            top: -40px;
            left: 6px;
            z-index: 1000;
        }
        
        .skip-link {
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1001;
        }
        
        .skip-link:focus {
            top: 6px;
        }
        
        .calendar-date:focus {
            outline: 2px solid #FF6B9D;
            outline-offset: 2px;
        }
        
        [role="button"]:focus,
        button:focus {
            outline: 2px solid #4ECDC4;
            outline-offset: 2px;
        }
    `;
    
    document.head.appendChild(style);
}