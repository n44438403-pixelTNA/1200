import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <ErrorBoundary>
      <App />
  </ErrorBoundary>
);

import { registerSW } from 'virtual:pwa-register';

if ('serviceWorker' in navigator) {
  registerSW({
    immediate: false,
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    }
  });
}
