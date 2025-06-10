import React, { createContext, useReducer, useContext } from 'react';

// REMOVED dailyData, weeklyData, weeklyPerDayData from initial state
const initialState = {
    isLoading: false,
    error: null,
    fileName: '',
    viewType: 'chart',
    rawData: [],
    operators: [],
    operations: [],
    trims: [],
    carpetTypes: [],
    carpetColours: [],
    sources: [],
    currentDate: null,
    availableDates: [],
    availableWeeks: [],
    timeGranularity: 'daily',
    analysisType: 'operator',
};

function dashboardReducer(state, action) {
    switch (action.type) {
        case 'START_LOADING':
            return { ...state, isLoading: true, error: null };
        
        case 'RESET_FOR_NEW_FILE':
            return { ...initialState, fileName: action.payload.fileName, isLoading: true };

        case 'PROCESS_DATA_SUCCESS':
            return { ...state, isLoading: false, error: null, ...action.payload };

        case 'PROCESS_DATA_ERROR':
            return { ...initialState, isLoading: false, error: action.payload.error };

        case 'SET_ANALYSIS_TYPE':
            return { ...state, analysisType: action.payload };
        
        case 'SET_TIME_GRANULARITY':
            return { 
                ...state, 
                timeGranularity: action.payload.granularity,
                currentDate: action.payload.newDate,
                viewType: action.payload.granularity === 'weeklyPerDay' ? 'chart' : state.viewType,
            };

        case 'SET_CURRENT_DATE':
            return { ...state, currentDate: action.payload };

        case 'SET_VIEW_TYPE':
            return { ...state, viewType: action.payload };

        // REMOVED 'SET_AGGREGATED_DATA' case as it's no longer needed
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
    const [state, dispatch] = useReducer(dashboardReducer, initialState);
    return (
        <DashboardContext.Provider value={{ state, dispatch }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
};