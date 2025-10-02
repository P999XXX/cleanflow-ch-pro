import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AddressAutocomplete } from "@/components/ui/address-autocomplete";
import { ContactPersonInput, ContactPerson } from "@/hooks/useContactPersons";
import { useCompanies } from "@/hooks/useCompanies";
import { EmployeeFormStep2 } from "./EmployeeFormStep2";
import { EmployeeFormStep3 } from "./EmployeeFormStep3";
import { FormProgressIndicator } from "./FormProgressIndicator";
import { EmployeeDetailsInput, EmployeeChild } from "@/hooks/useEmployeeDetails";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { contactPersonSchema, ContactPersonFormData } from '@/schemas/contactSchemas';

interface Child {
  first_name: string;
  last_name: string;
  birth_date: string;
}

interface ContactPersonFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (contactPerson: ContactPersonInput, employeeDetails?: EmployeeDetailsInput, children?: Child[]) => void;
  contactPerson?: ContactPerson;
  isLoading?: boolean;
  initialIsEmployee?: boolean;
  onBack?: () => void;
}

export const ContactPersonForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  contactPerson,
  isLoading = false,
  initialIsEmployee = false,
  onBack
}: ContactPersonFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [personType, setPersonType] = useState<'private' | 'employee' | 'person'>(initialIsEmployee ? 'employee' : 'private');
  const [employeeData, setEmployeeData] = useState<Partial<EmployeeDetailsInput>>({});
  const [children, setChildren] = useState<Child[]>([]);
  const [companyId, setCompanyId] = useState('');

  const { data: companies } = useCompanies();

  const {
    register,
    handleSubmit: handleFormSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<ContactPersonFormData>({
    resolver: zodResolver(contactPersonSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      position: '',
      email: '',
      phone: '',
      mobile: '',
      address: '',
      postal_code: '',
      city: '',
      country: 'Schweiz',
      is_primary_contact: false,
      is_employee: initialIsEmployee,
      is_private_customer: !initialIsEmployee,
      notes: '',
      customer_company_id: undefined,
      status: 'aktiv',
    }
  });

  const formData = watch();
  const status = watch('status');

  useEffect(() => {
    if (contactPerson) {
      const isEmp = contactPerson.is_employee || false;
      setPersonType(isEmp ? 'employee' : 'private');
      reset({
        first_name: contactPerson.first_name || '',
        last_name: contactPerson.last_name || '',
        position: contactPerson.position || '',
        email: contactPerson.email || '',
        phone: contactPerson.phone || '',
        mobile: contactPerson.mobile || '',
        address: contactPerson.address || '',
        postal_code: contactPerson.postal_code || '',
        city: contactPerson.city || '',
        country: contactPerson.country || 'Schweiz',
        is_primary_contact: contactPerson.is_primary_contact || false,
        is_employee: isEmp,
        is_private_customer: contactPerson.is_private_customer || false,
        notes: contactPerson.notes || '',
        customer_company_id: contactPerson.customer_company_id,
        status: (contactPerson.status || 'aktiv') as 'aktiv' | 'inaktiv',
      });
      setCompanyId((contactPerson as ContactPerson & { company_id?: string }).company_id || '');
    } else {
      const isEmp = initialIsEmployee;
      setPersonType(isEmp ? 'employee' : 'private');
      reset({
        first_name: '',
        last_name: '',
        position: '',
        email: '',
        phone: '',
        mobile: '',
        address: '',
        postal_code: '',
        city: '',
        country: 'Schweiz',
        is_primary_contact: false,
        is_employee: isEmp,
        is_private_customer: !isEmp,
        notes: '',
        customer_company_id: undefined,
        status: 'aktiv',
      });
      setEmployeeData({});
      setChildren([]);
      setCurrentStep(1);
      
      // Get company ID for new contact
      if (companies && companies.length > 0) {
        setCompanyId(companies[0].id);
      }
    }
  }, [contactPerson, companies, isOpen, initialIsEmployee, reset]);

  const handleSubmitForm = (data: ContactPersonFormData) => {
    const isEmployee = personType === 'employee';
    if (isEmployee && currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return;
    }
    
    const submitData = {
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      position: data.position,
      email: data.email,
      phone: data.phone,
      mobile: data.mobile,
      address: data.address,
      postal_code: data.postal_code,
      city: data.city,
      country: data.country || 'Schweiz',
      is_primary_contact: data.is_primary_contact,
      is_employee: isEmployee,
      is_private_customer: personType === 'private',
      notes: data.notes,
      customer_company_id: data.customer_company_id,
      status: data.status,
    } as ContactPersonInput;
    
    onSubmit(submitData, isEmployee ? employeeData : undefined, isEmployee ? children : undefined);
  };

  const handlePersonTypeChange = (value: string) => {
    const newType = value as 'private' | 'employee' | 'person';
    setPersonType(newType);
    setValue('is_employee', newType === 'employee');
    setValue('is_private_customer', newType === 'private');
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isEmployee = personType === 'employee';
  const totalSteps = isEmployee ? 3 : 1;
  const stepLabels = isEmployee 
    ? ["Basis-Kontakt", "HR-Details", "Kinder"]
    : ["Kontaktdaten"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {onBack && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onBack}
                  className="h-8 w-8"
                  type="button"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              <DialogTitle>
                {contactPerson ? (
                  contactPerson.is_employee ? 'Mitarbeiter bearbeiten' : 'Kontaktperson bearbeiten'
                ) : (
                  'Neue Kontaktperson'
                )}
              </DialogTitle>
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="person-status-toggle" className="text-sm font-medium cursor-pointer">
                {status === 'aktiv' ? 'Aktiv' : 'Inaktiv'}
              </Label>
              <Switch
                id="person-status-toggle"
                checked={status === 'aktiv'}
                onCheckedChange={(checked) => setValue('status', checked ? 'aktiv' : 'inaktiv')}
              />
            </div>
          </div>
        </DialogHeader>

        {isEmployee && (
          <FormProgressIndicator 
            currentStep={currentStep} 
            totalSteps={totalSteps}
            stepLabels={stepLabels}
          />
        )}

        <form onSubmit={handleFormSubmit(handleSubmitForm)} className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              {!contactPerson && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <Label className="text-base font-semibold mb-3 block">
                    Kontakttyp wählen <span className="text-foreground">*</span>
                  </Label>
                  <RadioGroup value={personType} onValueChange={handlePersonTypeChange} className="flex gap-6" required>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="person" id="person" />
                      <Label htmlFor="person" className="font-normal cursor-pointer">Person</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="private" id="privatkunde" />
                      <Label htmlFor="privatkunde" className="font-normal cursor-pointer">Privatkunde</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="employee" id="mitarbeiter" />
                      <Label htmlFor="mitarbeiter" className="font-normal cursor-pointer">Mitarbeiter</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {!isEmployee && personType !== 'private' && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_primary_contact"
                    checked={formData.is_primary_contact}
                    onCheckedChange={(checked) => setValue('is_primary_contact', checked as boolean)}
                  />
                  <Label htmlFor="is_primary_contact" className="cursor-pointer">
                    Primärkontakt
                  </Label>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Vorname *</Label>
                  <Input
                    id="first_name"
                    {...register('first_name')}
                  />
                  {errors.first_name && (
                    <p className="text-sm text-destructive mt-1">{errors.first_name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Nachname *</Label>
                  <Input
                    id="last_name"
                    {...register('last_name')}
                  />
                  {errors.last_name && (
                    <p className="text-sm text-destructive mt-1">{errors.last_name.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  {...register('position')}
                />
                {errors.position && (
                  <p className="text-sm text-destructive mt-1">{errors.position.message}</p>
                )}
              </div>


              {!isEmployee && personType !== 'private' && (
                <div className="space-y-2">
                  <Label htmlFor="customer_company_id">Unternehmen</Label>
                  <Select
                    value={formData.customer_company_id}
                    onValueChange={(value) => setValue('customer_company_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unternehmen wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies?.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile</Label>
                <Input
                  id="mobile"
                  type="tel"
                  {...register('mobile')}
                />
                {errors.mobile && (
                  <p className="text-sm text-destructive mt-1">{errors.mobile.message}</p>
                )}
              </div>

              {/* Address fields for private customers */}
              {personType === 'private' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <AddressAutocomplete
                      value={formData.address || ''}
                      onChange={(value) => setValue('address', value)}
                      onAddressSelect={(address) => {
                        setValue('address', address.street);
                        setValue('postal_code', address.postalCode);
                        setValue('city', address.city);
                        setValue('country', address.country);
                      }}
                      placeholder="Strasse und Hausnummer"
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postal_code">PLZ</Label>
                      <Input
                        id="postal_code"
                        {...register('postal_code')}
                        placeholder="z.B. 8000"
                      />
                      {errors.postal_code && (
                        <p className="text-sm text-destructive mt-1">{errors.postal_code.message}</p>
                      )}
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="city">Ort</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="country">Land</Label>
                    <Input
                      id="country"
                      {...register('country')}
                      placeholder="Schweiz"
                    />
                    {errors.country && (
                      <p className="text-sm text-destructive mt-1">{errors.country.message}</p>
                    )}
                  </div>
                </>
              )}

              <div className="space-y-2">
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
          )}

          {currentStep === 2 && isEmployee && (
            <EmployeeFormStep2 
              employeeData={employeeData}
              onChange={setEmployeeData}
              companyId={companyId}
            />
          )}

          {currentStep === 3 && isEmployee && (
            <EmployeeFormStep3 
              children={children}
              onChange={setChildren}
            />
          )}

          <div className="flex justify-between gap-4 pt-4">
            <div className="flex gap-2">
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
                  isEmployee && currentStep < 3 ? (
                    <>
                      Weiter
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    contactPerson ? 'Aktualisieren' : 'Speichern'
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
