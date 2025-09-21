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

        // Check if this is a new user by looking at the created_at timestamp
        const user = session.user;
        const createdAt = new Date(user.created_at);
        const now = new Date();
        const timeDiff = now.getTime() - createdAt.getTime();
        const isNewUser = timeDiff < 60000; // User created within last minute

        // Wait for company data to load
        if (!loading) {
          if (isNewUser || !hasCompany) {
            // New user or user without company data - redirect to company setup
            navigate('/company-setup');
          } else {
            // Existing user with company data - redirect to dashboard
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
