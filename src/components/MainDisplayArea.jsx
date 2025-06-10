// src/components/MainDisplayArea.jsx - FINAL VERSION
import React, { useMemo, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import { getOperationColor } from '../utils/dataUtils';
import { parseDateKey, formatDateKey, getDayOfWeekName } from '../utils/dateUtils';

// The aggregation function is a standalone helper
const aggregateData = (dataToFilter, analysisField, categorySet, operationsList) => {
    // This check prevents the 'forEach of undefined' error
    if (!categorySet || !operationsList) {
        return [];
    }
    const stats = {};
    categorySet.forEach(cat => {
        stats[cat] = { name: cat, total: 0 };
        operationsList.forEach(op => { stats[cat][op] = 0; });
    });

    dataToFilter.forEach(row => {
        let categoryValue = (row[analysisField] || 'N/A');
        if (analysisField === 'Source') {
            categoryValue = (row.Source || 'N/A').split(' ')[0] || 'N/A';
        } else if (['Trim', 'CarpetColour'].includes(analysisField)) {
            categoryValue = categoryValue.toUpperCase();
        }
        
        const operation = row.OperationName;
        if (categoryValue && operation && stats[categoryValue] && operationsList.includes(operation)) {
            stats[categoryValue][operation] = (stats[categoryValue][operation] || 0) + 1;
            stats[categoryValue].total = (stats[categoryValue].total || 0) + 1;
        }
    });

    return Object.values(stats).filter(item => item.total > 0).sort((a, b) => b.total - a.total);
};


export const MainDisplayArea = () => {
    const { state } = useDashboard();
    const {
        isLoading, error, rawData, timeGranularity, currentDate, analysisType, viewType,
        operators, operations, trims, carpetTypes, carpetColours, sources
    } = state;

    // --- MISSING HELPER FUNCTIONS - NOW ADDED ---
    const getCurrentCategorySet = useCallback(() => {
        switch (analysisType) {
            case 'trim': return trims;
            case 'carpetType': return carpetTypes;
            case 'carpetColour': return carpetColours;
            case 'source': return sources;
            case 'operator': default: return operators;
        }
    }, [analysisType, operators, trims, carpetTypes, carpetColours, sources]);

    const getCurrentAnalysisField = useCallback(() => {
        switch (analysisType) {
            case 'trim': return 'Trim';
            case 'carpetType': return 'CarpetType';
            case 'carpetColour': return 'CarpetColour';
            case 'source': return 'Source';
            case 'operator': default: return 'OperatorName';
        }
    }, [analysisType]);

    const getCategoryAxisLabel = useCallback(() => {
        switch (analysisType) {
           case 'trim': return 'Trim';
           case 'carpetType': return 'Carpet Type';
           case 'carpetColour': return 'Carpet Colour';
           case 'source': return 'Sales Channel'; 
           case 'operator':
           default: return 'Operator';
        }
    }, [analysisType]);
    // ------------------------------------------

    const chartData = useMemo(() => {
        // Guard clause to ensure we don't run this without data
        if (!rawData.length || !currentDate || !analysisType || !operations.length) {
            console.log('🚫 Guard clause triggered:', { 
                rawDataLength: rawData.length, 
                currentDate, 
                analysisType, 
                operationsLength: operations.length 
            });
            return { daily: [], weekly: [], weeklyPerDay: {} };
        }

        const categorySet = getCurrentCategorySet();
        const analysisField = getCurrentAnalysisField();
        
        console.log('📊 Chart data calculation:', {
            currentDate,
            timeGranularity,
            analysisType,
            analysisField,
            categorySetLength: categorySet?.length,
            operationsLength: operations.length
        });
        
        // Calculate Daily Data
        const dataForCurrentDate = rawData.filter(row => row.processedDateKey === currentDate);
        console.log('📅 Daily data filter:', {
            currentDate,
            totalRows: rawData.length,
            filteredRows: dataForCurrentDate.length,
            sampleDates: rawData.slice(0, 3).map(r => r.processedDateKey)
        });
        const daily = aggregateData(dataForCurrentDate, analysisField, categorySet, operations);
        console.log('📊 Daily aggregated:', daily);

        // Calculate Weekly Data
        const weekStartObj = parseDateKey(currentDate);
        let weekly = [];
        let weeklyPerDay = {};
        if (weekStartObj) {
            const weekEndObj = new Date(weekStartObj);
            weekEndObj.setUTCDate(weekStartObj.getUTCDate() + 6);
            const weekEndKey = formatDateKey(weekEndObj);
            const dataForWeek = rawData.filter(row => row.processedDateKey >= currentDate && row.processedDateKey <= weekEndKey);
            console.log('📅 Weekly data filter:', {
                weekStart: currentDate,
                weekEnd: weekEndKey,
                filteredRows: dataForWeek.length
            });
            weekly = aggregateData(dataForWeek, analysisField, categorySet, operations);
            console.log('📊 Weekly aggregated:', weekly);

            // Calculate Weekly Per Day Data
            for (let i = 0; i < 7; i++) {
                const dayDate = new Date(weekStartObj);
                dayDate.setUTCDate(weekStartObj.getUTCDate() + i);
                const dayKey = formatDateKey(dayDate);
                const dataForDay = rawData.filter(row => row.processedDateKey === dayKey);
                weeklyPerDay[dayKey] = aggregateData(dataForDay, analysisField, categorySet, operations);
            }
        }
        
        return { daily, weekly, weeklyPerDay };

    }, [rawData, currentDate, timeGranularity, analysisType, operations, getCurrentCategorySet, getCurrentAnalysisField]);

    // --- RENDER LOGIC ---

    if (isLoading) {
        return <div className="flex-1 bg-white p-4 rounded-lg shadow flex items-center justify-center text-gray-500">...Loading</div>;
    }
    if (error && !rawData.length) {
        return <div className="flex-1 bg-white p-4 rounded-lg shadow text-red-600">Error: {error}</div>;
    }
    if (!rawData.length) {
         return (
            <div className="flex-1 bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center text-gray-500">
                <p className="mb-2 text-lg">Welcome!</p>
                <p className="text-sm text-center">Load an Excel file or the example data to view production statistics.</p>
            </div>
        );
    }
    
    const displayData = timeGranularity === 'daily' ? chartData.daily : chartData.weekly;
    const hasDataToShow = timeGranularity === 'weeklyPerDay' ? Object.values(chartData.weeklyPerDay).some(dayData => dayData.length > 0) : displayData.length > 0;
    
    console.log('🎨 Render logic:', {
        timeGranularity,
        displayDataLength: displayData.length,
        hasDataToShow,
        chartDataDaily: chartData.daily.length,
        chartDataWeekly: chartData.weekly.length,
        displayDataSample: displayData.slice(0, 2)
    });
            
    if (!hasDataToShow) {
         console.log('❌ No data to show - returning empty message');
         return (
             <div className="flex-1 bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center text-gray-400">
                 <p className="mb-2">No production data found for this period.</p>
             </div>
         );
    }

    return (
        <div className="flex-1 bg-white p-4 rounded-lg shadow overflow-hidden flex flex-col">
            {(timeGranularity === 'daily' || timeGranularity === 'weekly') && (
                <>
                    {console.log('🎯 About to render main BarChart:', {
                        timeGranularity,
                        displayDataLength: displayData.length,
                        operations: operations,
                        displayDataSample: displayData[0],
                        fullDisplayData: displayData,
                        operationsArray: operations
                    })}
                    <ResponsiveContainer width="100%" height="100%" minHeight={400}>
                        <BarChart data={displayData} margin={{ top: 5, right: 10, left: 0, bottom: 75 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11 }} interval={0} label={{ value: getCategoryAxisLabel(), position: 'insideBottom', dy: 65, fontSize: 12, fontWeight: 'bold' }} />
                            <YAxis tick={{ fontSize: 11 }} label={{ value: 'Count', angle: -90, position: 'insideLeft', dx: -5 }} />
                            <Tooltip cursor={{ fill: 'rgba(200, 200, 200, 0.3)' }} />
                            <Legend verticalAlign="top" height={36} />
                            {operations.map((op) => (
                                <Bar key={op} dataKey={op} stackId="a" fill={getOperationColor(op)} name={op}>
                                    <LabelList 
                                        dataKey={op} 
                                        position="center" 
                                        style={{ fill: 'white', fontSize: '12px', fontWeight: 'bold' }}
                                        formatter={(value) => value > 0 ? value : ''}
                                    />
                                </Bar>
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </>
            )}
            {timeGranularity === 'weeklyPerDay' && (
                 <div className="flex-1 overflow-auto">
                    <div className="flex flex-wrap gap-4 p-1">
                        {Object.keys(chartData.weeklyPerDay).map((dayKey) => {
                            const dayData = chartData.weeklyPerDay[dayKey];
                            const dayName = getDayOfWeekName(parseDateKey(dayKey));
                            const dayDateShort = parseDateKey(dayKey).toLocaleDateString('en-GB', { day:'2-digit', month:'short' });
                            return (
                                <div key={dayKey} className="flex-grow min-w-[300px] basis-[calc(33.33%-1rem)] border rounded-md p-3 shadow-sm flex flex-col h-80">
                                    <h3 className="text-sm font-semibold text-center text-indigo-700 mb-2">{dayName} ({dayDateShort})</h3>
                                    {dayData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={dayData} layout="vertical" margin={{ top: 5, right: 5, left: -25, bottom: 5 }} barSize={10}>
                                                <XAxis type="number" tick={{ fontSize: 9 }} allowDecimals={false} />
                                                <YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 9 }} interval={0} />
                                                <Tooltip contentStyle={{ fontSize: '10px' }}/>
                                                {operations.map((op) => (
                                                    <Bar key={op} dataKey={op} stackId="a" fill={getOperationColor(op)} name={op}>
                                                        <LabelList 
                                                            dataKey={op} 
                                                            position="center" 
                                                            style={{ fill: 'white', fontSize: '10px', fontWeight: 'bold' }}
                                                            formatter={(value) => value > 0 ? value : ''}
                                                        />
                                                    </Bar>
                                                ))}
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center text-xs text-gray-400">No data</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                 </div>
            )}
        </div>
    );
};