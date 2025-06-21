// Mummy's Messy Makers - Email System

import { EMAIL_CONFIG, BOOKING_CONFIG } from './config.js';

// Helper functions for venue details
function getVenueEntry(venueName) {
    const venue = Object.values(BOOKING_CONFIG.venues).find(v => v.name === venueName);
    return venue?.entry || 'Main entrance';
}

function getVenueArrivalNote(venueName) {
    const venue = Object.values(BOOKING_CONFIG.venues).find(v => v.name === venueName);
    return venue?.arrivalNote || 'Please arrive on time';
}

// Send confirmation email
export function sendConfirmationEmail(bookingData) {
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