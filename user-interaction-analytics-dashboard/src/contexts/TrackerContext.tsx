'use client';

import { createContext, useContext, useEffect } from 'react';
import { supabase } from '@/app/utils/supabaseClient';
import { useAuth } from './AuthContext';

interface TrackerContextType {
  trackEvent: (eventType: string, page: string, eventTarget?: string, details?: any) => Promise<void>;
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

export function TrackerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const trackEvent = async (eventType: string, page: string, eventTarget?: string, details?: any) => {
    if (!user) return; // Only track events for authenticated users

    try {
    const sessionId = localStorage.getItem('sessionId') || crypto.randomUUID();
      const { error } = await supabase.from('user_interactions').insert({
        user_id: user.id,
        event_type: eventType,
        page,
        event_target: eventTarget,
        details,
        session_id: crypto.randomUUID(), // Generate a unique session ID
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('sessionId', sessionId);
      if (error) {
        console.error('Error tracking event:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
      }
    } catch (err) {
      console.error('Unexpected error tracking event:', err);
    }
  };
  
    useEffect(() => {
    localStorage.setItem('sessionId', localStorage.getItem('sessionId') || crypto.randomUUID());
    }, []);

  const value = {
    trackEvent
  };

  return (
    <TrackerContext.Provider value={value}>
      {children}
    </TrackerContext.Provider>
  );
}


export function useTracker() {
  const context = useContext(TrackerContext);
  if (!context) {
    throw new Error('useTracker must be used within a TrackerProvider');
  }
  return context;
} 