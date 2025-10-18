// Small cached fetch helper using localStorage. Returns parsed JSON or null on failure.
// Usage: cachedFetch(url, { ttl: 300000 })

const DEFAULT_TTL = 300000; // 5 minutes

function safeKey(url) {
  return `cachedFetch:${url}`;
}

export default async function cachedFetch(url, options = {}) {
  const ttl = typeof options.ttl === 'number' ? options.ttl : DEFAULT_TTL;
  const key = safeKey(url);

  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.ts && Date.now() - parsed.ts < ttl) {
        return parsed.value;
      }
    }
  } catch (e) {
    // ignore localStorage parse errors
  }

  try {
    const res = await fetch(url, options.fetchOptions || {});
    if (!res.ok) return null;
    const data = await res.json();
    try {
      localStorage.setItem(key, JSON.stringify({ ts: Date.now(), value: data }));
    } catch (e) {
      // ignore storage quota errors
    }
    return data;
  } catch (e) {
    return null;
  }
}

// Clear cached entry for an exact URL
export function clearCacheFor(url) {
  try {
    localStorage.removeItem(safeKey(url));
  } catch (e) {}
}

// Clear all cachedFetch entries (useful for complete invalidation)
export function clearAllCache() {
  try {
    Object.keys(localStorage).forEach(k => {
      if (k && k.startsWith('cachedFetch:')) localStorage.removeItem(k);
    });
  } catch (e) {}
}
