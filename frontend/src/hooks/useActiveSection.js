import { useEffect, useState } from 'react';

export default function useActiveSection(sectionIds = [], offset = 120) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    const onScroll = () => {
      let current = null;
      for (let id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= offset && rect.bottom > offset) {
          current = id;
          break;
        }
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [sectionIds, offset]);

  return active;
}
