import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ContactPerson, ContactPersonInput } from '@/hooks/useContactPersons';
import { useCompanies } from '@/hooks/useCompanies';

interface ContactPersonFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (contactPerson: ContactPersonInput) => void;
  contactPerson?: ContactPerson;
  isLoading?: boolean;
}

export const ContactPersonForm = ({ isOpen, onClose, onSubmit, contactPerson, isLoading }: ContactPersonFormProps) => {
  const { data: companies } = useCompanies();
  const [formData, setFormData] = useState<ContactPersonInput>({
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
    if (contactPerson) {
      setFormData({
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
    } else {
      setFormData({
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
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {contactPerson ? 'Kontaktperson bearbeiten' : 'Neue Kontaktperson'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">Vorname *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="last_name">Nachname *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="title">Titel</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="department">Abteilung</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="customer_company_id">Unternehmen</Label>
              <Select 
                value={formData.customer_company_id} 
                onValueChange={(value) => setFormData({ ...formData, customer_company_id: value || undefined })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unternehmen auswählen (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Kein Unternehmen</SelectItem>
                  {companies?.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="mobile">Mobil</Label>
              <Input
                id="mobile"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_primary_contact"
                checked={formData.is_primary_contact}
                onCheckedChange={(checked) => setFormData({ ...formData, is_primary_contact: !!checked })}
              />
              <Label htmlFor="is_primary_contact">Primärkontakt</Label>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="notes">Notizen</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Speichere...' : contactPerson ? 'Aktualisieren' : 'Erstellen'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};