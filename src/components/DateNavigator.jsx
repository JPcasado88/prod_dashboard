// src/components/DateNavigator.jsx
import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { parseDateKey } from '../utils/dateUtils'; // We need this to format the date

export const DateNavigator = () => {
  const { state, dispatch } = useDashboard();
  const { 
    isLoading, 
    currentDate, 
    timeGranularity, 
    availableDates, 
    availableWeeks,
    rawData
  } = state;

  if (!rawData.length) {
    return null; // Don't show the navigator if no data is loaded
  }

  // Helper to format the date for display
  const formatDateDisplay = (dateKey) => {
    if (!dateKey) return 'No Date Selected';
    const dateObj = parseDateKey(dateKey);
    if (!dateObj) return dateKey;

    if (timeGranularity === 'weekly' || timeGranularity === 'weeklyPerDay') {
      const weekEndObj = new Date(dateObj);
      weekEndObj.setUTCDate(dateObj.getUTCDate() + 6);
      const startStr = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', timeZone: 'UTC' });
      const endStr = weekEndObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
      return `Week: ${startStr} - ${endStr}`;
    } else {
      const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
      return dateObj.toLocaleDateString('en-US', options);
    }
  };

  const currentList = timeGranularity === 'daily' ? availableDates : availableWeeks;
  const currentIndex = currentDate ? currentList.indexOf(currentDate) : -1;
  
  const canGoPrev = !isLoading && currentIndex > 0;
  const canGoNext = !isLoading && currentIndex !== -1 && currentIndex < currentList.length - 1;

  const goToPrev = () => {
    if (canGoPrev) {
      dispatch({ type: 'SET_CURRENT_DATE', payload: currentList[currentIndex - 1] });
    }
  };

  const goToNext = () => {
    if (canGoNext) {
      dispatch({ type: 'SET_CURRENT_DATE', payload: currentList[currentIndex + 1] });
    }
  };

  return (
    <div className="bg-white p-3 rounded-lg shadow mb-4 flex items-center justify-between">
      <button
        onClick={goToPrev}
        disabled={!canGoPrev}
        className="p-2 rounded disabled:text-gray-300 text-blue-600 hover:bg-blue-50 disabled:hover:bg-transparent disabled:cursor-not-allowed"
        aria-label={`Previous ${timeGranularity === 'daily' ? 'Day' : 'Week'}`}
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex items-center text-center px-2">
        <Calendar size={20} className="mr-2 text-indigo-600 flex-shrink-0" />
        <span className="font-semibold text-sm sm:text-base">{formatDateDisplay(currentDate)}</span>
      </div>

      <button
        onClick={goToNext}
        disabled={!canGoNext}
        className="p-2 rounded disabled:text-gray-300 text-blue-600 hover:bg-blue-50 disabled:hover:bg-transparent disabled:cursor-not-allowed"
        aria-label={`Next ${timeGranularity === 'daily' ? 'Day' : 'Week'}`}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};