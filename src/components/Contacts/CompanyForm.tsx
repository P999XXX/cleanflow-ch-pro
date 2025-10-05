import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CustomerCompany, CustomerCompanyInput } from '@/hooks/useCompanies';
import { companySchema, CompanyFormData } from '@/schemas/contactSchemas';
import { useDuplicateCheck } from '@/hooks/useDuplicateCheck';
import { useSwissPostalCodes } from '@/hooks/useSwissPostalCodes';
import { FormProgressIndicator } from './FormProgressIndicator';
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

interface CompanyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (company: CustomerCompanyInput) => void;
  company?: CustomerCompany;
  isLoading?: boolean;
}

export const CompanyForm = ({ isOpen, onClose, onSubmit, company, isLoading }: CompanyFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  
  const { checkCompanyDuplicate } = useDuplicateCheck();
  const { autoFillCity, getPostalCodeSuggestions } = useSwissPostalCodes();

  const {
    register,
    handleSubmit: handleFormSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
    trigger,
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
  const companyName = watch('name');
  const postalCode = watch('postal_code');
  
  const debouncedName = useDebounce(companyName, 500);
  const debouncedPostalCode = useDebounce(postalCode, 300);

  // Check for duplicates when name changes
  useEffect(() => {
    if (!company && debouncedName && debouncedName.trim().length >= 3) {
      const result = checkCompanyDuplicate(debouncedName);
      if (result.isDuplicate) {
        const topMatch = result.duplicates[0];
        setDuplicateWarning(
          `Ähnlicher Eintrag gefunden: "${topMatch.name}" (${Math.round(topMatch.similarity * 100)}% Übereinstimmung)`
        );
      } else {
        setDuplicateWarning(null);
      }
    } else {
      setDuplicateWarning(null);
    }
  }, [debouncedName, company, checkCompanyDuplicate]);

  // Auto-fill city based on postal code
  useEffect(() => {
    if (debouncedPostalCode && debouncedPostalCode.length === 4) {
      const city = autoFillCity(debouncedPostalCode);
      if (city) {
        setValue('city', city);
      }
    }
  }, [debouncedPostalCode, autoFillCity, setValue]);

  useEffect(() => {
    if (company) {
      setCurrentStep(1);
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
      setCurrentStep(1);
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
  }, [company, reset, isOpen]);

  const handleSubmitForm = async (data: CompanyFormData) => {
    // Multi-step validation
    if (currentStep === 1) {
      const isValid = await trigger(['name', 'contact_type']);
      if (isValid) {
        setCurrentStep(2);
      }
      return;
    }
    
    if (currentStep === 2) {
      const isValid = await trigger(['address', 'postal_code', 'city', 'phone', 'email']);
      if (isValid) {
        setCurrentStep(3);
      }
      return;
    }
    
    // Step 3: Final submission
    onSubmit(data as CustomerCompanyInput);
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const totalSteps = 3;
  const stepLabels = ['Grunddaten', 'Kontaktdaten', 'Zusatzinformationen'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {company ? 'Unternehmen bearbeiten' : 'Neues Unternehmen'}
          </DialogTitle>
        </DialogHeader>

        <FormProgressIndicator 
          currentStep={currentStep} 
          totalSteps={totalSteps}
          stepLabels={stepLabels}
        />

        <form onSubmit={handleFormSubmit(handleSubmitForm)} className="space-y-6">
          {/* Step 1: Grunddaten */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
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

              <div>
                <Label htmlFor="name">Firmenname *</Label>
                <Input
                  id="name"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                )}
                {duplicateWarning && (
                  <Alert variant="default" className="mt-2 border-warning/50 bg-warning/10">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <AlertDescription className="text-warning">
                      {duplicateWarning}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Kontaktdaten */}
          {currentStep === 2 && (
            <div className="space-y-4">

              <div>
                <Label htmlFor="address">Adresse *</Label>
                <Input
                  id="address"
                  {...register('address')}
                  placeholder="Strasse und Hausnummer"
                />
                {errors.address && (
                  <p className="text-sm text-destructive mt-1">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="postal_code">PLZ *</Label>
                  <Input
                    id="postal_code"
                    {...register('postal_code')}
                    maxLength={4}
                    placeholder="8000"
                  />
                  {errors.postal_code && (
                    <p className="text-sm text-destructive mt-1">{errors.postal_code.message}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <Label htmlFor="city">Ortschaft *</Label>
                  <Input
                    id="city"
                    {...register('city')}
                    placeholder="z.B. Zürich"
                  />
                  {errors.city && (
                    <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Telefon *</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="+41 44 123 45 67"
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
            </div>
          )}

          {/* Step 3: Zusatzinformationen */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="vat_number">MwSt-Nummer *</Label>
                <Input
                  id="vat_number"
                  {...register('vat_number')}
                  placeholder="CHE-123.456.789 MWST"
                />
                {errors.vat_number && (
                  <p className="text-sm text-destructive mt-1">{errors.vat_number.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company_type">Gesellschaftsart</Label>
                  <Select value={companyType} onValueChange={(value) => setValue('company_type', value)}>
                    <SelectTrigger className={errors.company_type ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Wählen Sie eine Gesellschaftsart" />
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
                  <Label htmlFor="industry_category">Branche</Label>
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
              </div>

              <div>
                <Label htmlFor="notes">Notizen</Label>
                <Textarea
                  id="notes"
                  {...register('notes')}
                  rows={4}
                  placeholder="Zusätzliche Informationen..."
                />
                {errors.notes && (
                  <p className="text-sm text-destructive mt-1">{errors.notes.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-between gap-4 pt-4 border-t">
            <div>
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={handlePrevious}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Zurück
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Abbrechen
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Lädt...' : (
                  currentStep < totalSteps ? (
                    <>
                      Weiter
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    company ? 'Speichern' : 'Erstellen'
                  )
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};