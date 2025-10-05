import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="text-lg font-semibold">
          Site Template
        </Link>
        <nav className="space-x-4">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <Link to="/about" className="text-sm text-gray-600 hover:text-gray-900">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
