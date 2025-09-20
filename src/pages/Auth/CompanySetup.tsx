import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Building, MapPin, Phone, Mail, Globe, Hash } from 'lucide-react';

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Fehler",
        description: "Sie müssen angemeldet sein.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    const { error } = await supabase
      .from('companies')
      .insert([
        {
          name: formData.name,
          address: formData.address,
          postal_code: formData.postalCode,
          city: formData.city,
          phone: formData.phone,
          email: formData.email,
          website: formData.website,
          tax_number: formData.taxNumber,
          vat_number: formData.vatNumber,
          owner_id: user.id,
        }
      ]);

    if (error) {
      toast({
        title: "Fehler",
        description: "Firma konnte nicht erstellt werden: " + error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Erfolgreich",
        description: "Ihre Firma wurde erfolgreich eingerichtet!",
      });
      navigate('/');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <Card className="w-full max-w-2xl shadow-elegant">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-elegant bg-clip-text text-transparent">
            Firmendaten erfassen
          </CardTitle>
          <p className="text-muted-foreground">
            Vervollständigen Sie Ihr Profil mit Ihren Firmendaten
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Firmenname */}
            <div className="space-y-2">
              <Label htmlFor="name">Firmenname *</Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  placeholder="CleanFlow Reinigungsservice GmbH"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            {/* Adresse */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    name="address"
                    placeholder="Musterstrasse 123"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">PLZ</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  placeholder="8000"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Ort</Label>
              <Input
                id="city"
                name="city"
                placeholder="Zürich"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>

            {/* Kontaktdaten */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+41 44 123 45 67"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="info@cleanflow.ch"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website (optional)</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://www.cleanflow.ch"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Steuernummern */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxNumber">Steuernummer (optional)</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="taxNumber"
                    name="taxNumber"
                    placeholder="CHE-123.456.789"
                    value={formData.taxNumber}
                    onChange={handleInputChange}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vatNumber">MWST-Nummer (optional)</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="vatNumber"
                    name="vatNumber"
                    placeholder="CHE-123.456.789 MWST"
                    value={formData.vatNumber}
                    onChange={handleInputChange}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/login')}
              >
                Später vervollständigen
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