import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContactPersonInput } from "@/hooks/useContactPersons";
import { useCompanies } from "@/hooks/useCompanies";
import { EmployeeFormStep2 } from "./EmployeeFormStep2";
import { EmployeeFormStep3 } from "./EmployeeFormStep3";
import { FormProgressIndicator } from "./FormProgressIndicator";
import { EmployeeDetailsInput } from "@/hooks/useEmployeeDetails";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ContactPersonFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (contactPerson: ContactPersonInput, employeeDetails?: EmployeeDetailsInput, children?: any[]) => void;
  contactPerson?: any;
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
  const [formData, setFormData] = useState<ContactPersonInput>({
    first_name: '',
    last_name: '',
    position: '',
    email: '',
    phone: '',
    mobile: '',
    is_primary_contact: false,
    is_employee: initialIsEmployee,
    is_private_customer: !initialIsEmployee,
    notes: '',
    customer_company_id: undefined,
  });
  
  const [employeeData, setEmployeeData] = useState<Partial<EmployeeDetailsInput>>({});
  const [children, setChildren] = useState<any[]>([]);
  const [companyId, setCompanyId] = useState('');

  const { data: companies } = useCompanies();

  useEffect(() => {
    if (contactPerson) {
      const isEmp = contactPerson.is_employee || false;
      setPersonType(isEmp ? 'employee' : 'private');
      setFormData({
        first_name: contactPerson.first_name || '',
        last_name: contactPerson.last_name || '',
        position: contactPerson.position || '',
        email: contactPerson.email || '',
        phone: contactPerson.phone || '',
        mobile: contactPerson.mobile || '',
        is_primary_contact: contactPerson.is_primary_contact || false,
        is_employee: isEmp,
        is_private_customer: contactPerson.is_private_customer || false,
        notes: contactPerson.notes || '',
        customer_company_id: contactPerson.customer_company_id,
      });
      setCompanyId(contactPerson.company_id || '');
    } else {
      const isEmp = initialIsEmployee;
      setPersonType(isEmp ? 'employee' : 'private');
      setFormData({
        first_name: '',
        last_name: '',
        position: '',
        email: '',
        phone: '',
        mobile: '',
        is_primary_contact: false,
        is_employee: isEmp,
        is_private_customer: !isEmp,
        notes: '',
        customer_company_id: undefined,
      });
      setEmployeeData({});
      setChildren([]);
      setCurrentStep(1);
      
      // Get company ID for new contact
      if (companies && companies.length > 0) {
        setCompanyId(companies[0].id);
      }
    }
  }, [contactPerson, companies, isOpen, initialIsEmployee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isEmployee = personType === 'employee';
    if (isEmployee && currentStep < 3) {
      // Move to next step if employee
      setCurrentStep(currentStep + 1);
      return;
    }
    
    const submitData = {
      ...formData,
      is_employee: isEmployee,
      is_private_customer: personType === 'private',
      contact_type: isEmployee ? 'Mitarbeiter' : personType === 'private' ? 'Privatkunde' : 'Person'
    };
    
    onSubmit(submitData, isEmployee ? employeeData : undefined, isEmployee ? children : undefined);
  };

  const handlePersonTypeChange = (value: string) => {
    const newType = value as 'private' | 'employee' | 'person';
    setPersonType(newType);
    setFormData({
      ...formData,
      is_employee: newType === 'employee',
      is_private_customer: newType === 'private',
    });
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
        </DialogHeader>

        {isEmployee && (
          <FormProgressIndicator 
            currentStep={currentStep} 
            totalSteps={totalSteps}
            stepLabels={stepLabels}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              {!contactPerson && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <Label className="text-base font-semibold mb-3 block">Kundentyp</Label>
                  <RadioGroup value={personType} onValueChange={handlePersonTypeChange} className="flex gap-6">
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Vorname *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Nachname *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </div>

              {!isEmployee && (
                <div className="space-y-2">
                  <Label htmlFor="customer_company_id">Unternehmen</Label>
                  <Select
                    value={formData.customer_company_id}
                    onValueChange={(value) => setFormData({ ...formData, customer_company_id: value })}
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
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                />
              </div>

              {!isEmployee && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_primary_contact"
                    checked={formData.is_primary_contact}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_primary_contact: checked as boolean })}
                  />
                  <Label htmlFor="is_primary_contact" className="cursor-pointer">
                    Hauptansprechperson
                  </Label>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Notizen</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
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
