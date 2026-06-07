'use client';

import { useEffect } from 'react';
import { initializeWebVitals } from '@/lib/web-vitals';

export function WebVitalsProvider() {
  useEffect(() => {
    initializeWebVitals();
  }, []);

  return null;
}
