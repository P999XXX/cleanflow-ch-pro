import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { ChevronLeft, Building2, MapPin, Phone, Mail, Globe, Loader2 } from 'lucide-react';
import { CustomerCompany, CustomerCompanyInput, useCompanies } from '@/hooks/useCompanies';
import { ContactPerson, ContactPersonInput } from '@/hooks/useContactPersons';
import { useToast } from '@/hooks/use-toast';
import { ContactPersonForm } from './ContactPersonForm';
import { ContactTypeSelector, ContactType } from './ContactTypeSelector';
import { EmployeeDetailsInput } from '@/hooks/useEmployeeDetails';
import { useSwissGeocode } from '@/hooks/useSwissGeocode';
type ContactFormStage = 'select' | 'form';
interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitCompany: (company: CustomerCompanyInput) => void;
  onSubmitPerson: (person: ContactPersonInput, employeeDetails?: EmployeeDetailsInput, children?: any[]) => void;
  company?: CustomerCompany;
  contactPerson?: ContactPerson;
  isLoading?: boolean;
}
export const ContactForm = ({
  isOpen,
  onClose,
  onSubmitCompany,
  onSubmitPerson,
  company,
  contactPerson,
  isLoading
}: ContactFormProps) => {
  const {
    data: companies
  } = useCompanies();
  const {
    toast
  } = useToast();
  const { getCityFromPostalCode, getPostalCodeFromCity } = useSwissGeocode();
  const [stage, setStage] = useState<ContactFormStage>('select');
  const [selectedType, setSelectedType] = useState<ContactType | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingPostalCode, setIsLoadingPostalCode] = useState(false);
  const [isLoadingCity, setIsLoadingCity] = useState(false);
  const postalCodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [companyData, setCompanyData] = useState<CustomerCompanyInput>({
    name: '',
    address: '',
    city: '',
    postal_code: '',
    country: 'Schweiz',
    phone: '',
    email: '',
    website: '',
    vat_number: '',
    notes: '',
    status: 'aktiv',
    company_type: '',
    industry_category: '',
    contact_type: 'Unternehmen'
  });

  // Reset stage when dialog opens/closes
  useEffect(() => {
    if (isOpen && !company && !contactPerson) {
      setStage('select');
      setSelectedType(null);
    } else if (company || contactPerson) {
      setStage('form');
      setSelectedType(company ? 'company' : contactPerson?.is_employee ? 'employee' : 'person');
    }
  }, [isOpen, company, contactPerson]);
  useEffect(() => {
    if (company) {
      setCompanyData({
        name: company.name,
        address: company.address || '',
        city: company.city || '',
        postal_code: company.postal_code || '',
        country: company.country || 'Schweiz',
        phone: company.phone || '',
        email: company.email || '',
        website: company.website || '',
        vat_number: company.vat_number || '',
        notes: company.notes || '',
        status: company.status || 'aktiv',
        company_type: company.company_type || '',
        industry_category: company.industry_category || '',
        contact_type: company.contact_type || 'Unternehmen'
      });
    } else {
      setCompanyData({
        name: '',
        address: '',
        city: '',
        postal_code: '',
        country: 'Schweiz',
        phone: '',
        email: '',
        website: '',
        vat_number: '',
        notes: '',
        status: 'aktiv',
        company_type: '',
        industry_category: '',
        contact_type: 'Unternehmen'
      });
    }
  }, [company]);
  const validateCompanyForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!companyData.name.trim()) {
      newErrors.name = 'Firmenname ist erforderlich';
    }
    if (!companyData.address.trim()) {
      newErrors.address = 'Adresse ist erforderlich';
    }
    if (!companyData.postal_code.trim()) {
      newErrors.postal_code = 'PLZ ist erforderlich';
    } else if (!/^\d{4}$/.test(companyData.postal_code)) {
      newErrors.postal_code = 'PLZ muss 4 Ziffern enthalten';
    }
    if (!companyData.city.trim()) {
      newErrors.city = 'Ort ist erforderlich';
    }
    if (!companyData.country.trim()) {
      newErrors.country = 'Land ist erforderlich';
    }
    if (!companyData.contact_type.trim()) {
      newErrors.contact_type = 'Kontaktart ist erforderlich';
    }
    if (!companyData.status.trim()) {
      newErrors.status = 'Status ist erforderlich';
    }
    if (!companyData.phone.trim()) {
      newErrors.phone = 'Telefon ist erforderlich';
    } else if (!/^[\+]?[\d\s\-\(\)\/]+$/.test(companyData.phone)) {
      newErrors.phone = 'Ungültiges Telefonformat';
    }
    if (!companyData.email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyData.email)) {
      newErrors.email = 'Ungültige E-Mail-Adresse';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleInputChange = (field: string, value: string) => {
    setCompanyData({
      ...companyData,
      [field]: value
    });

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };

  // Handle postal code change with geocoding
  const handlePostalCodeChange = async (value: string) => {
    handleInputChange('postal_code', value);

    // Clear existing timeout
    if (postalCodeTimeoutRef.current) {
      clearTimeout(postalCodeTimeoutRef.current);
    }

    // Only proceed if we have a valid 4-digit Swiss postal code
    if (!/^\d{4}$/.test(value)) {
      return;
    }

    // Debounce the API call
    postalCodeTimeoutRef.current = setTimeout(async () => {
      setIsLoadingCity(true);
      try {
        const city = await getCityFromPostalCode(value);
        if (city && !companyData.city) {
          setCompanyData(prev => ({
            ...prev,
            city: city
          }));
          toast({
            title: 'Ortschaft ergänzt',
            description: `${city} wurde automatisch hinzugefügt`,
          });
        }
      } catch (error) {
        console.error('Error fetching city:', error);
      } finally {
        setIsLoadingCity(false);
      }
    }, 500);
  };

  // Handle city change with geocoding
  const handleCityChange = async (value: string) => {
    handleInputChange('city', value);

    // Clear existing timeout
    if (cityTimeoutRef.current) {
      clearTimeout(cityTimeoutRef.current);
    }

    // Only proceed if we have at least 3 characters
    if (value.trim().length < 3) {
      return;
    }

    // Debounce the API call
    cityTimeoutRef.current = setTimeout(async () => {
      setIsLoadingPostalCode(true);
      try {
        const postalCode = await getPostalCodeFromCity(value);
        if (postalCode && !companyData.postal_code) {
          setCompanyData(prev => ({
            ...prev,
            postal_code: postalCode
          }));
          toast({
            title: 'PLZ ergänzt',
            description: `${postalCode} wurde automatisch hinzugefügt`,
          });
        }
      } catch (error) {
        console.error('Error fetching postal code:', error);
      } finally {
        setIsLoadingPostalCode(false);
      }
    }, 500);
  };
  const handleSelectChange = (field: string, value: string) => {
    setCompanyData({
      ...companyData,
      [field]: value
    });

    // Clear field error when user selects a value
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateCompanyForm();
    if (isValid) {
      onSubmitCompany(companyData);
    } else {
      toast({
        title: 'Validierungsfehler',
        description: 'Bitte korrigieren Sie die markierten Felder',
        variant: 'destructive'
      });
    }
  };
  const handleTypeSelect = (type: ContactType) => {
    setSelectedType(type);
    setStage('form');
  };
  const handleBack = () => {
    setStage('select');
    setSelectedType(null);
  };
  const getTitle = () => {
    if (company) return 'Unternehmen bearbeiten';
    if (contactPerson) return 'Kontaktperson bearbeiten';
    if (stage === 'select') return '';
    switch (selectedType) {
      case 'company':
        return 'Neues Unternehmen';
      case 'person':
        return 'Neue Kontaktperson';
      case 'employee':
        return 'Neuer Mitarbeiter';
      default:
        return 'Neuer Kontakt';
    }
  };
  const getDescription = () => {
    if (company) return 'Bearbeiten Sie die Unternehmensdaten';
    if (contactPerson) return contactPerson.is_employee ? 'Bearbeiten Sie die Mitarbeiterdaten' : 'Bearbeiten Sie die Kontaktdaten';
    if (stage === 'select') return 'Wählen Sie die Art des Kontakts aus';
    switch (selectedType) {
      case 'company':
        return 'Fügen Sie ein neues Unternehmen hinzu';
      case 'person':
        return 'Fügen Sie eine neue Kontaktperson hinzu';
      case 'employee':
        return 'Fügen Sie einen neuen Mitarbeiter hinzu';
      default:
        return 'Fügen Sie einen neuen Kontakt hinzu';
    }
  };

  // Show ContactPersonForm for person or employee types
  if (stage === 'form' && (selectedType === 'person' || selectedType === 'employee')) {
    return <ContactPersonForm isOpen={isOpen} onClose={onClose} onSubmit={onSubmitPerson} contactPerson={contactPerson} isLoading={isLoading} initialIsEmployee={selectedType === 'employee'} onBack={!company && !contactPerson ? handleBack : undefined} />;
  }
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl" onOpenAutoFocus={(e) => e.preventDefault()}>
        {stage === 'form' && (
          <DialogHeader>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {!company && !contactPerson && (
                  <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                )}
                <DialogTitle>{getTitle()}</DialogTitle>
              </div>
              {selectedType === 'company' && (
                <div className="flex items-center gap-3">
                  <Label htmlFor="status-toggle" className="text-sm font-medium cursor-pointer">
                    {companyData.status === 'aktiv' ? 'Aktiv' : 'Inaktiv'}
                  </Label>
                  <Switch
                    id="status-toggle"
                    checked={companyData.status === 'aktiv'}
                    onCheckedChange={(checked) => handleSelectChange('status', checked ? 'aktiv' : 'inaktiv')}
                  />
                </div>
              )}
            </div>
          </DialogHeader>
        )}

        {stage === 'select' && <ContactTypeSelector onSelect={handleTypeSelect} onClose={onClose} />}

        {stage === 'form' && selectedType === 'company' && <form onSubmit={handleSubmit} className="space-y-4">
            {/* Typ Radio Buttons */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <Label className="text-base font-semibold mb-3 block">Kontakttyp wählen <span className="text-foreground">*</span></Label>
              <RadioGroup value={companyData.contact_type} onValueChange={value => handleInputChange('contact_type', value)} className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Unternehmen" id="unternehmen" />
                  <Label htmlFor="unternehmen" className="font-normal cursor-pointer">Unternehmen</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Geschäftskunde" id="geschaeftskunde" />
                  <Label htmlFor="geschaeftskunde" className="font-normal cursor-pointer">Geschäftskunde</Label>
                </div>
              </RadioGroup>
            </div>

          <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">
                  Firmenname <span className="text-foreground">*</span>
                </Label>
                <Input id="name" value={companyData.name} onChange={e => handleInputChange('name', e.target.value)} required className={errors.name ? 'border-destructive' : ''} />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="address">
                  Adresse <span className="text-foreground">*</span>
                </Label>
                <Input id="address" value={companyData.address} onChange={e => handleInputChange('address', e.target.value)} required className={errors.address ? 'border-destructive' : ''} />
                {errors.address && <p className="text-sm text-destructive mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postal_code">
                    PLZ <span className="text-foreground">*</span>
                  </Label>
                  <div className="relative">
                    <Input 
                      id="postal_code" 
                      value={companyData.postal_code} 
                      onChange={e => handlePostalCodeChange(e.target.value)} 
                      required 
                      className={errors.postal_code ? 'border-destructive' : ''} 
                      placeholder="z.B. 8000"
                    />
                    {isLoadingCity && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                  {errors.postal_code && <p className="text-sm text-destructive mt-1">{errors.postal_code}</p>}
                </div>
                <div>
                  <Label htmlFor="city">
                    Ort <span className="text-foreground">*</span>
                  </Label>
                  <div className="relative">
                    <Input 
                      id="city" 
                      value={companyData.city} 
                      onChange={e => handleCityChange(e.target.value)} 
                      required 
                      className={errors.city ? 'border-destructive' : ''} 
                      placeholder="z.B. Zürich"
                    />
                    {isLoadingPostalCode && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                  {errors.city && <p className="text-sm text-destructive mt-1">{errors.city}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="country">
                  Land <span className="text-foreground">*</span>
                </Label>
                <Input id="country" value={companyData.country} onChange={e => handleInputChange('country', e.target.value)} required className={errors.country ? 'border-destructive' : ''} />
                {errors.country && <p className="text-sm text-destructive mt-1">{errors.country}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">
                    Telefon <span className="text-foreground">*</span>
                  </Label>
                  <Input id="phone" value={companyData.phone} onChange={e => handleInputChange('phone', e.target.value)} required className={errors.phone ? 'border-destructive' : ''} />
                  {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <Label htmlFor="email">
                    E-Mail <span className="text-foreground">*</span>
                  </Label>
                  <Input id="email" type="email" value={companyData.email} onChange={e => handleInputChange('email', e.target.value)} required className={errors.email ? 'border-destructive' : ''} />
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input id="website" value={companyData.website} onChange={e => handleInputChange('website', e.target.value)} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company_type">
                    Gesellschaftsart
                  </Label>
                  <Select value={companyData.company_type} onValueChange={value => handleSelectChange('company_type', value)}>
                    <SelectTrigger className={errors.company_type ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Gesellschaftsart auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AG">Aktiengesellschaft (AG)</SelectItem>
                      <SelectItem value="GmbH">Gesellschaft mit beschränkter Haftung (GmbH)</SelectItem>
                      <SelectItem value="KG">Kommanditgesellschaft (KG)</SelectItem>
                      <SelectItem value="OHG">Offene Handelsgesellschaft (OHG)</SelectItem>
                      <SelectItem value="Einzelunternehmen">Einzelunternehmen</SelectItem>
                      <SelectItem value="Genossenschaft">Genossenschaft</SelectItem>
                      <SelectItem value="Verein">Verein</SelectItem>
                      <SelectItem value="Stiftung">Stiftung</SelectItem>
                      <SelectItem value="Öffentlich">Öffentliche Einrichtung</SelectItem>
                      <SelectItem value="Sonstige">Sonstige</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.company_type && <p className="text-sm text-destructive mt-1">{errors.company_type}</p>}
                </div>
                <div>
                  <Label htmlFor="industry_category">
                    Branche
                  </Label>
                  <Select value={companyData.industry_category} onValueChange={value => handleSelectChange('industry_category', value)}>
                    <SelectTrigger className={errors.industry_category ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Branche auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Büro">Büro & Verwaltung</SelectItem>
                      <SelectItem value="Einzelhandel">Einzelhandel</SelectItem>
                      <SelectItem value="Gastronomie">Gastronomie & Hotellerie</SelectItem>
                      <SelectItem value="Gesundheitswesen">Gesundheitswesen</SelectItem>
                      <SelectItem value="Bildung">Bildung & Erziehung</SelectItem>
                      <SelectItem value="Industrie">Industrie & Produktion</SelectItem>
                      <SelectItem value="Logistik">Logistik & Transport</SelectItem>
                      <SelectItem value="Immobilien">Immobilien & Hausverwaltung</SelectItem>
                      <SelectItem value="Öffentlich">Öffentlicher Sektor</SelectItem>
                      <SelectItem value="Sonstige">Sonstige</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.industry_category && <p className="text-sm text-destructive mt-1">{errors.industry_category}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="vat_number">MwSt-Nummer</Label>
                <Input id="vat_number" value={companyData.vat_number} onChange={e => handleInputChange('vat_number', e.target.value)} />
              </div>

              <div>
                <Label htmlFor="notes">Notizen</Label>
                <Textarea id="notes" value={companyData.notes} onChange={e => handleInputChange('notes', e.target.value)} rows={3} />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Abbrechen
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Lädt...' : company ? 'Aktualisieren' : 'Speichern'}
              </Button>
            </div>
          </form>}
      </DialogContent>
    </Dialog>;
};