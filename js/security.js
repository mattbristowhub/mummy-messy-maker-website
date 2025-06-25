// Mummy's Messy Makers - Security Utilities

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} html - HTML string to sanitize
 * @returns {string} - Sanitized HTML string
 */
export function sanitizeHTML(html) {
    if (!html || typeof html !== 'string') return '';
    
    // Create a temporary element to parse HTML
    const temp = document.createElement('div');
    temp.textContent = html;
    return temp.innerHTML;
}

/**
 * Create safe DOM element with sanitized content
 * @param {string} tagName - HTML tag name
 * @param {string} content - Content to sanitize
 * @param {Object} attributes - Attributes to set
 * @returns {HTMLElement} - Safe DOM element
 */
export function createSafeElement(tagName, content = '', attributes = {}) {
    const element = document.createElement(tagName);
    
    // Sanitize text content
    if (content) {
        element.textContent = content;
    }
    
    // Set safe attributes
    Object.entries(attributes).forEach(([key, value]) => {
        if (isSafeAttribute(key) && value != null) {
            element.setAttribute(key, String(value));
        }
    });
    
    return element;
}

/**
 * Check if an attribute is safe to set
 * @param {string} attributeName - Name of the attribute
 * @returns {boolean} - True if safe
 */
function isSafeAttribute(attributeName) {
    const safeAttributes = [
        'id', 'class', 'data-*', 'aria-*', 'role',
        'title', 'alt', 'href', 'src', 'width', 'height',
        'type', 'value', 'name', 'placeholder', 'required',
        'disabled', 'readonly', 'checked', 'selected'
    ];
    
    return safeAttributes.some(safe => {
        if (safe.endsWith('*')) {
            return attributeName.startsWith(safe.slice(0, -1));
        }
        return attributeName === safe;
    });
}

/**
 * Safely update innerHTML with template and data
 * @param {HTMLElement} element - Target element
 * @param {string} template - HTML template string
 * @param {Object} data - Data to interpolate
 */
export function safeTemplateUpdate(element, template, data = {}) {
    if (!element || !template) return;
    
    // Replace template variables with sanitized data
    let safeHTML = template;
    Object.entries(data).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        const safeValue = sanitizeHTML(String(value || ''));
        safeHTML = safeHTML.replace(new RegExp(placeholder, 'g'), safeValue);
    });
    
    // Use textContent for user data, innerHTML only for static templates
    element.innerHTML = safeHTML;
}

/**
 * Validate and sanitize email address
 * @param {string} email - Email to validate
 * @returns {string|null} - Sanitized email or null if invalid
 */
export function sanitizeEmail(email) {
    if (!email || typeof email !== 'string') return null;
    
    const sanitized = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    return emailRegex.test(sanitized) ? sanitized : null;
}

/**
 * Sanitize form data before processing
 * @param {FormData|Object} formData - Form data to sanitize
 * @returns {Object} - Sanitized form data
 */
export function sanitizeFormData(formData) {
    const sanitized = {};
    
    const processValue = (value) => {
        if (typeof value === 'string') {
            return value.trim().replace(/[<>]/g, '');
        }
        return value;
    };
    
    if (formData instanceof FormData) {
        for (const [key, value] of formData.entries()) {
            sanitized[key] = processValue(value);
        }
    } else if (typeof formData === 'object' && formData !== null) {
        Object.entries(formData).forEach(([key, value]) => {
            sanitized[key] = processValue(value);
        });
    }
    
    return sanitized;
}