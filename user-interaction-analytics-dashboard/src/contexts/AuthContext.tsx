'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/app/utils/supabaseClient';
import { useRouter } from 'next/navigation';
import type { User } from '@/app/utils/supabaseClient';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        throw new Error('User profile not found');
      }

      return data;
    } catch (err) {
      console.error('Unexpected error in getUserProfile:', err);
      throw err;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error retrieving session:', error);
          return;
        }

        if (session?.user) {
          const profile = await getUserProfile(session.user.id);
          if (profile) setUser(profile);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          const profile = await getUserProfile(session.user.id);
          if (profile) {
            setUser(profile);
          }
        } else {
          setUser(null);
          await router.push('/');
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setUser(null);
      }
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [router]);

  const signUp = async (email: string, password: string, username: string) => {
    try {
      setLoading(true);

      // Create auth user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error('No user returned after signup');

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert([{
          id: data.user.id,
          username,
          email
        }]);

      if (profileError) throw profileError;

      const profile = await getUserProfile(data.user.id);
      if (!profile) throw new Error('Failed to create user profile');

      setUser(profile);
      await router.push('/dashboard');
      return { error: null };
    } catch (error) {
      console.error('Error during signup:', error);
      return { error: error instanceof Error ? error.message : 'An unexpected error occurred during signup' };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;
      if (!data.user) throw new Error('No user returned after sign in');

      const profile = await getUserProfile(data.user.id);
      if (!profile) throw new Error('User profile not found');

      setUser(profile);
      await router.push('/dashboard');
      return { error: null };
    } catch (error) {
      console.error('Error during sign in:', error);
      return { error: error instanceof Error ? error.message : 'An unexpected error occurred during sign in' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      await router.push('/');
    } catch (error) {
      console.error('Error during sign out:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function ProtectedRoute(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login');
      }
    }, [user, loading, router]);

    if (loading) {
      return <div>Loading...</div>;
    }

    return user ? <Component {...props} /> : null;
  };
} 