'use client';

import { useEffect, useState } from 'react';

/** Detect mobile/coarse pointer for static Earth variant per world-bible. */
export function useIsMobileEarth(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const narrow = window.matchMedia('(max-width: 768px)');
    const coarse = window.matchMedia('(pointer: coarse)');

    const update = (): void => {
      setIsMobile(narrow.matches || coarse.matches);
    };

    update();
    narrow.addEventListener('change', update);
    coarse.addEventListener('change', update);
    return () => {
      narrow.removeEventListener('change', update);
      coarse.removeEventListener('change', update);
    };
  }, []);

  return isMobile;
}
