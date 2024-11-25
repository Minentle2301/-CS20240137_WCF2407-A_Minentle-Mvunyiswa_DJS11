
import React from 'react';
import ReactDOM from 'react-dom/client'; 
import App from './App'; // main application component
import './index.css'; 

const container = document.getElementById('root'); // Get the root element
const root = ReactDOM.createRoot(container); // Create a root

// Render the application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);