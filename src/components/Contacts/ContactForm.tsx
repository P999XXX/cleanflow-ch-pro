import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

type ContactFormMode = 'company' | 'person';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitCompany: (company: CustomerCompanyInput) => void;
  onSubmitPerson: (person: ContactPersonInput) => void;
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
  const [mode, setMode] = useState<ContactFormMode>(initialMode);

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
  });

  const [personData, setPersonData] = useState<ContactPersonInput>({
    first_name: '',
    last_name: '',
    title: '',
    email: '',
    phone: '',
    mobile: '',
    department: '',
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
      });
    }
  }, [company]);

  useEffect(() => {
    if (contactPerson) {
      setPersonData({
        first_name: contactPerson.first_name,
        last_name: contactPerson.last_name,
        title: contactPerson.title || '',
        email: contactPerson.email || '',
        phone: contactPerson.phone || '',
        mobile: contactPerson.mobile || '',
        department: contactPerson.department || '',
        is_primary_contact: contactPerson.is_primary_contact || false,
        notes: contactPerson.notes || '',
        customer_company_id: contactPerson.customer_company_id || '',
      });
      setMode('person');
    } else {
      setPersonData({
        first_name: '',
        last_name: '',
        title: '',
        email: '',
        phone: '',
        mobile: '',
        department: '',
        is_primary_contact: false,
        notes: '',
        customer_company_id: '',
      });
    }
  }, [contactPerson]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'company') {
      onSubmitCompany(companyData);
    } else {
      onSubmitPerson(personData);
    }
  };

  const getTitle = () => {
    if (company) return 'Unternehmen bearbeiten';
    if (contactPerson) return 'Kontaktperson bearbeiten';
    return mode === 'company' ? 'Neues Unternehmen' : 'Neue Kontaktperson';
  };

  const canSwitchMode = !company && !contactPerson;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>

        {canSwitchMode && (
          <Tabs value={mode} onValueChange={(value) => setMode(value as ContactFormMode)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="company" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">Unternehmen</span>
              </TabsTrigger>
              <TabsTrigger value="person" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Person</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'company' ? (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Firmenname *</Label>
                <Input
                  id="name"
                  value={companyData.name}
                  onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={companyData.address}
                  onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postal_code">PLZ</Label>
                  <Input
                    id="postal_code"
                    value={companyData.postal_code}
                    onChange={(e) => setCompanyData({ ...companyData, postal_code: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="city">Stadt</Label>
                  <Input
                    id="city"
                    value={companyData.city}
                    onChange={(e) => setCompanyData({ ...companyData, city: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="country">Land</Label>
                <Input
                  id="country"
                  value={companyData.country}
                  onChange={(e) => setCompanyData({ ...companyData, country: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={companyData.status} onValueChange={(value) => setCompanyData({ ...companyData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktiv">Aktiv</SelectItem>
                    <SelectItem value="inaktiv">Inaktiv</SelectItem>
                    <SelectItem value="potentiell">Potentieller Kunde</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    value={companyData.phone}
                    onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-Mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={companyData.email}
                    onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={companyData.website}
                    onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="vat_number">MwSt-Nummer</Label>
                  <Input
                    id="vat_number"
                    value={companyData.vat_number}
                    onChange={(e) => setCompanyData({ ...companyData, vat_number: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notizen</Label>
                <Textarea
                  id="notes"
                  value={companyData.notes}
                  onChange={(e) => setCompanyData({ ...companyData, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">Vorname *</Label>
                  <Input
                    id="first_name"
                    value={personData.first_name}
                    onChange={(e) => setPersonData({ ...personData, first_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Nachname *</Label>
                  <Input
                    id="last_name"
                    value={personData.last_name}
                    onChange={(e) => setPersonData({ ...personData, last_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Titel</Label>
                  <Input
                    id="title"
                    value={personData.title}
                    onChange={(e) => setPersonData({ ...personData, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="department">Abteilung</Label>
                  <Input
                    id="department"
                    value={personData.department}
                    onChange={(e) => setPersonData({ ...personData, department: e.target.value })}
                  />
                </div>
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

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Speichere...' : 'Hinzufügen'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};