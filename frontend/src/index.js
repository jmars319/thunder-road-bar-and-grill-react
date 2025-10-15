/*
  Purpose:
  - Application entrypoint. Mounts the React tree, wires global providers
    (Theme + Toast) and configures performance reporting.

  Contract:
  - Wrap the app in `ThemeProvider` (applies CSS tokens and persisted theme)
    and `ToastProvider` (global toast notifications).

  Notes:
  - Avoid introducing heavy logic here. If you need global initialization
    make it idempotent and side-effect-free where possible.
*/

// Import React here so ESLint/react rules that expect React in scope for JSX
// (depending on parser/config) are satisfied. CRA's automatic runtime works
// without this, but some lint setups still expect the symbol to exist.
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './custom-styles.css';
import App from './App';
import { ToastProvider } from './contexts/ToastContext';
import ThemeProvider from './contexts/ThemeContext';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
// Group references to avoid false-positive `no-unused-vars` in some lint setups
// that don't follow JSX usages in automatic runtime environments.
const __usedRoot = { React, App, ThemeProvider, ToastProvider };
void __usedRoot;
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
