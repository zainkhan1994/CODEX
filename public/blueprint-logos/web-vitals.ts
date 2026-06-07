'use client';

import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

export interface WebVital {
  name: string;
  value: number;
  id: string;
  delta?: number;
}

export function reportWebVitals(metric: WebVital) {
  // Send to analytics service (e.g., Google Analytics, Vercel Analytics)
  if (typeof window !== 'undefined') {
    // Only log in production to avoid noise during development
    if (process.env.NODE_ENV === 'production') {
      // You can send this to your analytics endpoint
      const body = JSON.stringify(metric);

      // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics', body);
      } else {
        fetch('/api/analytics', { body, method: 'POST', keepalive: true }).catch(() => {});
      }
    }
  }
}

export function initializeWebVitals() {
  onCLS(reportWebVitals);
  onFID(reportWebVitals);
  onFCP(reportWebVitals);
  onLCP(reportWebVitals);
  onTTFB(reportWebVitals);
}

