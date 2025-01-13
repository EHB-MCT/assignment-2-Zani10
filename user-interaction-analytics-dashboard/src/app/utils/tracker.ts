'use client';

import { supabase } from '@/app/utils/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

interface EventDetails {
  [key: string]: string | number | boolean | object | null;
}

// Initialize session ID only on the client side
let sessionId = '';

export const initTracker = () => {
  if (typeof window === 'undefined') return;
  
  if (!sessionId) {
    // Try to get existing session ID from localStorage
    const existingSessionId = localStorage.getItem('analytics_session_id');
    if (existingSessionId) {
      sessionId = existingSessionId;
    } else {
      // Create new session ID if none exists
      sessionId = uuidv4();
      localStorage.setItem('analytics_session_id', sessionId);
    }
  }
};

export const trackEvent = async (
  eventType: string,
  page: string,
  eventTarget: string,
  details: EventDetails = {},
  userId?: string
) => {
  if (typeof window === 'undefined') return;

  // Ensure tracker is initialized
  initTracker();

  try {
    const { data: { session } } = await supabase.auth.getSession();
    const currentUserId = userId || session?.user?.id;

    const { error } = await supabase.from('user_interactions').insert([
      {
        user_id: currentUserId,
        session_id: sessionId,
        event_type: eventType,
        page,
        event_target: eventTarget,
        details: JSON.stringify(details),
        timestamp: new Date().toISOString()
      }
    ]);

    if (error) {
      console.error('Error tracking event:', error);
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

export const trackPageView = (page: string) => {
  if (typeof window === 'undefined') return;
  return trackEvent('page_view', page, 'page');
};

export const trackClick = (target: string, page: string, details: EventDetails = {}) => {
  if (typeof window === 'undefined') return;
  return trackEvent('click', page, target, details);
};

export const trackFormSubmission = (formId: string, page: string, details: EventDetails = {}) => {
  if (typeof window === 'undefined') return;
  return trackEvent('form_submission', page, formId, details);
};

let scrollTimeout: NodeJS.Timeout;

export function useScrollTracking(page: string) {
  if (typeof window === 'undefined') return;

  const handleScroll = () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
      );
      const windowHeight = window.innerHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollPercent = Math.round((scrollTop / (docHeight - windowHeight)) * 100);

      trackEvent('scroll_depth', page, 'scroll', {
        depth: scrollPercent,
        viewport_height: windowHeight,
        document_height: docHeight
      });
    }, 500);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => {
    clearTimeout(scrollTimeout);
    window.removeEventListener('scroll', handleScroll);
  };
} 