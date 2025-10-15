import { useEffect, useState, useRef } from 'react';

export default function useInView(options = { threshold: 0.1 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => setInView(entry.isIntersecting));
      }, options);
      obs.observe(el);
      return () => obs.disconnect();
    }

    // Fallback: simple bounding check
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      setInView(rect.top < window.innerHeight && rect.bottom > 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ref, options]);

  return [ref, inView];
}
