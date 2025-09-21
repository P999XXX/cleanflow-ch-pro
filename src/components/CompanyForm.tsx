import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Building, MapPin, Phone, Mail, Globe, Hash, Check, Trash2 } from 'lucide-react';

interface CompanyFormProps {
  isProfile?: boolean;
  onSuccess?: () => void;
}

export default function CompanyForm({ isProfile = false, onSuccess }: CompanyFormProps) {
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
  const [deleting, setDeleting] = useState(false);
  const [companyExists, setCompanyExists] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadCompanyData();
    }
  }, [user]);

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
      
      // If this is the company setup flow and company exists, trigger onSuccess
      if (!isProfile && onSuccess && data.name) {
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

      if (onSuccess) {
        onSuccess();
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

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    const confirmed = window.confirm(
      'Sind Sie sicher, dass Sie Ihr Konto permanent löschen möchten?\n\n' +
      'Diese Aktion kann nicht rückgängig gemacht werden und alle Ihre Daten werden unwiderruflich entfernt.'
    );

    if (!confirmed) return;

    const doubleConfirmed = window.confirm(
      'LETZTE WARNUNG: Ihr Konto und alle Daten werden permanent gelöscht.\n\n' +
      'Klicken Sie OK um fortzufahren oder Abbrechen um den Vorgang abzubrechen.'
    );

    if (!doubleConfirmed) return;

    setDeleting(true);

    try {
      const { data, error } = await supabase.functions.invoke('delete-account');

      if (error) {
        toast({
          title: "Fehler",
          description: "Konto konnte nicht gelöscht werden: " + error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Konto gelöscht",
          description: "Ihr Konto wurde erfolgreich gelöscht.",
        });
        
        // Sign out and redirect to register
        await signOut();
        navigate('/register');
      }
    } catch (err) {
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className={isProfile ? "" : "w-full max-w-2xl shadow-clean-lg"}>
      <CardHeader className="space-y-1">
        <CardTitle className={`${isProfile ? "text-xl" : "text-2xl"} font-bold text-foreground`}>
          {isProfile ? "Firmendaten" : "Firmendaten erfassen"}
        </CardTitle>
        {!isProfile && (
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
              disabled={loading || deleting || !formData.name}
            >
              {loading ? 'Speichern...' : (companyExists ? 'Aktualisieren' : (isProfile ? 'Speichern' : 'Firma erstellen'))}
            </Button>
          </div>
        </form>

        {!isProfile && (
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex flex-col gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={handleSignOut}
                disabled={loading || deleting}
                className="text-muted-foreground hover:text-foreground"
              >
                Von diesem Konto abmelden
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                onClick={handleDeleteAccount}
                disabled={loading || deleting}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 flex items-center justify-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {deleting ? 'Konto wird gelöscht...' : 'Konto permanent löschen'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}