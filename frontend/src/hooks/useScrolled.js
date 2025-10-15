/*
  Purpose:
  - Return a boolean indicating whether the page has been scrolled past a
    configurable offset. Useful for toggling sticky headers or small UI
    changes when the user scrolls.

  Contract:
  - Input: offset (number of pixels). Output: boolean `scrolled`.

  Notes:
  - This is intentionally minimal; if you need debouncing or throttling,
    wrap the listener logic or use a utility library.
*/

import { useEffect, useState } from 'react';

export default function useScrolled(offset = 50) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > offset);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [offset]);

  return scrolled;
}
