import { useEffect, useState } from 'react';

export default function Snackbar() {
  const [msgs, setMsgs] = useState([]);
  useEffect(() => {
    const handler = (e) => {
      const id = Date.now() + Math.random();
      setMsgs(m => [...m, { id, text: e.detail }]);
      setTimeout(() => setMsgs(m => m.filter(x => x.id !== id)), 3000);
    };
    window.addEventListener('snackbar', handler);
    return () => window.removeEventListener('snackbar', handler);
  }, []);

  if (!msgs.length) return null;
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {msgs.map(m => (
        <div key={m.id} className="bg-gray-900 text-white px-4 py-2 rounded shadow">{m.text}</div>
      ))}
    </div>
  );
}
