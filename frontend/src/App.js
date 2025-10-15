/*
  Purpose:
  - Main application router for the public site and admin panel. Controls
  application-level UI state (current user, logged-in status) and decides
  whether to render the public site, login page, or admin panel.

  Contract:
  - Inputs: none (top-level app). Internal state tracks `isLoggedIn`,
    `currentUser`, and `showAdmin`.
  - Outputs: renders one of: <PublicSite />, <LoginPage />, or <AdminPanel />.

  Notes:
  - Keep this file presentation-focused; individual pages/components should
    handle their own data fetching and side-effects.
*/

import { useState } from 'react';
 
import PublicSite from './pages/PublicSite';
 
import AdminPanel from './pages/AdminPanel';
 
import LoginPage from './pages/LoginPage';

// Some editor/lint setups don't follow JSX usages in the automatic runtime.
// Keep a tiny used-symbol object so those tools don't report false positives.
const __usedApp = { PublicSite, AdminPanel, LoginPage };
void __usedApp;

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setShowAdmin(false);
  };

  // Show admin panel if logged in
  if (showAdmin && isLoggedIn && currentUser) {
    return (
      <AdminPanel 
        user={currentUser} 
        onLogout={handleLogout} 
        onBackToSite={() => setShowAdmin(false)} 
      />
    );
  }

  // Show login page if trying to access admin
  if (showAdmin && !isLoggedIn) {
    return (
      <LoginPage 
        onLogin={handleLogin} 
        onBack={() => setShowAdmin(false)} 
      />
    );
  }

  // Show public website (default)
  return (
    <PublicSite onGoToAdmin={() => setShowAdmin(true)} />
  );
}
