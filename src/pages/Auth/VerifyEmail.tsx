import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type');

    if (token_hash && type === 'signup') {
      // Handle email verification
      supabase.auth.verifyOtp({
        token_hash,
        type: 'signup'
      }).then(({ error }) => {
        if (error) {
          setVerificationStatus('error');
          setMessage('Verifizierung fehlgeschlagen. Der Link ist möglicherweise abgelaufen.');
        } else {
          setVerificationStatus('success');
          setMessage('E-Mail erfolgreich verifiziert!');
          // Redirect to settings with setup parameter after 2 seconds
          setTimeout(() => {
            navigate('/einstellungen?setup=true');
          }, 2000);
        }
      });
    }
  }, [searchParams, navigate]);

  const resendVerification = async () => {
    // This would need to be implemented with a form to get the email
    // For now, just redirect to register
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <Card className="w-full max-w-md shadow-clean-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-foreground">
            E-Mail-Verifizierung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {verificationStatus === 'pending' && (
            <>
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-accent/10">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Überprüfen Sie Ihre E-Mail</h3>
                <p className="text-muted-foreground">
                  Wir haben Ihnen einen Verifizierungslink gesendet. Klicken Sie auf den Link in der E-Mail, um Ihr Konto zu aktivieren.
                </p>
              </div>
            </>
          )}

          {verificationStatus === 'success' && (
            <>
               <div className="flex justify-center">
                 <div className="p-4 rounded-full bg-success/10">
                   <CheckCircle className="h-8 w-8 text-success" />
                 </div>
               </div>
               <Alert className="border-success/20 bg-success/5">
                 <CheckCircle className="h-4 w-4 text-success" />
                 <AlertDescription className="text-success-foreground">
                  {message} Sie werden automatisch weitergeleitet...
                </AlertDescription>
              </Alert>
            </>
          )}

          {verificationStatus === 'error' && (
            <>
               <div className="flex justify-center">
                 <div className="p-4 rounded-full bg-destructive/10">
                   <AlertCircle className="h-8 w-8 text-destructive" />
                 </div>
               </div>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {message}
                </AlertDescription>
              </Alert>
            </>
          )}

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Keine E-Mail erhalten?
            </p>
            <Button variant="outline" onClick={resendVerification}>
              E-Mail erneut senden
            </Button>
          </div>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => navigate('/login')}
          >
            Zurück zur Anmeldung
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}