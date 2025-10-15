import { useState, useRef, useEffect } from 'react';

// Public-facing job application form (frontend-only integration)
// Submits to POST /api/jobs and uploads resume via /api/media/upload when present
export default function JobSection() {
  const [positions, setPositions] = useState([]);
  const [fields, setFields] = useState(null); // optional dynamic application fields from admin

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
  const [fieldErrors, setFieldErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Validation rules
  const MAX_FILE_BYTES = 3 * 1024 * 1024; // 3 MB
  const ALLOWED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  // Upload using XMLHttpRequest to provide progress feedback
  function uploadResume(file) {
    if (!file) return Promise.resolve(null);

    return new Promise((resolve, reject) => {
  const xhr = new window.XMLHttpRequest();
      const fd = new FormData();
      fd.append('file', file);

      xhr.open('POST', '/api/media/upload');

      xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(pct);
        }
      };

      xhr.onload = function () {
        setUploadProgress(100);
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data.file_url || null);
          } catch (err) {
            reject(new Error('Invalid upload response'));
          }
        } else {
          reject(new Error('Resume upload failed'));
        }
      };

      xhr.onerror = function () {
        reject(new Error('Network error during upload'));
      };

      xhr.send(fd);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      // Client-side validation
      const errs = {};
      if (!form.name.trim()) errs.name = 'Please enter your full name';
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Please enter a valid email address';
      if (!form.position) errs.position = 'Please select a position';
      // Phone simple validation (digits, spaces, dashes, parentheses)
      if (form.phone && !/^[0-9()+\-\s]+$/.test(form.phone)) errs.phone = 'Please enter a valid phone number';

      if (resumeFile) {
        if (resumeFile.size > MAX_FILE_BYTES) errs.resume = 'Resume must be 3 MB or smaller';
        if (ALLOWED_TYPES.indexOf(resumeFile.type) === -1) errs.resume = 'Resume must be PDF or Word document';
      }

      if (fields && Array.isArray(fields)) {
        // simple required check for dynamic fields
        fields.forEach(f => {
          if (f.required && !form[f.field_name]) {
            errs[f.field_name] = `${f.field_name} is required`;
          }
        });
      }

      if (Object.keys(errs).length) {
        setFieldErrors(errs);
        throw new Error('Please fix the highlighted fields');
      }
      setFieldErrors({});

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
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }

  // Fetch positions and optional dynamic fields on mount
  useEffect(() => {
    fetch('/api/job-positions')
      .then((r) => r.ok ? r.json() : [])
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setPositions(data.map(p => p.name));
          setForm((s) => ({ ...s, position: data[0]?.name || '' }));
        } else {
          // fallback static list
          setPositions(['Server','Bartender','Line Cook','Prep Cook','Dishwasher','Host','Manager']);
        }
      })
      .catch(() => {
        setPositions(['Server','Bartender','Line Cook','Prep Cook','Dishwasher','Host','Manager']);
      });

    fetch('/api/application-fields')
      .then((r) => r.ok ? r.json() : [])
      .then((data) => {
        if (Array.isArray(data) && data.length) setFields(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="jobs" className="px-4 py-12 md:py-20 bg-surface">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Join our team</h2>
        <p className="mb-6 text-muted">We're hiring friendly, reliable people. Fill out the short form below to apply.</p>

        <form onSubmit={handleSubmit} className="space-y-4 bg-background p-6 rounded shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span className="text-sm mb-1">Full name</span>
              <input name="name" value={form.name} onChange={handleChange} required className="input" aria-invalid={!!fieldErrors.name} aria-describedby={fieldErrors.name ? 'err-name' : undefined} />
              {fieldErrors.name && <div id="err-name" className="text-sm text-red-600 mt-1">{fieldErrors.name}</div>}
            </label>
            <label className="flex flex-col">
              <span className="text-sm mb-1">Email</span>
              <input name="email" type="email" value={form.email} onChange={handleChange} required className="input" aria-invalid={!!fieldErrors.email} aria-describedby={fieldErrors.email ? 'err-email' : undefined} />
              {fieldErrors.email && <div id="err-email" className="text-sm text-red-600 mt-1">{fieldErrors.email}</div>}
            </label>
            <label className="flex flex-col">
              <span className="text-sm mb-1">Phone</span>
              <input name="phone" value={form.phone} onChange={handleChange} className="input" aria-invalid={!!fieldErrors.phone} aria-describedby={fieldErrors.phone ? 'err-phone' : undefined} />
              {fieldErrors.phone && <div id="err-phone" className="text-sm text-red-600 mt-1">{fieldErrors.phone}</div>}
            </label>
            <label className="flex flex-col">
              <span className="text-sm mb-1">Position</span>
              <select name="position" value={form.position} onChange={handleChange} className="input" aria-invalid={!!fieldErrors.position} aria-describedby={fieldErrors.position ? 'err-position' : undefined}>
                {positions.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              {fieldErrors.position && <div id="err-position" className="text-sm text-red-600 mt-1">{fieldErrors.position}</div>}
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

          <label className="flex flex-col">
            <span className="text-sm mb-1">Resume (optional)</span>
            <div className="flex items-center gap-3">
              <input ref={fileInputRef} type="file" accept="application/pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} aria-describedby="resume-help" />
              <div className="text-sm text-muted" id="resume-help">PDF or Word — max 3 MB</div>
            </div>
            {resumeFile && (
              <div className="mt-2 text-sm">
                Selected: {resumeFile.name} · {(resumeFile.size / 1024).toFixed(0)} KB
              </div>
            )}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full bg-surface-warm h-2 rounded mt-2 overflow-hidden">
                <div className="bg-accent h-2" style={{ width: `${uploadProgress}%` }} />
              </div>
            )}
          </label>

          {error && <div className="text-sm text-red-600">{error}</div>}
          {message && <div className="text-sm text-green-600">{message}</div>}

          {fields && Array.isArray(fields) && (
            <div className="mt-4 bg-surface p-3 rounded">
              <h4 className="font-medium mb-2">Additional information</h4>
              {fields.map(f => (
                <label key={f.id} className="flex flex-col mb-3">
                  <span className="text-sm mb-1">{f.field_name}{f.required ? ' *' : ''}</span>
                  {f.field_type === 'text' && (
                    <input name={f.field_name} value={form[f.field_name] || ''} onChange={handleChange} className="input" aria-invalid={!!fieldErrors[f.field_name]} />
                  )}
                  {f.field_type === 'textarea' && (
                    <textarea name={f.field_name} value={form[f.field_name] || ''} onChange={handleChange} className="input" rows={3} />
                  )}
                  {fieldErrors[f.field_name] && <div className="text-sm text-red-600 mt-1">{fieldErrors[f.field_name]}</div>}
                </label>
              ))}
            </div>
          )}

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
