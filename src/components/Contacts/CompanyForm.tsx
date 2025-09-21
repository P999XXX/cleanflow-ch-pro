import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CustomerCompany, CustomerCompanyInput } from '@/hooks/useCompanies';

interface CompanyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (company: CustomerCompanyInput) => void;
  company?: CustomerCompany;
  isLoading?: boolean;
}

export const CompanyForm = ({ isOpen, onClose, onSubmit, company, isLoading }: CompanyFormProps) => {
  const [formData, setFormData] = useState<CustomerCompanyInput>({
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

  useEffect(() => {
    if (company) {
      setFormData({
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
    } else {
      setFormData({
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {company ? 'Unternehmen bearbeiten' : 'Neues Unternehmen'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="name">Firmenname *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="postal_code">PLZ</Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="city">Stadt</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="country">Land</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
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

            <div>
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
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
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="vat_number">MwSt-Nummer</Label>
              <Input
                id="vat_number"
                value={formData.vat_number}
                onChange={(e) => setFormData({ ...formData, vat_number: e.target.value })}
              />
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
              {isLoading ? 'Speichere...' : company ? 'Aktualisieren' : 'Erstellen'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};