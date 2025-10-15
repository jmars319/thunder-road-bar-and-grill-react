import React, { useState, useEffect } from 'react';
import { Inbox, Mail, MailOpen, Trash2 } from 'lucide-react';

const API_BASE = 'http://localhost:5001/api';

function InboxModule() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = () => {
    fetch(`${API_BASE}/contact/messages`)
      .then(res => res.json())
      .then(data => setMessages(data));
  };

  const markAsRead = (id) => {
    fetch(`${API_BASE}/contact/messages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_read: true })
    }).then(() => fetchMessages());
  };

  const deleteMessage = (id) => {
    if (window.confirm('Delete this message?')) {
      fetch(`${API_BASE}/contact/messages/${id}`, { method: 'DELETE' })
        .then(() => {
          fetchMessages();
          setSelectedMessage(null);
        });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 bg-surface rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="font-bold text-lg text-text-primary">Messages</h3>
        </div>
        <div className="divide-y max-h-[600px] overflow-y-auto">
          {messages.map(msg => (
            <button
              key={msg.id}
              onClick={() => {
                setSelectedMessage(msg);
                if (!msg.is_read) markAsRead(msg.id);
              }}
              className={`w-full p-4 text-left hover:bg-surface-warm transition ${
                selectedMessage?.id === msg.id ? 'bg-surface-warm' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {msg.is_read ? <MailOpen size={18} /> : <Mail size={18} className="text-primary" />}
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${!msg.is_read ? 'text-primary' : ''}`}>
                    {msg.name}
                  </p>
                  <p className="text-sm text-text-secondary truncate">{msg.subject}</p>
                  <p className="text-xs text-text-secondary mt-1">
                    {new Date(msg.submitted_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2 bg-surface rounded-lg shadow">
        {selectedMessage ? (
            <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-text-primary">{selectedMessage.subject}</h3>
                <p className="text-sm text-text-secondary mt-1">
                  From: {selectedMessage.name} ({selectedMessage.email})
                </p>
                {selectedMessage.phone && (
                  <p className="text-sm text-text-secondary">Phone: {selectedMessage.phone}</p>
                )}
                <p className="text-xs text-text-secondary mt-2">
                  {new Date(selectedMessage.submitted_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => deleteMessage(selectedMessage.id)}
                className="text-error hover:text-error-muted p-2 rounded hover:bg-error/10"
              >
                <Trash2 size={18} />
              </button>
            </div>
              <div className="border-t pt-4">
              <p className="text-text-primary whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full p-12 text-center text-text-inverse">
            <div>
              <Inbox size={48} className="mx-auto mb-4" />
              <p>Select a message to view</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const Module = {
  component: InboxModule,
  name: 'Inbox',
  icon: Inbox
};

export default Module;
