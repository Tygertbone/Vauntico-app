// Lightweight analytics utility with safe fallbacks

export function trackAnalyticsEvent(eventName, payload = {}) {
  try {
    // If a global analytics provider exists, forward the event
    if (typeof window !== 'undefined') {
      const provider = window.vaunticoAnalytics || window.analytics;
      if (provider && typeof provider.track === 'function') {
        provider.track(eventName, payload);
        return true;
      }
    }
  } catch (error) {
    // Intentionally swallow to avoid breaking UX; fall back to console
  }

  // Fallback: console trace for observability during development
  // eslint-disable-next-line no-console
  console.log('📊 trackEvent(fallback):', eventName, payload);
  return false;
}


