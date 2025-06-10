// src/utils/dataUtils.js

export const OPERATION_COLORS = {
    'CUT': '#4299e1',
    'SEW': '#48bb78',
    'DISPATCH': '#ed8936',
    'NEW': '#9f7aea',
};

export const getOperationColor = (operation) => OPERATION_COLORS[operation] || '#cbd5e0';

export const getFirstWord = (str) => {
    if (!str || typeof str !== 'string') return 'N/A';
    const trimmedStr = str.trim();
    return trimmedStr.split(' ')[0] || 'N/A';
};

// Generate more realistic sample data for the dashboard
export const generateSampleData = (days = 30, operationsPerDay = 50) => {
    const operators = ['Alice', 'Bob', 'Charlie', 'David', 'Emma', 'Frank'];
    const operations = ['CUT', 'SEW', 'DISPATCH'];
    const trims = ['LEATHER', 'FABRIC', 'VINYL', 'SUEDE'];
    const carpetTypes = ['Type A', 'Type B', 'Type C', 'Type D'];
    const carpetColours = ['BLACK', 'GREY', 'BLUE', 'RED', 'BROWN', 'BEIGE'];
    const sources = ['DEALER ORDER', 'SHOWROOM', 'ONLINE SALE', 'WHOLESALE'];
    
    const data = [];
    const startDate = new Date('2024-06-01');
    
    for (let day = 0; day < days; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + day);
        
        // Skip weekends for more realistic data
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) continue;
        
        // Format date as DD/MM/YYYY to match expected format
        const dd = String(currentDate.getDate()).padStart(2, '0');
        const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
        const yyyy = currentDate.getFullYear();
        const dateStr = `${dd}/${mm}/${yyyy}`;
        
        const dailyOps = Math.floor(Math.random() * 20) + operationsPerDay - 10;
        
        for (let op = 0; op < dailyOps; op++) {
            data.push({
                OperatorName: operators[Math.floor(Math.random() * operators.length)],
                OperationName: operations[Math.floor(Math.random() * operations.length)],
                LastOperation: `Completed ${dateStr}`,
                Trim: trims[Math.floor(Math.random() * trims.length)],
                CarpetType: carpetTypes[Math.floor(Math.random() * carpetTypes.length)],
                CarpetColour: carpetColours[Math.floor(Math.random() * carpetColours.length)],
                Source: sources[Math.floor(Math.random() * sources.length)]
            });
        }
    }
    
    return data;
};