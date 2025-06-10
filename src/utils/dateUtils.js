// src/utils/dateUtils.js

// Formats a Date object to a 'YYYY-MM-DD' string for use as a key
export const formatDateKey = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) return null;
    return date.toISOString().split('T')[0];
};

// Parses a 'YYYY-MM-DD' string back to a Date object at UTC midnight
export const parseDateKey = (dateKey) => {
    if (!dateKey || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return null;
    const date = new Date(`${dateKey}T00:00:00Z`);
    return isNaN(date) ? null : date;
};

// Parses a date from a "DD/MM/YYYY" or "DD-MM-YYYY" string
// FIXED: Now handles "Completed DD/MM/YYYY" format
export const getDateFromLastOperation = (lastOpStr) => {
    if (!lastOpStr) return null;
    
    // Remove "Completed " prefix if it exists
    const cleanedStr = lastOpStr.replace(/^Completed\s+/i, '');
    
    const match = cleanedStr.match(/(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/);
    if (match) {
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1; // JS months are 0-based
        const year = parseInt(match[3], 10);
        if (day > 0 && day <= 31 && month >= 0 && month < 12 && year > 1900 && year < 2100) {
            const date = new Date(Date.UTC(year, month, day));
            if (!isNaN(date)) return date;
        }
    }
    return null;
};

// Gets the start of the week (Monday) for a given date
export const getWeekStartDate = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) return null;
    const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const dayOfWeek = d.getUTCDay(); // 0 = Sunday
    const diff = d.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to Monday
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), diff));
};

// Gets a sorted list of unique week start dates from a list of daily date keys
export const getAvailableWeeks = (allDateKeys) => {
    if (!allDateKeys || allDateKeys.length === 0) return [];
    const weekStarts = new Set();
    allDateKeys.forEach(dateKey => {
        const dateObj = parseDateKey(dateKey);
        if (dateObj) {
            const weekStartObj = getWeekStartDate(dateObj);
            if (weekStartObj) {
                weekStarts.add(formatDateKey(weekStartObj));
            }
        }
    });
    return Array.from(weekStarts).sort();
};

// Gets the day of the week name (e.g., 'Monday')
export const getDayOfWeekName = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) return '';
    const options = { weekday: 'long', timeZone: 'UTC' };
    return date.toLocaleDateString('en-US', options);
};