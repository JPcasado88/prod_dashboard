// src/components/Controls.jsx
import React from 'react';
import { Upload, FileText, Clock, CalendarDays, Grid, Zap } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { useDataProcessor } from '../hooks/useDataProcessor';

export const Controls = () => {
  const { state, dispatch } = useDashboard();
  const { isLoading, error, rawData, analysisType, timeGranularity } = state;
  
  // Destructure the functions from our hook
  const { loadAndProcessFile, loadExampleData, loadSampleData } = useDataProcessor(dispatch);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    loadAndProcessFile(file);
    event.target.value = null;
  };
  
  const handleAnalysisTypeChange = (e) => {
    dispatch({ type: 'SET_ANALYSIS_TYPE', payload: e.target.value });
  };

  const handleTimeGranularityChange = (newGranularity) => {
    // This logic can be expanded later
    dispatch({ 
        type: 'SET_TIME_GRANULARITY', 
        payload: { 
            granularity: newGranularity, 
            newDate: state.currentDate // Placeholder
        } 
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4 flex flex-wrap gap-4 items-start">
      {/* File Input */}
      <div className="flex-1 min-w-[250px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">Load Data</label>
        <div className="flex items-center space-x-2">
          <label className={`cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm inline-flex items-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <Upload size={16} className="mr-1" /> <span>Upload Excel</span>
            <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" disabled={isLoading} />
          </label>

          {/* --- EXAMPLE DATA BUTTONS --- */}
          <button 
            onClick={loadExampleData}
            className={`bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm inline-flex items-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} 
            disabled={isLoading}>
              <FileText size={16} className="mr-1" /> <span>Load Example</span>
          </button>
          <button 
            onClick={loadSampleData}
            className={`bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm inline-flex items-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} 
            disabled={isLoading}>
              <Zap size={16} className="mr-1" /> <span>Generate Sample</span>
          </button>
        </div>
        {isLoading && <p className="text-xs text-blue-600 mt-1 animate-pulse">Loading data...</p>}
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>

      {/* Time Granularity Selection and Analysis Type (rest of the component is the same) */}
      <div className="flex-1 min-w-[240px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">Time View</label>
        <div className="flex flex-wrap gap-2 mt-1">
          <button
            onClick={() => handleTimeGranularityChange('daily')}
            className={`px-3 py-2 rounded text-sm inline-flex items-center ${timeGranularity === 'daily' ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'} ${!rawData.length ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading || !rawData.length}
          >
            <Clock size={14} className="mr-1"/> Daily
          </button>
          <button
            onClick={() => handleTimeGranularityChange('weekly')}
            className={`px-3 py-2 rounded text-sm inline-flex items-center ${timeGranularity === 'weekly' ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'} ${!rawData.length ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading || !rawData.length}
          >
            <CalendarDays size={14} className="mr-1"/> Weekly (Total)
          </button>
          <button
            onClick={() => handleTimeGranularityChange('weeklyPerDay')}
            className={`px-3 py-2 rounded text-sm inline-flex items-center ${timeGranularity === 'weeklyPerDay' ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'} ${!rawData.length ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading || !rawData.length}
          >
            <Grid size={14} className="mr-1"/> Weekly (Per Day)
          </button>
        </div>
      </div>
      <div className="flex-1 min-w-[200px]">
        <label htmlFor="analysisTypeSelect" className="block text-sm font-medium text-gray-700 mb-1">Analysis Type</label>
        <select
          id="analysisTypeSelect"
          value={analysisType}
          onChange={handleAnalysisTypeChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100"
          disabled={isLoading || !rawData.length}
        >
          <option value="operator">Operator Production</option>
          <option value="trim">Trim Analysis</option>
          <option value="carpetType">Carpet Type Analysis</option>
          <option value="carpetColour">Carpet Colour Analysis</option>
          <option value="source">Sales Channel Analysis</option>
        </select>
      </div>
    </div>
  );
};
