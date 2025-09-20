import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, User } from 'lucide-react';
import { PasswordStrength } from '@/components/ui/password-strength';
import { GoogleIcon } from '@/components/ui/google-icon';
import ReCAPTCHA from 'react-google-recaptcha';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptPrivacy: false,
    recaptchaToken: '',
  });
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCheckboxChange = (field: string) => (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleRecaptchaChange = (token: string | null) => {
    setFormData(prev => ({
      ...prev,
      recaptchaToken: token || ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acceptTerms || !formData.acceptPrivacy) {
      alert('Bitte akzeptieren Sie die AGBs und Datenschutzerklärung.');
      return;
    }

    if (!formData.recaptchaToken) {
      alert('Bitte bestätigen Sie, dass Sie kein Roboter sind.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwörter stimmen nicht überein.');
      return;
    }

    if (formData.password.length < 6) {
      alert('Passwort muss mindestens 6 Zeichen lang sein.');
      return;
    }

    setLoading(true);
    const { error } = await signUp(
      formData.email,
      formData.password,
      formData.firstName,
      formData.lastName
    );

    if (!error) {
      navigate('/verify-email');
    }
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    await signInWithGoogle();
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-foreground">
            CleanFlow registrieren
          </CardTitle>
          <p className="text-muted-foreground">
            Erstellen Sie Ihr kostenloses Konto
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Vorname</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Max"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nachname</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Muster"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-Mail-Adresse</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="max.muster@beispiel.ch"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Mindestens 6 Zeichen"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-9"
                  required
                  minLength={6}
                />
              </div>
              <PasswordStrength password={formData.password} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Passwort wiederholen"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <ReCAPTCHA
                sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Test key - ersetzen Sie dies mit Ihrem echten Site Key
                onChange={handleRecaptchaChange}
                theme="light"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={handleCheckboxChange('acceptTerms')}
                />
                <Label htmlFor="terms" className="text-sm leading-5">
                  Ich akzeptiere die{' '}
                  <Link to="/agb" className="text-primary hover:underline">
                    Allgemeinen Geschäftsbedingungen
                  </Link>
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="privacy"
                  checked={formData.acceptPrivacy}
                  onCheckedChange={handleCheckboxChange('acceptPrivacy')}
                />
                <Label htmlFor="privacy" className="text-sm leading-5">
                  Ich akzeptiere die{' '}
                  <Link to="/datenschutz" className="text-primary hover:underline">
                    Datenschutzerklärung
                  </Link>
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !formData.acceptTerms || !formData.acceptPrivacy || !formData.recaptchaToken}
            >
              {loading ? 'Registrierung läuft...' : 'Registrieren'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Oder
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignUp}
            disabled={loading}
          >
            <GoogleIcon className="mr-2" size={16} />
            Mit Google registrieren
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Bereits ein Konto?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Jetzt anmelden
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}