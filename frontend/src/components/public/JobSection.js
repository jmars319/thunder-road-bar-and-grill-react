import { useState } from 'react';

// Public-facing job application form (frontend-only integration)
// Submits to POST /api/jobs and uploads resume via /api/media/upload when present
export default function JobSection() {
  const positions = [
    'Server',
    'Bartender',
    'Line Cook',
    'Prep Cook',
    'Dishwasher',
    'Host',
    'Manager'
  ];

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    position: positions[0],
    availability: '',
    experience: '',
    cover_letter: ''
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function uploadResume(file) {
    if (!file) return null;
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: fd
      });
      if (!res.ok) throw new Error('Resume upload failed');
      const data = await res.json();
      // backend returns { id, file_url, message }
      return data.file_url || null;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      let resume_url = null;
      if (resumeFile) {
        resume_url = await uploadResume(resumeFile);
      }

      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        position: form.position,
        experience: form.experience,
        cover_letter: form.cover_letter,
        resume_url
      };

      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || 'Submission failed');
      }

  await res.json();
      setMessage('Application submitted — thank you!');
      setForm({ name: '', email: '', phone: '', position: positions[0], availability: '', experience: '', cover_letter: '' });
      setResumeFile(null);
    } catch (err) {
      setError(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="jobs" className="px-4 py-12 md:py-20 bg-surface">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Join our team</h2>
        <p className="mb-6 text-muted">We're hiring friendly, reliable people. Fill out the short form below to apply.</p>

        <form onSubmit={handleSubmit} className="space-y-4 bg-background p-6 rounded shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span className="text-sm mb-1">Full name</span>
              <input name="name" value={form.name} onChange={handleChange} required className="input" />
            </label>
            <label className="flex flex-col">
              <span className="text-sm mb-1">Email</span>
              <input name="email" type="email" value={form.email} onChange={handleChange} required className="input" />
            </label>
            <label className="flex flex-col">
              <span className="text-sm mb-1">Phone</span>
              <input name="phone" value={form.phone} onChange={handleChange} className="input" />
            </label>
            <label className="flex flex-col">
              <span className="text-sm mb-1">Position</span>
              <select name="position" value={form.position} onChange={handleChange} className="input">
                {positions.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span className="text-sm mb-1">Availability / desired start</span>
              <input name="availability" value={form.availability} onChange={handleChange} className="input" />
            </label>
            <label className="flex flex-col">
              <span className="text-sm mb-1">Years of experience</span>
              <input name="experience" value={form.experience} onChange={handleChange} className="input" />
            </label>
          </div>

          <label className="flex flex-col">
            <span className="text-sm mb-1">Cover letter (optional)</span>
            <textarea name="cover_letter" value={form.cover_letter} onChange={handleChange} rows="4" className="input" />
          </label>

          <label className="flex items-center gap-3">
            <input type="file" accept="application/pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
            <div className="text-sm text-muted">Upload resume (PDF or DOC). Optional.</div>
          </label>

          {error && <div className="text-sm text-red-600">{error}</div>}
          {message && <div className="text-sm text-green-600">{message}</div>}

          <div className="flex items-center justify-end">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit application'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
