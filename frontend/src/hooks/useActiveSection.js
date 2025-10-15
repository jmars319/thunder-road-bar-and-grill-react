/*
  Purpose:
  - Return the id of the page section currently 'active' based on scroll
    position. Useful for syncing navigation highlights to scroll position.

  Contract:
  - Inputs: `sectionIds` array and optional `offset` (pixels from top to
    consider active).
  - Output: `active` string | null.

  Edge cases:
  - If elements are not present the hook will skip them. For SSR render
    guards, ensure calls to this hook happen in browser-only components.
*/

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
