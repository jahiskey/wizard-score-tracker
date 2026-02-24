import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeIcons } from '@fluentui/react';
import './styles/globals.css';
import App from './App';

initializeIcons();

const rootElement = document.getElementById('app');

if (!rootElement) {
  throw new Error('Missing root element.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
