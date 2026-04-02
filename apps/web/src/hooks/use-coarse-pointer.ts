'use client';

import { useEffect, useState } from 'react';

const COARSE_POINTER_QUERY = '(pointer: coarse), (max-width: 768px)';

export function useCoarsePointer() {
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(COARSE_POINTER_QUERY);
    const sync = () => setIsCoarsePointer(mediaQuery.matches);

    sync();
    mediaQuery.addEventListener('change', sync);

    return () => {
      mediaQuery.removeEventListener('change', sync);
    };
  }, []);

  return isCoarsePointer;
}
