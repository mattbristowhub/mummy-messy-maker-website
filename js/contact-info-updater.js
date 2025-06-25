// Contact Information Updater
// This utility updates contact information throughout the website from config

import { CONTACT_CONFIG } from './config.js';
import { createSafeElement } from './security.js';

// Update all contact information on page load
export function updateContactInformation() {
    updateContactSection();
    updateFooterContact();
}

// Update contact section information
function updateContactSection() {
    const contactInfo = document.querySelector('.contact-info');
    if (!contactInfo) return;
    
    // Update phone number
    const phoneItem = contactInfo.querySelector('.contact-item:nth-child(2) p');
    if (phoneItem) {
        phoneItem.textContent = CONTACT_CONFIG.phone.display;
    }
    
    // Update email address  
    const emailItem = contactInfo.querySelector('.contact-item:nth-child(3) p');
    if (emailItem) {
        emailItem.textContent = CONTACT_CONFIG.email.display;
    }
    
    // Update address
    const addressItem = contactInfo.querySelector('.contact-item:nth-child(4) p');
    if (addressItem) {
        addressItem.innerHTML = CONTACT_CONFIG.address.display;
    }
    
    // Update hours
    const hoursItem = contactInfo.querySelector('.contact-item:nth-child(5) p');
    if (hoursItem) {
        hoursItem.innerHTML = CONTACT_CONFIG.hours.display;
    }
    
    // Update social links
    updateSocialLinks(contactInfo);
}

// Update social media links
function updateSocialLinks(contactInfo) {
    const socialLinks = contactInfo.querySelector('.social-links');
    if (!socialLinks) return;
    
    const facebookLink = socialLinks.querySelector('a:nth-child(1)');
    const instagramLink = socialLinks.querySelector('a:nth-child(2)');
    const whatsappLink = socialLinks.querySelector('a:nth-child(3)');
    
    if (facebookLink) facebookLink.href = CONTACT_CONFIG.social.facebook;
    if (instagramLink) instagramLink.href = CONTACT_CONFIG.social.instagram;
    if (whatsappLink) whatsappLink.href = CONTACT_CONFIG.social.whatsapp;
}

// Update footer contact information
function updateFooterContact() {
    // This would update footer contact info if it exists
    // Implementation depends on footer structure
}

// Create contact info element programmatically
export function createContactInfoElement() {
    const contactInfo = createSafeElement('div', '', { class: 'contact-info' });
    
    // Title
    const title = createSafeElement('h3', 'Contact Information');
    contactInfo.appendChild(title);
    
    // Phone
    const phoneItem = createContactItem('📞', CONTACT_CONFIG.phone.display);
    contactInfo.appendChild(phoneItem);
    
    // Email
    const emailItem = createContactItem('✉️', CONTACT_CONFIG.email.display);
    contactInfo.appendChild(emailItem);
    
    // Address
    const addressItem = createContactItem('📍', CONTACT_CONFIG.address.display, true);
    contactInfo.appendChild(addressItem);
    
    // Hours
    const hoursItem = createContactItem('🕒', CONTACT_CONFIG.hours.display, true);
    contactInfo.appendChild(hoursItem);
    
    // Social links
    const socialLinks = createSocialLinksElement();
    contactInfo.appendChild(socialLinks);
    
    return contactInfo;
}

// Helper function to create contact item
function createContactItem(icon, text, allowHTML = false) {
    const item = createSafeElement('div', '', { class: 'contact-item' });
    const iconSpan = createSafeElement('span', icon, { class: 'contact-icon' });
    const textP = createSafeElement('p');
    
    if (allowHTML) {
        textP.innerHTML = text;
    } else {
        textP.textContent = text;
    }
    
    item.appendChild(iconSpan);
    item.appendChild(textP);
    
    return item;
}

// Helper function to create social links
function createSocialLinksElement() {
    const socialLinks = createSafeElement('div', '', { class: 'social-links' });
    
    const facebookLink = createSafeElement('a', '📘', {
        href: CONTACT_CONFIG.social.facebook,
        class: 'social-link',
        'aria-label': 'Facebook'
    });
    
    const instagramLink = createSafeElement('a', '📷', {
        href: CONTACT_CONFIG.social.instagram,
        class: 'social-link',
        'aria-label': 'Instagram'
    });
    
    const whatsappLink = createSafeElement('a', '💬', {
        href: CONTACT_CONFIG.social.whatsapp,
        class: 'social-link',
        'aria-label': 'WhatsApp'
    });
    
    socialLinks.appendChild(facebookLink);
    socialLinks.appendChild(instagramLink);
    socialLinks.appendChild(whatsappLink);
    
    return socialLinks;
}