import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await login(username, password);
    if (ok) nav('/admin');
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold">Admin Login</h2>
      <form onSubmit={onSubmit} className="mt-4">
        <label className="block">
          <span className="text-sm">Username</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
          />
        </label>
        <label className="block mt-3">
          <span className="text-sm">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
          />
        </label>
        <div className="mt-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Sign in</button>
        </div>
      </form>
      <p className="mt-3 text-sm text-gray-600">
        Tip: use password &apos;admin&apos; to sign in as an admin.
      </p>
    </div>
  );
}
