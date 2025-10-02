import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { ChevronLeft, Building2, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { CustomerCompany, CustomerCompanyInput, useCompanies } from '@/hooks/useCompanies';
import { ContactPerson, ContactPersonInput } from '@/hooks/useContactPersons';
import { useToast } from '@/hooks/use-toast';
import { ContactPersonForm } from './ContactPersonForm';
import { ContactTypeSelector, ContactType } from './ContactTypeSelector';
import { EmployeeDetailsInput } from '@/hooks/useEmployeeDetails';
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
  const [stage, setStage] = useState<ContactFormStage>('select');
  const [selectedType, setSelectedType] = useState<ContactType | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    
    // PLZ validation: 4 digits only for Switzerland
    if (!companyData.postal_code.trim()) {
      newErrors.postal_code = 'PLZ ist erforderlich';
    } else if (companyData.country === 'Schweiz' && !/^\d{4}$/.test(companyData.postal_code)) {
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
    
    // Phone validation: must start with +41 for Swiss numbers
    if (!companyData.phone.trim()) {
      newErrors.phone = 'Telefon ist erforderlich';
    } else if (companyData.country === 'Schweiz' && !companyData.phone.startsWith('+41')) {
      newErrors.phone = 'Schweizer Telefonnummern müssen mit +41 beginnen';
    } else if (!/^[\+]?[\d\s\-\(\)\/]+$/.test(companyData.phone)) {
      newErrors.phone = 'Ungültiges Telefonformat';
    }
    
    // Email validation
    if (!companyData.email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!companyData.email.includes('@')) {
      newErrors.email = 'E-Mail muss ein @ enthalten';
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
                <Input 
                  id="name" 
                  value={companyData.name} 
                  onChange={e => handleInputChange('name', e.target.value)} 
                  placeholder="z.B. CleanFlow AG"
                  required 
                  className={errors.name ? 'border-destructive' : ''} 
                />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                {!errors.name && <p className="text-sm text-muted-foreground mt-1">Beispiel: CleanFlow AG</p>}
              </div>

              <div>
                <Label htmlFor="address">
                  Adresse <span className="text-foreground">*</span>
                </Label>
                <Input 
                  id="address" 
                  value={companyData.address} 
                  onChange={e => handleInputChange('address', e.target.value)} 
                  placeholder="z.B. Bahnhofstrasse 123"
                  required 
                  className={errors.address ? 'border-destructive' : ''} 
                />
                {errors.address && <p className="text-sm text-destructive mt-1">{errors.address}</p>}
                {!errors.address && <p className="text-sm text-muted-foreground mt-1">Beispiel: Bahnhofstrasse 123</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postal_code">
                    PLZ <span className="text-foreground">*</span>
                  </Label>
                  <Input 
                    id="postal_code" 
                    value={companyData.postal_code} 
                    onChange={e => handleInputChange('postal_code', e.target.value)} 
                    placeholder="z.B. 8000"
                    required 
                    className={errors.postal_code ? 'border-destructive' : ''} 
                  />
                  {errors.postal_code && <p className="text-sm text-destructive mt-1">{errors.postal_code}</p>}
                  {!errors.postal_code && companyData.country === 'Schweiz' && <p className="text-sm text-muted-foreground mt-1">4 Ziffern, z.B. 8000</p>}
                </div>
                <div>
                  <Label htmlFor="city">
                    Ort <span className="text-foreground">*</span>
                  </Label>
                  <Input 
                    id="city" 
                    value={companyData.city} 
                    onChange={e => handleInputChange('city', e.target.value)} 
                    placeholder="z.B. Zürich"
                    required 
                    className={errors.city ? 'border-destructive' : ''} 
                  />
                  {errors.city && <p className="text-sm text-destructive mt-1">{errors.city}</p>}
                  {!errors.city && <p className="text-sm text-muted-foreground mt-1">Beispiel: Zürich</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="country">
                  Land <span className="text-foreground">*</span>
                </Label>
                <Select value={companyData.country} onValueChange={value => handleSelectChange('country', value)}>
                  <SelectTrigger className={errors.country ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Land auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Schweiz">Schweiz</SelectItem>
                    <SelectItem value="Deutschland">Deutschland</SelectItem>
                    <SelectItem value="Österreich">Österreich</SelectItem>
                    <SelectItem value="Frankreich">Frankreich</SelectItem>
                    <SelectItem value="Italien">Italien</SelectItem>
                    <SelectItem value="Liechtenstein">Liechtenstein</SelectItem>
                    <SelectItem value="Belgien">Belgien</SelectItem>
                    <SelectItem value="Niederlande">Niederlande</SelectItem>
                    <SelectItem value="Luxemburg">Luxemburg</SelectItem>
                    <SelectItem value="Spanien">Spanien</SelectItem>
                    <SelectItem value="Portugal">Portugal</SelectItem>
                    <SelectItem value="Vereinigtes Königreich">Vereinigtes Königreich</SelectItem>
                    <SelectItem value="Polen">Polen</SelectItem>
                    <SelectItem value="Tschechien">Tschechien</SelectItem>
                    <SelectItem value="Slowakei">Slowakei</SelectItem>
                    <SelectItem value="Ungarn">Ungarn</SelectItem>
                    <SelectItem value="Rumänien">Rumänien</SelectItem>
                    <SelectItem value="Bulgarien">Bulgarien</SelectItem>
                    <SelectItem value="Kroatien">Kroatien</SelectItem>
                    <SelectItem value="Slowenien">Slowenien</SelectItem>
                    <SelectItem value="Serbien">Serbien</SelectItem>
                    <SelectItem value="Bosnien und Herzegowina">Bosnien und Herzegowina</SelectItem>
                    <SelectItem value="Nordmazedonien">Nordmazedonien</SelectItem>
                    <SelectItem value="Albanien">Albanien</SelectItem>
                    <SelectItem value="Kosovo">Kosovo</SelectItem>
                    <SelectItem value="Montenegro">Montenegro</SelectItem>
                    <SelectItem value="Griechenland">Griechenland</SelectItem>
                    <SelectItem value="Türkei">Türkei</SelectItem>
                    <SelectItem value="Andere">Andere</SelectItem>
                  </SelectContent>
                </Select>
                {errors.country && <p className="text-sm text-destructive mt-1">{errors.country}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">
                    Telefon <span className="text-foreground">*</span>
                  </Label>
                  <Input 
                    id="phone" 
                    value={companyData.phone} 
                    onChange={e => handleInputChange('phone', e.target.value)} 
                    placeholder="+41 44 123 45 67"
                    required 
                    className={errors.phone ? 'border-destructive' : ''} 
                  />
                  {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                  {!errors.phone && companyData.country === 'Schweiz' && <p className="text-sm text-muted-foreground mt-1">Muss mit +41 beginnen, z.B. +41 44 123 45 67</p>}
                </div>
                <div>
                  <Label htmlFor="email">
                    E-Mail <span className="text-foreground">*</span>
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={companyData.email} 
                    onChange={e => handleInputChange('email', e.target.value)} 
                    placeholder="info@cleanflow.ch"
                    required 
                    className={errors.email ? 'border-destructive' : ''} 
                  />
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                  {!errors.email && <p className="text-sm text-muted-foreground mt-1">Beispiel: info@cleanflow.ch</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input 
                  id="website" 
                  value={companyData.website} 
                  onChange={e => handleInputChange('website', e.target.value)} 
                  placeholder="https://www.cleanflow.ch"
                />
                <p className="text-sm text-muted-foreground mt-1">Beispiel: https://www.cleanflow.ch</p>
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
                <Input 
                  id="vat_number" 
                  value={companyData.vat_number} 
                  onChange={e => handleInputChange('vat_number', e.target.value)} 
                  placeholder="CHE-123.456.789 MWST"
                />
                <p className="text-sm text-muted-foreground mt-1">Beispiel: CHE-123.456.789 MWST</p>
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