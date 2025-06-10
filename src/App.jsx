// src/App.jsx
import React from 'react';
import { Header } from './components/Header.jsx';
import { Controls } from './components/Controls.jsx';
import { DateNavigator } from './components/DateNavigator.jsx';
import { MainDisplayArea } from './components/MainDisplayArea.jsx'; // Import the final piece

// Import Controls
// import { DateNavigator } from './components/DateNavigator';
// import { MainDisplayArea } from './components/MainDisplayArea';

function App() {
  return (
    <div className="flex flex-col min-h-screen p-4 bg-gray-100 text-gray-800">
      <Header />
      <Controls />
      <DateNavigator />
      <MainDisplayArea /> {/* Add the display area */}
    </div>
  );
}

export default App;