import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CustomerCompany, CustomerCompanyInput } from '@/hooks/useCompanies';
import { companySchema, CompanyFormData } from '@/schemas/contactSchemas';
import { AddressAutocomplete } from '@/components/ui/address-autocomplete';

interface CompanyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (company: CustomerCompanyInput) => void;
  company?: CustomerCompany;
  isLoading?: boolean;
}

export const CompanyForm = ({ isOpen, onClose, onSubmit, company, isLoading }: CompanyFormProps) => {
  const {
    register,
    handleSubmit: handleFormSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
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
      contact_type: 'Unternehmen',
    }
  });

  const contactType = watch('contact_type');
  const companyType = watch('company_type');
  const industryCategory = watch('industry_category');

  useEffect(() => {
    if (company) {
      reset({
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
        status: (company.status || 'aktiv') as 'aktiv' | 'inaktiv' | 'potentiell',
        company_type: company.company_type || '',
        industry_category: company.industry_category || '',
        contact_type: (company.contact_type || 'Unternehmen') as 'Unternehmen' | 'Geschäftskunde',
      });
    } else {
      reset({
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
        contact_type: 'Unternehmen',
      });
    }
  }, [company, reset]);

  const handleSubmitForm = (data: CompanyFormData) => {
    onSubmit(data as CustomerCompanyInput);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {company ? 'Unternehmen bearbeiten' : 'Neues Unternehmen'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleFormSubmit(handleSubmitForm)} className="space-y-4">
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <Label className="text-base font-semibold mb-3 block">
              Kontakttyp wählen <span className="text-destructive">*</span>
            </Label>
            <RadioGroup 
              value={contactType || 'Unternehmen'} 
              onValueChange={(value) => setValue('contact_type', value as 'Unternehmen' | 'Geschäftskunde')}
              className="flex gap-6"
            >
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="name">Firmenname *</Label>
              <Input
                id="name"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="address">Adresse *</Label>
              <AddressAutocomplete
                value={watch("address") || ""}
                onChange={(value) => setValue("address", value)}
                onAddressSelect={(address) => {
                  setValue("address", address.street);
                  setValue("postal_code", address.postalCode);
                  setValue("city", address.city);
                  setValue("country", address.country);
                }}
                placeholder="Strasse und Hausnummer eingeben..."
              />
              {errors.address && (
                <p className="text-sm text-destructive mt-1">{errors.address.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="postal_code">PLZ *</Label>
              <Input
                id="postal_code"
                {...register('postal_code')}
                maxLength={4}
              />
              {errors.postal_code && (
                <p className="text-sm text-destructive mt-1">{errors.postal_code.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="city">Ortschaft *</Label>
              <Input
                id="city"
                {...register('city')}
              />
              {errors.city && (
                <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="country">Land</Label>
              <Input
                id="country"
                {...register('country')}
              />
              {errors.country && (
                <p className="text-sm text-destructive mt-1">{errors.country.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="company_type">Unternehmensart</Label>
              <Select value={companyType} onValueChange={(value) => setValue('company_type', value)}>
                <SelectTrigger className={errors.company_type ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Wählen Sie eine Unternehmensart" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="einzelfirma">Einzelfirma</SelectItem>
                  <SelectItem value="kollektivgesellschaft">Kollektivgesellschaft</SelectItem>
                  <SelectItem value="gmbh">GmbH</SelectItem>
                  <SelectItem value="ag">AG</SelectItem>
                </SelectContent>
              </Select>
              {errors.company_type && (
                <p className="text-sm text-destructive mt-1">{errors.company_type.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="industry_category">Branchenkategorie</Label>
              <Select value={industryCategory} onValueChange={(value) => setValue('industry_category', value)}>
                <SelectTrigger className={errors.industry_category ? 'border-destructive' : ''}>
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
              {errors.industry_category && (
                <p className="text-sm text-destructive mt-1">{errors.industry_category.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Telefon *</Label>
              <Input
                id="phone"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">E-Mail *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                {...register('website')}
                placeholder="https://example.ch"
              />
              {errors.website && (
                <p className="text-sm text-destructive mt-1">{errors.website.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="vat_number">MwSt-Nummer *</Label>
              <Input
                id="vat_number"
                {...register('vat_number')}
              />
              {errors.vat_number && (
                <p className="text-sm text-destructive mt-1">{errors.vat_number.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="notes">Notizen</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                rows={3}
              />
              {errors.notes && (
                <p className="text-sm text-destructive mt-1">{errors.notes.message}</p>
              )}
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