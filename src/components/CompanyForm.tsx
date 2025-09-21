import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Building, MapPin, Phone, Mail, Globe, Hash, Check, ChevronDown } from 'lucide-react';
import { swissPostalCodes, findCityByPostalCode } from '@/data/swiss-postal-codes';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface CompanyFormProps {
  isProfile?: boolean;
  onSuccess?: () => void;
}

export default function CompanyForm({ isProfile = false, onSuccess }: CompanyFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    postalCode: '',
    city: '',
    country: 'Schweiz',
    phone: '',
    email: '',
    website: '',
    taxNumber: '',
    vatNumber: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [companyExists, setCompanyExists] = useState(false);
  const [postalCodeOpen, setPostalCodeOpen] = useState(false);

  useEffect(() => {
    if (isProfile && user) {
      loadCompanyData();
    }
  }, [isProfile, user]);

  const loadCompanyData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading company:', error);
        return;
      }

      if (data) {
        setFormData({
          name: data.name || '',
          address: data.address || '',
          postalCode: data.postal_code || '',
          city: data.city || '',
          country: data.country || 'Schweiz',
          phone: data.phone || '',
          email: data.email || '',
          website: data.website || '',
          taxNumber: data.tax_number || '',
          vatNumber: data.vat_number || ''
        });
        setCompanyExists(true);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePostalCodeSelect = (selectedPlz: string) => {
    const city = findCityByPostalCode(selectedPlz);
    setFormData(prev => ({
      ...prev,
      postalCode: selectedPlz,
      city: city
    }));
    setPostalCodeOpen(false);
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

    try {
      const companyData = {
        name: formData.name,
        address: formData.address,
        postal_code: formData.postalCode,
        city: formData.city,
        country: formData.country,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        tax_number: formData.taxNumber,
        vat_number: formData.vatNumber,
        owner_id: user.id
      };

      if (companyExists) {
        const { error } = await supabase
          .from('companies')
          .update(companyData)
          .eq('owner_id', user.id);

        if (error) throw error;

        toast({
          title: "Erfolgreich aktualisiert",
          description: "Ihre Firmendaten wurden erfolgreich aktualisiert.",
        });
      } else {
        const { error } = await supabase
          .from('companies')
          .insert([companyData]);

        if (error) throw error;

        toast({
          title: "Erfolgreich erstellt",
          description: "Ihre Firmendaten wurden erfolgreich gespeichert.",
        });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error saving company:', error);
      toast({
        title: "Fehler beim Speichern",
        description: error.message || "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-clean-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-foreground">
          {isProfile ? 'Firmendaten' : 'Firmendaten erfassen'}
        </CardTitle>
        <p className="text-muted-foreground">
          {isProfile 
            ? 'Verwalten Sie Ihre Firmendaten' 
            : 'Vervollständigen Sie Ihr Profil mit den Firmendaten'
          }
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
              <Popover open={postalCodeOpen} onOpenChange={setPostalCodeOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={postalCodeOpen}
                    className="w-full justify-between h-10"
                  >
                    {formData.postalCode || "PLZ wählen..."}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="PLZ suchen..." />
                    <CommandList>
                      <CommandEmpty>Keine PLZ gefunden.</CommandEmpty>
                      <CommandGroup>
                        {swissPostalCodes.map((code) => (
                          <CommandItem
                            key={code.plz}
                            value={code.plz}
                            onSelect={() => handlePostalCodeSelect(code.plz)}
                          >
                            {code.plz} - {code.ort} ({code.kanton})
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
              disabled
              className="bg-muted cursor-not-allowed"
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

          {/* Steuerdaten */}
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

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-medium" 
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Speichern...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                {companyExists ? 'Aktualisieren' : isProfile ? 'Speichern' : 'Firma registrieren'}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}