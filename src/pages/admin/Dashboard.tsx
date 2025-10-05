import React from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div>
          <span className="mr-3 text-sm">{user?.name}</span>
          <button onClick={logout} className="text-sm text-red-600">
            Sign out
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <Link to="/admin/submissions" className="p-4 bg-white rounded shadow">
          View Submissions
        </Link>
        <div className="p-4 bg-white rounded shadow">Manage Content (placeholder)</div>
      </div>
    </div>
  );
}
