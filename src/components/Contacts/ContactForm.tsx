import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, User } from 'lucide-react';
import { CustomerCompany, CustomerCompanyInput, useCompanies } from '@/hooks/useCompanies';
import { ContactPerson, ContactPersonInput } from '@/hooks/useContactPersons';
import { useToast } from '@/hooks/use-toast';
import { ContactPersonForm } from './ContactPersonForm';
import { EmployeeDetailsInput } from '@/hooks/useEmployeeDetails';

type ContactFormMode = 'company' | 'person';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitCompany: (company: CustomerCompanyInput) => void;
  onSubmitPerson: (person: ContactPersonInput, employeeDetails?: EmployeeDetailsInput, children?: any[]) => void;
  company?: CustomerCompany;
  contactPerson?: ContactPerson;
  isLoading?: boolean;
  initialMode?: ContactFormMode;
}

export const ContactForm = ({ 
  isOpen, 
  onClose, 
  onSubmitCompany, 
  onSubmitPerson, 
  company, 
  contactPerson, 
  isLoading,
  initialMode = 'company'
}: ContactFormProps) => {
  const { data: companies } = useCompanies();
  const { toast } = useToast();
  const [mode, setMode] = useState<ContactFormMode>(initialMode);
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
    contact_type: '',
  });

  const [personData, setPersonData] = useState<ContactPersonInput>({
    first_name: '',
    last_name: '',
    position: '',
    email: '',
    phone: '',
    mobile: '',
    is_primary_contact: false,
    notes: '',
    customer_company_id: '',
  });

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

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
        contact_type: company.contact_type || '',
      });
      setMode('company');
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
        contact_type: '',
      });
    }
  }, [company]);

  useEffect(() => {
    if (contactPerson) {
      setPersonData({
        first_name: contactPerson.first_name,
        last_name: contactPerson.last_name,
        position: contactPerson.position || '',
        email: contactPerson.email || '',
        phone: contactPerson.phone || '',
        mobile: contactPerson.mobile || '',
        is_primary_contact: contactPerson.is_primary_contact || false,
        notes: contactPerson.notes || '',
        customer_company_id: contactPerson.customer_company_id || '',
      });
      setMode('person');
    } else {
      setPersonData({
        first_name: '',
        last_name: '',
        position: '',
        email: '',
        phone: '',
        mobile: '',
        is_primary_contact: false,
        notes: '',
        customer_company_id: '',
      });
    }
  }, [contactPerson]);

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

    // Required fields from the form
    if (!companyData.company_type.trim()) {
      newErrors.company_type = 'Gesellschaftsart ist erforderlich';
    }

    if (!companyData.industry_category.trim()) {
      newErrors.industry_category = 'Branche ist erforderlich';
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

  const validatePersonForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!personData.first_name.trim()) {
      newErrors.first_name = 'Vorname ist erforderlich';
    }

    if (!personData.last_name.trim()) {
      newErrors.last_name = 'Nachname ist erforderlich';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    if (mode === 'company') {
      setCompanyData({ ...companyData, [field]: value });
    } else {
      setPersonData({ ...personData, [field]: value });
    }
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleSelectChange = (field: string, value: string) => {
    setCompanyData({ ...companyData, [field]: value });
    
    // Clear field error when user selects a value
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let isValid = false;
    if (mode === 'company') {
      isValid = validateCompanyForm();
      if (isValid) {
        onSubmitCompany(companyData);
      }
    } else {
      isValid = validatePersonForm();
      if (isValid) {
        onSubmitPerson(personData);
      }
    }

    if (!isValid) {
      toast({
        title: 'Validierungsfehler',
        description: 'Bitte korrigieren Sie die markierten Felder',
        variant: 'destructive',
      });
    }
  };

  const getTitle = () => {
    if (company) return 'Unternehmen bearbeiten';
    if (contactPerson) return 'Kontaktperson bearbeiten';
    return mode === 'company' ? 'Neues Unternehmen' : 'Neue Kontaktperson';
  };

  const canSwitchMode = !company && !contactPerson;

  // Use ContactPersonForm for person mode
  if (mode === 'person') {
    return (
      <ContactPersonForm
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmitPerson}
        contactPerson={contactPerson}
        isLoading={isLoading}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {company ? 'Bearbeiten Sie die Unternehmensdaten' : 'Fügen Sie ein neues Unternehmen hinzu'}
          </DialogDescription>
        </DialogHeader>

        {canSwitchMode && (
          <Tabs value={mode} onValueChange={(value) => setMode(value as ContactFormMode)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-16">
              <TabsTrigger value="company" className="flex flex-col items-center gap-1 h-full">
                <Building2 className="h-4 w-4" />
                <span className="text-xs">Unternehmen</span>
              </TabsTrigger>
              <TabsTrigger value="person" className="flex flex-col items-center gap-1 h-full">
                <User className="h-4 w-4" />
                <span className="text-xs">Person</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'company' ? (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">
                  Firmenname <span className="text-foreground">*</span>
                </Label>
                <Input
                  id="name"
                  value={companyData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="address">
                  Adresse <span className="text-foreground">*</span>
                </Label>
                <Input
                  id="address"
                  value={companyData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
                  className={errors.address ? 'border-destructive' : ''}
                />
                {errors.address && <p className="text-sm text-destructive mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postal_code">
                    PLZ <span className="text-foreground">*</span>
                  </Label>
                  <Input
                    id="postal_code"
                    value={companyData.postal_code}
                    onChange={(e) => handleInputChange('postal_code', e.target.value)}
                    required
                    className={errors.postal_code ? 'border-destructive' : ''}
                  />
                  {errors.postal_code && <p className="text-sm text-destructive mt-1">{errors.postal_code}</p>}
                </div>
                <div>
                  <Label htmlFor="city">
                    Ort <span className="text-foreground">*</span>
                  </Label>
                  <Input
                    id="city"
                    value={companyData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                    className={errors.city ? 'border-destructive' : ''}
                  />
                  {errors.city && <p className="text-sm text-destructive mt-1">{errors.city}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="country">
                  Land <span className="text-foreground">*</span>
                </Label>
                <Input
                  id="country"
                  value={companyData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  required
                  className={errors.country ? 'border-destructive' : ''}
                />
                {errors.country && <p className="text-sm text-destructive mt-1">{errors.country}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company_type">
                    Gesellschaftsart <span className="text-foreground">*</span>
                  </Label>
                  <Select 
                    value={companyData.company_type} 
                    onValueChange={(value) => handleSelectChange('company_type', value)}
                  >
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
                    Branche <span className="text-foreground">*</span>
                  </Label>
                  <Select 
                    value={companyData.industry_category} 
                    onValueChange={(value) => handleSelectChange('industry_category', value)}
                  >
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_type">
                    Kontaktart <span className="text-foreground">*</span>
                  </Label>
                  <Select 
                    value={companyData.contact_type} 
                    onValueChange={(value) => handleSelectChange('contact_type', value)}
                  >
                    <SelectTrigger className={errors.contact_type ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Kontaktart auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kunde">Kunde</SelectItem>
                      <SelectItem value="Lieferant">Lieferant</SelectItem>
                      <SelectItem value="Dienstleister">Dienstleister</SelectItem>
                      <SelectItem value="Amtlich">Amtlich</SelectItem>
                      <SelectItem value="Sonstige">Sonstige</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.contact_type && <p className="text-sm text-destructive mt-1">{errors.contact_type}</p>}
                </div>
                <div>
                  <Label htmlFor="status">
                    Status <span className="text-foreground">*</span>
                  </Label>
                  <Select 
                    value={companyData.status} 
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger className={errors.status ? 'border-destructive' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aktiv">Aktiv</SelectItem>
                      <SelectItem value="inaktiv">Inaktiv</SelectItem>
                      <SelectItem value="potentiell">Potentieller Kunde</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && <p className="text-sm text-destructive mt-1">{errors.status}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">
                    Telefon <span className="text-foreground">*</span>
                  </Label>
                  <Input
                    id="phone"
                    value={companyData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                    className={errors.phone ? 'border-destructive' : ''}
                  />
                  {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <Label htmlFor="email">
                    E-Mail <span className="text-foreground">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={companyData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={companyData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="vat_number">MwSt-Nummer</Label>
                    <Input
                      id="vat_number"
                      value={companyData.vat_number}
                      onChange={(e) => handleInputChange('vat_number', e.target.value)}
                    />
                  </div>
              </div>

              <div>
                <Label htmlFor="notes">Notizen</Label>
                <Textarea
                  id="notes"
                  value={companyData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">
                    Vorname <span className="text-foreground">*</span>
                  </Label>
                  <Input
                    id="first_name"
                    value={personData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    required
                    className={errors.first_name ? 'border-destructive' : ''}
                  />
                  {errors.first_name && <p className="text-sm text-destructive mt-1">{errors.first_name}</p>}
                </div>
                <div>
                  <Label htmlFor="last_name">
                    Nachname <span className="text-foreground">*</span>
                  </Label>
                  <Input
                    id="last_name"
                    value={personData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    required
                    className={errors.last_name ? 'border-destructive' : ''}
                  />
                  {errors.last_name && <p className="text-sm text-destructive mt-1">{errors.last_name}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={personData.position}
                  onChange={(e) => setPersonData({ ...personData, position: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="customer_company_id">Unternehmen</Label>
                <Select 
                  value={personData.customer_company_id || "none"} 
                  onValueChange={(value) => setPersonData({ ...personData, customer_company_id: value === "none" ? undefined : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unternehmen auswählen (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Kein Unternehmen</SelectItem>
                    {companies?.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="email_person">E-Mail</Label>
                <Input
                  id="email_person"
                  type="email"
                  value={personData.email}
                  onChange={(e) => setPersonData({ ...personData, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone_person">Telefon</Label>
                  <Input
                    id="phone_person"
                    value={personData.phone}
                    onChange={(e) => setPersonData({ ...personData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="mobile">Mobil</Label>
                  <Input
                    id="mobile"
                    value={personData.mobile}
                    onChange={(e) => setPersonData({ ...personData, mobile: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_primary_contact"
                  checked={personData.is_primary_contact}
                  onCheckedChange={(checked) => setPersonData({ ...personData, is_primary_contact: !!checked })}
                />
                <Label htmlFor="is_primary_contact">Primärkontakt</Label>
              </div>

              <div>
                <Label htmlFor="notes_person">Notizen</Label>
                <Textarea
                  id="notes_person"
                  value={personData.notes}
                  onChange={(e) => setPersonData({ ...personData, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col items-center gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Speichere...' : 'Speichern'}
            </Button>
            <button 
              type="button" 
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Abbrechen
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};