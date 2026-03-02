import { useState, useEffect } from 'react';

/**
 * Returns true when viewport width is below the given breakpoint (mobile).
 * @param {string} breakpoint - CSS width value, e.g. '1024px' or '768px'
 * @returns {boolean}
 */
export default function useMobileBreakpoint(breakpoint = '1024px') {
  const px = typeof breakpoint === 'string' ? parseInt(breakpoint, 10) : breakpoint;
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < px : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const check = () => setIsMobile(window.innerWidth < px);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [px]);

  return isMobile;
}
