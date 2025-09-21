import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Building, MapPin, Phone, Mail, Globe, Hash, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompanyFormProps {
  isProfile?: boolean;
  isSetupMode?: boolean;
  onSuccess?: () => void;
  isModal?: boolean;
  onClose?: () => void;
  title?: string;
}

export default function CompanyForm({ 
  isProfile = false, 
  isSetupMode = false, 
  onSuccess, 
  isModal = false, 
  onClose,
  title 
}: CompanyFormProps) {
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
  const [companyExists, setCompanyExists] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadCompanyData();
    }
  }, [user]);

  useEffect(() => {
    if (isModal) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && onClose) {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isModal, onClose]);

  const loadCompanyData = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('owner_id', user.id)
      .maybeSingle();

    if (data && !error) {
      setFormData({
        name: data.name || '',
        address: data.address || '',
        postalCode: data.postal_code || '',
        city: data.city || '',
        phone: data.phone || '',
        email: data.email || '',
        website: data.website || '',
        taxNumber: data.tax_number || '',
        vatNumber: data.vat_number || '',
      });
      setCompanyExists(true);
      
      // If this is the setup mode (first-time from email verification) and company exists, trigger onSuccess
      if (isSetupMode && onSuccess && data.name) {
        setTimeout(() => {
          onSuccess();
        }, 500);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const waitForCompany = async (maxAttempts = 6, delayMs = 400) => {
    if (!user) return null;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const { data, error } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (data && !error) return data;
      await new Promise((r) => setTimeout(r, delayMs));
    }
    return null;
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
    
    const companyData = {
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
    };

    try {
      let opError: any = null;

      if (companyExists) {
        const { error } = await supabase
          .from('companies')
          .update(companyData)
          .eq('owner_id', user.id)
          .select('id')
          .maybeSingle();
        opError = error;
      } else {
        const { error } = await supabase
          .from('companies')
          .insert([companyData])
          .select('id')
          .maybeSingle();
        opError = error;
      }

      if (opError) {
        toast({
          title: "Fehler",
          description: `Firma konnte nicht ${companyExists ? 'aktualisiert' : 'erstellt'} werden: ` + opError.message,
          variant: "destructive",
        });
        return;
      }

      // Verifizieren, dass die Firma lesbar ist (RLS/Propagation) bevor wir weiterleiten
      const confirmed = await waitForCompany(10, 400);
      if (!confirmed) {
        toast({
          title: "Hinweis",
          description: "Firmendaten gespeichert, bitte einen Moment...",
        });
        // Abbrechen, bis die Daten sicher lesbar sind, um Endlosschleifen im Guard zu vermeiden
        return;
      }

      setCompanyExists(true);
      toast({
        title: "Erfolgreich",
        description: `Ihre Firmendaten wurden erfolgreich ${companyExists ? 'aktualisiert' : 'erstellt'}!`,
      });

      // Only trigger onSuccess in setup mode (first-time setup)
      if (isSetupMode && onSuccess) {
        onSuccess();
      } else if (isModal && onClose) {
        onClose();
      }
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <Card className={cn(
      isModal ? "" : (isProfile ? "" : "w-full max-w-2xl shadow-clean-lg")
    )}>
      <CardHeader className="space-y-1">
        {isModal && title && (
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-foreground">
              {title}
            </CardTitle>
            <button
              onClick={onClose}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Schließen</span>
            </button>
          </div>
        )}
        {!isModal && (
          <CardTitle className={`${isProfile ? "text-xl" : "text-2xl"} font-bold text-foreground`}>
            {isProfile ? "Firmendaten" : "Firmendaten erfassen"}
          </CardTitle>
        )}
        {isSetupMode && (
          <p className="text-muted-foreground">
            Vervollständigen Sie Ihr cleanflow.ai Profil mit Ihren Firmendaten
          </p>
        )}
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
                placeholder="cleanflow Reinigungsservice GmbH"
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
                  placeholder="info@cleanflow.ai"
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
                placeholder="https://www.cleanflow.ai"
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
              type="submit"
              className="flex-1"
              disabled={loading || !formData.name}
            >
              {loading ? 'Speichern...' : (companyExists ? 'Aktualisieren' : (isProfile ? 'Speichern' : 'Firma erstellen'))}
            </Button>
          </div>
        </form>

      </CardContent>
    </Card>
  );

  if (isModal) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/20"
        onClick={onClose}
      >
        <div 
          className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {formContent}
        </div>
      </div>
    );
  }

  return formContent;
}