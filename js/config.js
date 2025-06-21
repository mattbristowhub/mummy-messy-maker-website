// Mummy's Messy Makers - Configuration

// Main Configuration
export const CONFIG = {
    logoPath: 'images/MMM_TRANSPARENT_LOGO.png',
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
export const EMAIL_CONFIG = {
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
export const BOOKING_CONFIG = {
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