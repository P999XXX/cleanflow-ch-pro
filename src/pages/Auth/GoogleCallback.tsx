import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyData } from '@/hooks/useCompanyData';

export default function GoogleCallback() {
  const navigate = useNavigate();
  const { hasCompany, loading } = useCompanyData();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          navigate('/login');
          return;
        }

        if (!session) {
          navigate('/login');
          return;
        }

        // Enhanced new user detection using database timestamp
        const user = session.user;
        
        // Check if user was created very recently (within 2 minutes for better reliability)
        const createdAt = new Date(user.created_at);
        const now = new Date();
        const timeDiff = now.getTime() - createdAt.getTime();
        const isNewUser = timeDiff < 120000; // User created within last 2 minutes
        
        // Additional security check: verify user exists in profiles table
        let hasExistingProfile = false;
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('user_id')
            .eq('user_id', user.id)
            .single();
          hasExistingProfile = !!profile;
        } catch (error) {
          console.log('Profile check during OAuth callback:', error);
        }

        // Wait for company data to load
        if (!loading) {
          // Enhanced logic: redirect to company setup if new user OR no profile OR no company data
          if (isNewUser || !hasExistingProfile || !hasCompany) {
            // New user or user without complete setup - redirect to company setup
            navigate('/company-setup');
          } else {
            // Existing user with complete setup - redirect to dashboard
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate, hasCompany, loading]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}
