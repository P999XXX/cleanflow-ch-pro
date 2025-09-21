import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompanyFormFields } from '@/components/CompanyFormFields';
import { useCompanyData } from '@/hooks/useCompanyData';
import { useAuth } from '@/hooks/useAuth';
import { Building, CheckCircle } from 'lucide-react';

export default function CompanySetup() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    postalCode: '',
    city: '',
    phone: '',
    email: '',
    website: '',
    taxNumber: '',
    vatNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { user } = useAuth();
  const { companyData, hasCompany, saveCompany, loading: companyLoading } = useCompanyData();
  const navigate = useNavigate();

  // Redirect if already has company
  useEffect(() => {
    if (!companyLoading && hasCompany) {
      navigate('/');
    }
  }, [hasCompany, companyLoading, navigate]);

  // Load existing data if available
  useEffect(() => {
    if (companyData) {
      setFormData({
        name: companyData.name,
        address: companyData.address,
        postalCode: companyData.postalCode,
        city: companyData.city,
        phone: companyData.phone,
        email: companyData.email,
        website: companyData.website,
        taxNumber: companyData.taxNumber,
        vatNumber: companyData.vatNumber,
      });
    }
  }, [companyData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    setLoading(true);
    const success = await saveCompany(formData);
    
    if (success) {
      setSuccess(true);
      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
    
    setLoading(false);
  };

  if (companyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
        <Card className="w-full max-w-md shadow-clean-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-success/10">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Setup abgeschlossen!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Ihre Firmendaten wurden erfolgreich gespeichert. Sie werden automatisch weitergeleitet...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <Card className="w-full max-w-2xl shadow-clean-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-primary/10">
              <Building className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Firmendaten erfassen
          </CardTitle>
          <p className="text-muted-foreground">
            Vervollständigen Sie Ihr cleanflow.ai Profil mit Ihren Firmendaten
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <CompanyFormFields
              formData={formData}
              onChange={handleInputChange}
              required={{ name: true }}
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/login')}
                disabled={loading}
              >
                Später
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={loading || !formData.name}
              >
                {loading ? 'Speichern...' : 'Firma erstellen'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}