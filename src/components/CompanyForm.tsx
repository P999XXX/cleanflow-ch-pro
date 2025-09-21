import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompanyFormFields } from '@/components/CompanyFormFields';
import { useCompanyData } from '@/hooks/useCompanyData';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompanyFormProps {
  onSuccess?: () => void;
  isModal?: boolean;
  onClose?: () => void;
  title?: string;
}

export default function CompanyForm({ 
  onSuccess, 
  isModal = false, 
  onClose,
  title = "Firmendaten bearbeiten"
}: CompanyFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    postalCode: '',
    city: '',
    country: 'Schweiz',
    phone: '',
    email: '',
    website: '',
    taxNumber: '',
    vatNumber: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const { companyData, saveCompany } = useCompanyData();

  useEffect(() => {
    if (companyData) {
      setFormData({
        name: companyData.name,
        address: companyData.address,
        postalCode: companyData.postalCode,
        city: companyData.city,
        country: companyData.country || 'Schweiz',
        phone: companyData.phone,
        email: companyData.email,
        website: companyData.website,
        taxNumber: companyData.taxNumber,
        vatNumber: companyData.vatNumber,
      });
    }
  }, [companyData]);

  useEffect(() => {
    if (isModal) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && onClose) {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isModal, onClose]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Validate required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Firmenname ist erforderlich';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Adresse ist erforderlich';
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'PLZ ist erforderlich';
    } else if (!/^[0-9]{4}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'PLZ muss aus 4 Ziffern bestehen';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'Ort ist erforderlich';
    }
    if (!formData.country.trim()) {
      newErrors.country = 'Land ist erforderlich';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon ist erforderlich';
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Bitte geben Sie eine gültige Telefonnummer ein';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    const success = await saveCompany(formData);
    
    if (success) {
      if (onSuccess) {
        onSuccess();
      } else if (onClose) {
        onClose();
      }
    }
    
    setLoading(false);
  };

  const formContent = (
    <Card className={cn(isModal ? "" : "w-full max-w-2xl")}>
      <CardHeader className="space-y-1">
        {isModal && (
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-foreground">
              {title}
            </CardTitle>
            <button
              onClick={onClose}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Schließen</span>
            </button>
          </div>
        )}
        {!isModal && (
          <CardTitle className="text-xl font-bold text-foreground">
            Firmendaten
          </CardTitle>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <CompanyFormFields 
            formData={formData}
            onChange={handleInputChange}
            errors={errors}
            required={{ 
              name: true, 
              address: true, 
              postalCode: true, 
              city: true, 
              country: true, 
              phone: true, 
              email: true 
            }}
          />

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Speichern...' : 'Speichern'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  if (isModal) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-white/30"
        onClick={onClose}
      >
        <div 
          className="relative bg-background rounded-xl shadow-2xl max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto border border-border/20"
          onClick={(e) => e.stopPropagation()}
        >
          {formContent}
        </div>
      </div>
    );
  }

  return formContent;
}