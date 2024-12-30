import { supabase } from './supabaseClient';

// Debounce function to prevent duplicate events
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Main tracking function
async function trackEvent(
  eventType: string,
  eventTarget: string,
  page: string,
  details?: Record<string, any>
) {
  try {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Tracking event:', { eventType, eventTarget, page, details });
    }

    // Insert into Supabase
    const { error } = await supabase.from('user_interactions').insert([
      {
        event_type: eventType,
        event_target: eventTarget,
        page,
        details,
        timestamp: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Error tracking event:', error);
    }
  } catch (err) {
    console.error('Error tracking event:', err);
  }
}

// Track page views
export const trackPageView = debounce((page: string) => {
  trackEvent('page_view', 'page', page, {
    referrer: document.referrer,
    sessionId: getSessionId(),
  });
}, 500);

// Track button/link clicks
export const trackClick = debounce((target: string, page: string) => {
  trackEvent('click', target, page, {
    sessionId: getSessionId(),
  });
}, 300);

// Track form submissions
export const trackFormSubmission = debounce(
  (formId: string, page: string, data: Record<string, any>) => {
    trackEvent('form_submission', formId, page, {
      formData: data,
      sessionId: getSessionId(),
    });
  },
  300
);

// Track scroll depth
export const trackScrollDepth = debounce((page: string, depth: number) => {
  trackEvent('scroll_depth', 'page', page, {
    depth,
    sessionId: getSessionId(),
  });
}, 500);

// Track social link clicks
export const trackSocialClick = debounce((platform: string, page: string) => {
  trackEvent('social_click', platform, page, {
    sessionId: getSessionId(),
  });
}, 300);

// Helper function to get or create session ID
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

// React hook for scroll tracking
export function useScrollTracking(page: string) {
  let maxScroll = 0;

  const handleScroll = debounce(() => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPos = window.scrollY;
    const scrollPercent = Math.round((scrollPos / docHeight) * 100);

    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
      trackScrollDepth(page, scrollPercent);
    }
  }, 500);

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }
} 