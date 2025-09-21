import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string, recaptchaToken?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // This check is no longer needed since deleted users are completely removed from auth

  const signUp = async (email: string, password: string, firstName: string, lastName: string, recaptchaToken?: string) => {
    // Verify reCAPTCHA if token is provided
    if (recaptchaToken) {
      try {
        const { data: verificationResult, error: verificationError } = await supabase.functions.invoke('verify-recaptcha', {
          body: { token: recaptchaToken }
        });

        if (verificationError) {
          toast({
            title: "Registrierung fehlgeschlagen",
            description: "reCAPTCHA Verifizierung fehlgeschlagen.",
            variant: "destructive",
          });
          return { error: verificationError };
        }

        if (!verificationResult.success) {
          toast({
            title: "Registrierung fehlgeschlagen",
            description: "reCAPTCHA Verifizierung nicht erfolgreich.",
            variant: "destructive",
          });
          return { error: { message: "reCAPTCHA verification failed" } };
        }
      } catch (error) {
        toast({
          title: "Registrierung fehlgeschlagen",
          description: "Fehler bei der reCAPTCHA Verifizierung.",
          variant: "destructive",
        });
        return { error };
      }
    }

    const redirectUrl = `${window.location.origin}/verify-email`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    });

    if (error) {
      toast({
        title: "Registrierung fehlgeschlagen",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Registrierung erfolgreich",
        description: "Bitte bestätigen Sie Ihre E-Mail.",
      });
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: error.message,
        variant: "destructive",
      });
    }

    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      }
    });

    if (error) {
      let errorMessage = error.message;
      
      // Provide more user-friendly error messages
      if (error.message.includes('invalid_client')) {
        errorMessage = "Google-Anmeldung ist derzeit nicht verfügbar. Bitte versuchen Sie es später erneut oder verwenden Sie die E-Mail-Anmeldung.";
      } else if (error.message.includes('redirect_uri_mismatch')) {
        errorMessage = "Konfigurationsfehler bei der Google-Anmeldung. Bitte kontaktieren Sie den Support.";
      }
      
      toast({
        title: "Google-Anmeldung fehlgeschlagen",
        description: errorMessage,
        variant: "destructive",
      });
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Erfolgreich abgemeldet",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
    }}>
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