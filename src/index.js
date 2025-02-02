import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Validate required environment variables
const requiredEnvVars = ['REACT_APP_BACKEND_URL'];

const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !process.env[envVar]
);

if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

// Wrap render in error boundary
try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  root.render(
    <div style={{ 
      padding: '20px', 
      textAlign: 'center', 
      fontFamily: 'system-ui' 
    }}>
      <h1>Something went wrong</h1>
      <p>The application failed to load. Please try refreshing the page.</p>
    </div>
  );
}