import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types/profile';

interface SignUpParams {
  name: string;
  email: string;
  password: string;
  inviteCode: string;
}

interface AuthContextValue {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  signUpWithInvite: (params: SignUpParams) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function translateError(message: string): string {
  const translations: Record<string, string> = {
    'Invalid login credentials': 'ایمیل یا رمز عبور اشتباه است',
    'User already registered': 'این ایمیل قبلاً ثبت‌نام شده است',
    'Password should be at least 6 characters': 'رمز عبور باید حداقل ۶ کاراکتر باشد',
    'Unable to validate email address': 'ایمیل معتبر نیست',
    'Email not confirmed': 'لطفاً ابتدا ایمیل خود را تأیید کنید',
  };
  return translations[message] || message;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching profile:', fetchError.message);
      return;
    }

    if (data) {
      setProfile(data as Profile);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (session?.user) {
      await fetchProfile(session.user.id);
    }
  }, [session, fetchProfile]);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      if (initialSession?.user) {
        fetchProfile(initialSession.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        if (newSession?.user) {
          fetchProfile(newSession.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signUpWithInvite = async (params: SignUpParams): Promise<{ error: string | null }> => {
    setError(null);
    const { name, email, password, inviteCode } = params;

    // Step 1: Sign up the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      return { error: translateError(signUpError.message) };
    }

    // If email confirmation is required (no immediate session)
    if (!signUpData.session) {
      return { error: 'لطفاً ابتدا ایمیل خود را تأیید کنید' };
    }

    const userId = signUpData.user?.id;
    if (!userId) {
      return { error: 'خطای غیرمنتظره در ثبت‌نام' };
    }

    // Step 2: Consume the invite code
    try {
      const { error: rpcError } = await supabase.rpc('consume_invite_code', {
        p_code: inviteCode,
        p_user_id: userId,
      });

      if (rpcError) {
        // Rollback: sign out the user
        await supabase.auth.signOut();
        return { error: rpcError.message };
      }
    } catch (err) {
      // Rollback: sign out the user
      await supabase.auth.signOut();
      const message = err instanceof Error ? err.message : 'خطا در مصرف کد دعوت';
      return { error: message };
    }

    // Step 3: Update callsign with user-provided name
    if (name.trim()) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ callsign: name.trim() })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating callsign:', updateError.message);
      }
    }

    // Refresh profile
    await fetchProfile(userId);

    return { error: null };
  };

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      const translated = translateError(signInError.message);
      setError(translated);
      return { error: translated };
    }

    return { error: null };
  };

  const signOut = async (): Promise<void> => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setError(null);
  };

  const value: AuthContextValue = {
    session,
    profile,
    loading,
    error,
    signUpWithInvite,
    signIn,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
