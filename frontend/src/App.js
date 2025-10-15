// ============================================
// Thunder Road - Main App Router
// File: frontend/src/App.js
// ============================================

import React, { useState } from 'react';
import PublicSite from './pages/PublicSite';
import AdminPanel from './pages/AdminPanel';
import LoginPage from './pages/LoginPage';

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
