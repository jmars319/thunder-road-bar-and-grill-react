/*
  Purpose:
  - Admin control surface. Hosts a registry of admin modules (dashboard,
    inbox, menu, reservations, etc.) and renders the selected module.

  Contract:
  - Modules are registered in `AdminModules` as components. Each module
    should be a self-contained React component responsible for its own data
    fetching and local UI state.

  Notes:
  - To add a new admin module: create a component under
    `src/components/admin/`, then add it to the `AdminModules` registry here
    with a `name` and `icon` property.
*/

import React from 'react';
import { useState } from 'react';
// icons: used dynamically in menu registry/JSX — kept in the module registry
import { Menu, X, LogOut, Home } from '../icons';
import ThemeToggle from '../components/ThemeToggle';

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
// Each entry may be either the component itself or an object { component, name, icon }
const AdminModules = {
  dashboard: { component: DashboardModule, name: 'Dashboard', icon: Home },
  inbox: { component: InboxModule, name: 'Messages', icon: Home },
  menu: { component: MenuModule, name: 'Menu', icon: Home },
  reservations: { component: ReservationsModule, name: 'Reservations', icon: Home },
  jobs: { component: JobsModule, name: 'Jobs', icon: Home },
  media: { component: MediaModule, name: 'Media', icon: Home },
  settings: { component: SettingsModule, name: 'Settings', icon: Home },
  newsletters: { component: NewsletterModule, name: 'Newsletter', icon: Home }
};

export default function AdminPanel({ user = { name: 'Admin' }, onLogout = () => {}, onBackToSite = () => {} }) {
  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeModule, setActiveModule] = useState('dashboard');

  // Resolve the current module component from the registry. The registry maps a
  // key to an object { component, name, icon } so new modules can be added by
  // updating the AdminModules object above. Modules may export either a raw
  // React component or a small Module object { component, name, icon } —
  // normalize both shapes here so we always render a callable component.
  const registryEntry = AdminModules[activeModule];
  let CurrentModule = null;
  if (registryEntry) {
    // registryEntry.component can itself be a Module object (with .component).
    const candidate = registryEntry.component || registryEntry;
    CurrentModule = candidate && candidate.component ? candidate.component : candidate;
  }

  return (
    <div className="min-h-screen bg-admin-pageBg flex">
  {/* Sidebar */}
  <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-surface-dark text-text-inverse transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between border-b border-divider">
          {sidebarOpen && <span className="font-heading font-bold text-lg text-text-inverse">Thunder Road</span>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="hover:bg-surface-dark/90 p-2 rounded transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Module Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {Object.entries(AdminModules).map(([key, moduleEntry]) => {
            const entry = moduleEntry.component ? moduleEntry : { component: moduleEntry, name: moduleEntry.name || key, icon: moduleEntry.icon || Home };
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveModule(key)}
                aria-pressed={activeModule === key}
                aria-label={`Open ${entry.name}`}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeModule === key 
                    ? 'bg-primary text-text-inverse' 
                    : 'text-text-inverse hover:bg-surface-dark/90 hover:text-text-inverse'
                }`}
              >
                {React.createElement(entry.icon || Home, { size: 20 })}
                {sidebarOpen && <span className="text-sm font-medium text-text-inverse">{entry.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-divider space-y-2">
          <button
            onClick={onBackToSite}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-dark/90 transition text-sm text-text-inverse"
          >
            <Home size={20} />
            {sidebarOpen && <span>Back to Site</span>}
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-dark/90 transition text-sm text-text-inverse"
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
            <h2 className="text-2xl font-heading font-bold text-text-inverse">
              {AdminModules[activeModule]?.name}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-text-inverse">
                Welcome, <strong>{user?.name || 'Admin'}</strong>
              </span>
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-text-inverse font-bold">
                {(user?.name || 'A').charAt(0).toUpperCase()}
              </div>
              <ThemeToggle inline className="ml-4" />
            </div>
          </div>
        </div>

        {/* Module Content */}
        <div className="flex-1 overflow-auto p-8">
          {CurrentModule ? <CurrentModule /> : (
            <div className="text-center text-text-inverse py-12">
              <p>Module not found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ensure imported symbols are considered used by linters where JSX usages
// may appear indirect (e.g., dynamic React.createElement). These are no-ops.
void Menu; void X; void LogOut; void Home; void ThemeToggle;
