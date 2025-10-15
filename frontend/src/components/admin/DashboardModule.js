import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Calendar, Briefcase, TrendingUp } from 'lucide-react';

const API_BASE = 'http://localhost:5001/api';

function DashboardModule() {
  const [stats, setStats] = useState({
    reservations: 0,
    jobs: 0,
    subscribers: 0,
    messages: 0
  });

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/reservations`).then(r => r.json()),
      fetch(`${API_BASE}/jobs`).then(r => r.json()),
      fetch(`${API_BASE}/newsletter/subscribers`).then(r => r.json()),
      fetch(`${API_BASE}/contact/messages`).then(r => r.json())
    ]).then(([reservations, jobs, subscribers, messages]) => {
      setStats({
        reservations: reservations.filter(r => r.status === 'pending').length,
        jobs: jobs.filter(j => j.status === 'new').length,
        subscribers: subscribers.filter(s => s.is_active).length,
        messages: messages.filter(m => !m.is_read).length
      });
    });
  }, []);

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-surface rounded-lg shadow p-6 card-hover">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-secondary text-sm">{label}</p>
          <p className="text-3xl font-bold mt-2 text-text-primary">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
          <Icon size={24} className="text-text-inverse" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Calendar} 
          label="Pending Reservations" 
          value={stats.reservations} 
          color="bg-primary" 
        />
        <StatCard 
          icon={Briefcase} 
          label="New Applications" 
          value={stats.jobs} 
          color="bg-secondary" 
        />
        <StatCard 
          icon={Users} 
          label="Active Subscribers" 
          value={stats.subscribers} 
          color="bg-accent" 
        />
        <StatCard 
          icon={TrendingUp} 
          label="Unread Messages" 
          value={stats.messages} 
          color="bg-cta" 
        />
      </div>

      <div className="bg-surface rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4 font-heading text-text-primary">Welcome to Thunder Road Admin</h3>
        <p className="text-text-secondary">
          Use the sidebar to navigate between different sections. Here's what you can manage:
        </p>
        <ul className="mt-4 space-y-2 text-text-primary">
          <li>• <strong>Dashboard:</strong> Overview of your business metrics</li>
          <li>• <strong>Inbox:</strong> View all notifications and messages</li>
          <li>• <strong>Menu:</strong> Manage menu categories and items</li>
          <li>• <strong>Reservations:</strong> Handle customer bookings</li>
          <li>• <strong>Jobs:</strong> Review job applications</li>
          <li>• <strong>Media:</strong> Upload and manage images</li>
          <li>• <strong>Settings:</strong> Configure business information</li>
          <li>• <strong>Newsletter:</strong> Manage email subscribers</li>
        </ul>
      </div>
    </div>
  );
}

const Module = {
  component: DashboardModule,
  name: 'Dashboard',
  icon: LayoutDashboard
};

export default Module;
