// ============================================
// Thunder Road - Admin Panel
// File: frontend/src/pages/AdminPanel.js
// ============================================

import React, { useState } from 'react';
import { Menu, X, LogOut, Home } from 'lucide-react';

// Import all admin modules
import DashboardModule from '../components/admin/DashboardModule';
import InboxModule from '../components/admin/InboxModule';
import MenuModule from '../components/admin/MenuModule';
import ReservationsModule from '../components/admin/ReservationsModule';
import JobsModule from '../components/admin/JobsModule';
import MediaModule from '../components/admin/MediaModule';
import SettingsModule from '../components/admin/SettingsModule';
import NewsletterModule from '../components/admin/NewsletterModule';

// Module Registry
const AdminModules = {
  dashboard: DashboardModule,
  inbox: InboxModule,
  menu: MenuModule,
  reservations: ReservationsModule,
  jobs: JobsModule,
  media: MediaModule,
  settings: SettingsModule,
  newsletters: NewsletterModule
};

export default function AdminPanel({ user, onLogout, onBackToSite }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeModule, setActiveModule] = useState('dashboard');

  const CurrentModule = AdminModules[activeModule]?.component;

  return (
    <div className="min-h-screen bg-admin-pageBg flex">
  {/* Sidebar */}
  <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-surface-dark text-text-inverse transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between border-b border-divider">
          {sidebarOpen && <span className="font-heading font-bold text-lg">Thunder Road</span>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="hover:bg-surface-dark/90 p-2 rounded transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Module Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {Object.entries(AdminModules).map(([key, module]) => {
            const Icon = module.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveModule(key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeModule === key 
                    ? 'bg-primary text-text-inverse' 
          : 'text-text-muted hover:bg-surface-dark/90 hover:text-text-inverse'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="text-sm font-medium">{module.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-divider space-y-2">
          <button
            onClick={onBackToSite}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-dark/90 transition text-sm text-text-muted hover:text-text-inverse"
          >
            <Home size={20} />
            {sidebarOpen && <span>Back to Site</span>}
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-dark/90 transition text-sm text-text-muted hover:text-text-inverse"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-surface shadow-sm border-b border-divider">
          <div className="px-8 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-heading font-bold text-text-primary">
              {AdminModules[activeModule]?.name}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-text-secondary">
                Welcome, <strong>{user.name}</strong>
              </span>
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Module Content */}
        <div className="flex-1 overflow-auto p-8">
          {CurrentModule ? <CurrentModule /> : (
            <div className="text-center text-text-secondary py-12">
              <p>Module not found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
