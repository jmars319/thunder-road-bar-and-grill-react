const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5001/api';

export default function makeAbsolute(fileUrl) {
  if (!fileUrl) return '';
  // already absolute
  if (/^https?:\/\//i.test(fileUrl)) return fileUrl;
  const base = API_BASE.replace(/\/api$/, '');
  return base + (fileUrl.startsWith('/') ? fileUrl : '/' + fileUrl);
}
