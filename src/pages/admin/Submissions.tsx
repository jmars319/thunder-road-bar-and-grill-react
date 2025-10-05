import React from 'react';

const MOCK = [
  { id: 'a1', name: 'Contact from Alice', message: 'Hi there!' },
  { id: 'b2', name: 'Contact from Bob', message: 'I love your site.' },
];

export default function Submissions() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Form Submissions</h2>
      <div className="mt-4 space-y-3">
        {MOCK.map((s) => (
          <div key={s.id} className="p-3 bg-white rounded shadow">
            <div className="text-sm font-medium">{s.name}</div>
            <div className="text-sm text-gray-700">{s.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
