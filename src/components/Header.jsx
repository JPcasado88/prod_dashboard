// src/components/Header.jsx
import React from 'react';
import { useDashboard } from '../context/DashboardContext';

export const Header = () => {
  // Access the global state using our custom hook
  const { state } = useDashboard();
  const { fileName } = state;

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h1 className="text-2xl font-bold text-gray-800">Production Dashboard</h1>
      <p className="text-gray-600 text-sm h-5"> {/* h-5 ensures consistent height */}
        {fileName ? `Displaying data from: ${fileName}` : 'Load data to get started'}
      </p>
    </div>
  );
};