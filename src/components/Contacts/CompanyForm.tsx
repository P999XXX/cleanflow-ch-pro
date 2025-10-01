import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
    company_type: '',
    industry_category: '',
    is_customer: true,
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
        company_type: company.company_type || '',
        industry_category: company.industry_category || '',
        is_customer: company.is_customer ?? true,
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
        company_type: '',
        industry_category: '',
        is_customer: true,
      });
    }
  }, [company]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {company ? 'Unternehmen bearbeiten' : 'Neues Unternehmen'}
          </DialogTitle>
          <DialogDescription>
            {company ? 'Bearbeiten Sie die Unternehmensdaten' : 'Fügen Sie ein neues Unternehmen hinzu'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Ist Kunde Checkbox ganz oben */}
          <div className="flex items-center space-x-2 pb-2 border-b">
            <Checkbox
              id="is_customer"
              checked={formData.is_customer}
              onCheckedChange={(checked) => setFormData({ ...formData, is_customer: checked as boolean })}
            />
            <Label htmlFor="is_customer" className="cursor-pointer font-medium">
              Ist Kunde
            </Label>
          </div>

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
              <Label htmlFor="address">Adresse *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="postal_code">PLZ *</Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="city">Ortschaft *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
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
              <Label htmlFor="company_type">Unternehmensart</Label>
              <Select value={formData.company_type} onValueChange={(value) => setFormData({ ...formData, company_type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Wählen Sie eine Unternehmensart" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="einzelfirma">Einzelfirma</SelectItem>
                  <SelectItem value="kollektivgesellschaft">Kollektivgesellschaft</SelectItem>
                  <SelectItem value="gmbh">GmbH</SelectItem>
                  <SelectItem value="ag">AG</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="industry_category">Branchenkategorie</Label>
              <Select value={formData.industry_category} onValueChange={(value) => setFormData({ ...formData, industry_category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Wählen Sie eine Branche" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  <SelectItem value="landwirtschaft">Land- und Forstwirtschaft</SelectItem>
                  <SelectItem value="bergbau">Bergbau und Gewinnung von Steinen und Erden</SelectItem>
                  <SelectItem value="verarbeitendes-gewerbe">Verarbeitendes Gewerbe</SelectItem>
                  <SelectItem value="energie">Energieversorgung</SelectItem>
                  <SelectItem value="wasser">Wasserversorgung; Abwasser- und Abfallentsorgung</SelectItem>
                  <SelectItem value="bau">Baugewerbe</SelectItem>
                  <SelectItem value="handel">Handel; Instandhaltung und Reparatur von Kraftfahrzeugen</SelectItem>
                  <SelectItem value="verkehr">Verkehr und Lagerei</SelectItem>
                  <SelectItem value="gastgewerbe">Gastgewerbe</SelectItem>
                  <SelectItem value="information">Information und Kommunikation</SelectItem>
                  <SelectItem value="finanz">Erbringung von Finanz- und Versicherungsdienstleistungen</SelectItem>
                  <SelectItem value="immobilien">Grundstücks- und Wohnungswesen</SelectItem>
                  <SelectItem value="freiberuflich">Erbringung von freiberuflichen, wissenschaftlichen und technischen Dienstleistungen</SelectItem>
                  <SelectItem value="verwaltung">Erbringung von sonstigen wirtschaftlichen Dienstleistungen</SelectItem>
                  <SelectItem value="oeffentlich">Öffentliche Verwaltung, Verteidigung; Sozialversicherung</SelectItem>
                  <SelectItem value="erziehung">Erziehung und Unterricht</SelectItem>
                  <SelectItem value="gesundheit">Gesundheits- und Sozialwesen</SelectItem>
                  <SelectItem value="kunst">Kunst, Unterhaltung und Erholung</SelectItem>
                  <SelectItem value="sonstige">Erbringung von sonstigen Dienstleistungen</SelectItem>
                  <SelectItem value="haushalt">Private Haushalte mit Hauspersonal</SelectItem>
                  <SelectItem value="reinigung">Gebäudereinigung</SelectItem>
                  <SelectItem value="sicherheit">Wach- und Sicherheitsdienste</SelectItem>
                  <SelectItem value="gartenbau">Garten- und Landschaftsbau</SelectItem>
                  <SelectItem value="catering">Catering und Eventgastronomie</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="phone">Telefon *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">E-Mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
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
              <Label htmlFor="vat_number">MwSt-Nummer *</Label>
              <Input
                id="vat_number"
                value={formData.vat_number}
                onChange={(e) => setFormData({ ...formData, vat_number: e.target.value })}
                required
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

          <div className="flex flex-col items-center gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Speichere...' : company ? 'Speichern' : 'Speichern'}
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