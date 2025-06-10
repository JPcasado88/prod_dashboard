// src/hooks/useDataProcessor.js
import * as XLSX from 'xlsx';
import { useCallback } from 'react';

import { 
    getDateFromLastOperation, 
    formatDateKey, 
    getAvailableWeeks 
} from '../utils/dateUtils';
import { getFirstWord, generateSampleData } from '../utils/dataUtils';

export const useDataProcessor = (dispatch) => {
  const processData = useCallback((jsonData) => {
    if (!jsonData || jsonData.length === 0) {
        dispatch({ type: 'PROCESS_DATA_ERROR', payload: { error: "No data found in the file." } });
        return;
      }
      const uniqueOperators = new Set();
      const uniqueOperations = new Set();
      const uniqueTrims = new Set();
      const uniqueCarpetTypes = new Set();
      const uniqueCarpetColours = new Set();
      const uniqueSourceGroups = new Set();
      const datesInData = new Set();
      let latestDate = null;
      const processedData = jsonData.map(row => {
        const date = getDateFromLastOperation(row.LastOperation);
        const dateKey = date ? formatDateKey(date) : null;
        if (dateKey) {
          datesInData.add(dateKey);
          if (!latestDate || date > latestDate) {
            latestDate = date;
          }
        }
        if (row.OperatorName) uniqueOperators.add(row.OperatorName);
        if (row.OperationName) uniqueOperations.add(row.OperationName);
        uniqueTrims.add((row.Trim || 'N/A').toUpperCase());
        uniqueCarpetTypes.add(row.CarpetType || 'N/A');
        uniqueCarpetColours.add((row.CarpetColour || 'N/A').toUpperCase());
        uniqueSourceGroups.add(getFirstWord(row.Source));
        return { ...row, processedDate: date, processedDateKey: dateKey };
      }).filter(row => row.processedDateKey);
  
      if (processedData.length === 0) {
        dispatch({ type: 'PROCESS_DATA_ERROR', payload: { error: "No valid dates found in 'LastOperation' column." } });
        return;
      }
      const sortedDates = Array.from(datesInData).sort();
      const weeksList = getAvailableWeeks(sortedDates);
      const latestDateKey = latestDate ? formatDateKey(latestDate) : sortedDates[sortedDates.length - 1];
      dispatch({
        type: 'PROCESS_DATA_SUCCESS',
        payload: {
          rawData: processedData,
          operators: Array.from(uniqueOperators).sort(),
          operations: Array.from(uniqueOperations).sort(),
          trims: Array.from(uniqueTrims).sort(),
          carpetTypes: Array.from(uniqueCarpetTypes).sort(),
          carpetColours: Array.from(uniqueCarpetColours).sort(),
          sources: Array.from(uniqueSourceGroups).sort(),
          availableDates: sortedDates,
          availableWeeks: weeksList,
          currentDate: sortedDates[0],
          timeGranularity: 'daily',
          viewType: 'chart',
        }
      });
    }, [dispatch]);
  
    const loadAndProcessFile = useCallback((file) => {
      dispatch({ type: 'RESET_FOR_NEW_FILE', payload: { fileName: file.name } });
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
          processData(jsonData);
        } catch (err) {
          dispatch({ type: 'PROCESS_DATA_ERROR', payload: { error: `Failed to process Excel file: ${err.message}` } });
        }
      };
      reader.onerror = () => {
        dispatch({ type: 'PROCESS_DATA_ERROR', payload: { error: "Failed to read the file." } });
      };
      reader.readAsArrayBuffer(file);
    }, [dispatch, processData]);
  
    // --- LOAD ORIGINAL EXAMPLE DATA ---
    const loadExampleData = useCallback(async () => {
      dispatch({ type: 'RESET_FOR_NEW_FILE', payload: { fileName: 'Example Data' } });
      try {
        const response = await fetch('/ExportedProcessing.xlsx'); // Fetches from the public folder
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        processData(jsonData);
      } catch (err) {
        dispatch({ type: 'PROCESS_DATA_ERROR', payload: { error: `Failed to load example data: ${err.message}` } });
      }
    }, [dispatch, processData]);

    // --- NEW FUNCTION TO LOAD GENERATED SAMPLE DATA ---
    const loadSampleData = useCallback(() => {
      dispatch({ type: 'RESET_FOR_NEW_FILE', payload: { fileName: 'Generated Sample Data' } });
      try {
        console.log('🚀 Generating sample data...');
        const sampleData = generateSampleData(60, 50); // 60 days, ~50 operations per day
        console.log('✅ Sample data generated:', sampleData.length, 'records');
        console.log('📅 First few records:', sampleData.slice(0, 3));
        processData(sampleData);
      } catch (err) {
        console.error('❌ Error generating sample data:', err);
        dispatch({ type: 'PROCESS_DATA_ERROR', payload: { error: `Failed to generate sample data: ${err.message}` } });
      }
    }, [dispatch, processData]);
    
    // --- UPDATED RETURN VALUE ---
    return { loadAndProcessFile, loadExampleData, loadSampleData };
  };