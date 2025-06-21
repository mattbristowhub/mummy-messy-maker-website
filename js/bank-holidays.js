// UK Bank Holidays Management

// Fixed date bank holidays (these dates are the same each year)
const FIXED_BANK_HOLIDAYS = [
    { month: 0, day: 1, name: "New Year's Day" },
    { month: 11, day: 25, name: "Christmas Day" },
    { month: 11, day: 26, name: "Boxing Day" }
];

// Bank holidays for 2025-2027 (these dates change each year)
const VARIABLE_BANK_HOLIDAYS = {
    2025: [
        { month: 3, day: 18, name: "Good Friday" },
        { month: 3, day: 21, name: "Easter Monday" },
        { month: 4, day: 5, name: "Early May Bank Holiday" },
        { month: 4, day: 26, name: "Spring Bank Holiday" },
        { month: 7, day: 25, name: "Summer Bank Holiday" }
    ],
    2026: [
        { month: 3, day: 3, name: "Good Friday" },
        { month: 3, day: 6, name: "Easter Monday" },
        { month: 4, day: 4, name: "Early May Bank Holiday" },
        { month: 4, day: 25, name: "Spring Bank Holiday" },
        { month: 7, day: 31, name: "Summer Bank Holiday" }
    ],
    2027: [
        { month: 2, day: 26, name: "Good Friday" },
        { month: 2, day: 29, name: "Easter Monday" },
        { month: 4, day: 3, name: "Early May Bank Holiday" },
        { month: 4, day: 31, name: "Spring Bank Holiday" },
        { month: 7, day: 30, name: "Summer Bank Holiday" }
    ]
};

// Check if a date is a UK bank holiday
export function isBankHoliday(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    // Check fixed holidays
    const isFixedHoliday = FIXED_BANK_HOLIDAYS.some(holiday => 
        holiday.month === month && holiday.day === day
    );
    
    if (isFixedHoliday) return true;
    
    // Check variable holidays for this year
    const yearHolidays = VARIABLE_BANK_HOLIDAYS[year];
    if (!yearHolidays) return false;
    
    return yearHolidays.some(holiday => 
        holiday.month === month && holiday.day === day
    );
}

// Get bank holiday name if the date is a bank holiday
export function getBankHolidayName(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    // Check fixed holidays
    const fixedHoliday = FIXED_BANK_HOLIDAYS.find(holiday => 
        holiday.month === month && holiday.day === day
    );
    
    if (fixedHoliday) return fixedHoliday.name;
    
    // Check variable holidays for this year
    const yearHolidays = VARIABLE_BANK_HOLIDAYS[year];
    if (!yearHolidays) return null;
    
    const variableHoliday = yearHolidays.find(holiday => 
        holiday.month === month && holiday.day === day
    );
    
    return variableHoliday ? variableHoliday.name : null;
}

// Get all bank holidays for a given year
export function getBankHolidaysForYear(year) {
    const holidays = [];
    
    // Add fixed holidays
    FIXED_BANK_HOLIDAYS.forEach(holiday => {
        const date = new Date(year, holiday.month, holiday.day);
        holidays.push({
            date: date,
            name: holiday.name,
            type: 'fixed'
        });
    });
    
    // Add variable holidays if we have data for this year
    const yearHolidays = VARIABLE_BANK_HOLIDAYS[year];
    if (yearHolidays) {
        yearHolidays.forEach(holiday => {
            const date = new Date(year, holiday.month, holiday.day);
            holidays.push({
                date: date,
                name: holiday.name,
                type: 'variable'
            });
        });
    }
    
    // Sort by date
    holidays.sort((a, b) => a.date - b.date);
    
    return holidays;
}

// Handle bank holiday substitutions (when bank holiday falls on weekend)
export function isSubstituteBankHoliday(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const dayOfWeek = date.getDay();
    
    // If it's not a Monday or Tuesday, it can't be a substitute
    if (dayOfWeek !== 1 && dayOfWeek !== 2) return false;
    
    // Check if Christmas Day (25th Dec) fell on weekend
    if (month === 11) {
        const christmas = new Date(year, 11, 25);
        const christmasDay = christmas.getDay();
        
        // If Christmas was Saturday, substitute is Monday 27th
        if (christmasDay === 6 && day === 27) {
            return true;
        }
        // If Christmas was Sunday, substitute is Tuesday 27th
        if (christmasDay === 0 && day === 27) {
            return true;
        }
        
        // Boxing Day substitutions
        const boxingDay = new Date(year, 11, 26);
        const boxingDayOfWeek = boxingDay.getDay();
        
        // If Boxing Day was Saturday, substitute is Monday 28th
        if (boxingDayOfWeek === 6 && day === 28) {
            return true;
        }
        // If Boxing Day was Sunday, substitute is Tuesday 28th
        if (boxingDayOfWeek === 0 && day === 28) {
            return true;
        }
    }
    
    // Check if New Year's Day fell on weekend
    if (month === 0) {
        const newYears = new Date(year, 0, 1);
        const newYearsDay = newYears.getDay();
        
        // If New Year's was Saturday, substitute is Monday 3rd
        if (newYearsDay === 6 && day === 3) {
            return true;
        }
        // If New Year's was Sunday, substitute is Monday 2nd
        if (newYearsDay === 0 && day === 2) {
            return true;
        }
    }
    
    return false;
}

// Main function to check if date should be blocked (bank holiday or substitute)
export function isDateBlockedForBankHoliday(date) {
    return isBankHoliday(date) || isSubstituteBankHoliday(date);
}