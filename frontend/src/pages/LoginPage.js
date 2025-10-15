// ============================================
// Thunder Road - Login Page
// File: frontend/src/pages/LoginPage.js
// ============================================

import React, { useState } from 'react';

const API_BASE = 'http://localhost:5001/api';

export default function LoginPage({ onLogin, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        onLogin(data.user);
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-lg shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg mb-4"></div>
            <h1 className="text-2xl font-bold text-text-inverse">Thunder Road Admin</h1>
            <p className="text-text-inverse text-sm mt-2">Sign in to manage your site</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-error/10 border border-error text-error px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-inverse mb-1">
                Username
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="admin"
                className="w-full form-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-inverse mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="••••••••"
                className="w-full form-input"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-primary text-text-inverse py-2 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <button
              onClick={onBack}
              className="w-full bg-surface-warm text-text-inverse py-2 rounded-lg font-semibold hover:bg-surface transition"
            >
              Back to Website
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-surface-warm rounded-lg">
            <p className="text-center text-sm text-text-inverse">
              <strong>Demo Credentials:</strong><br />
              Username: admin<br />
              Password: admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
