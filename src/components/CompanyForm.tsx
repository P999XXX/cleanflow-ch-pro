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
    phone: '',
    email: '',
    website: '',
    taxNumber: '',
    vatNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const { companyData, saveCompany } = useCompanyData();

  useEffect(() => {
    if (companyData) {
      setFormData({
        name: companyData.name,
        address: companyData.address,
        postalCode: companyData.postalCode,
        city: companyData.city,
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
            required={{ name: true }}
          />

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={loading || !formData.name}
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/20"
        onClick={onClose}
      >
        <div 
          className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {formContent}
        </div>
      </div>
    );
  }

  return formContent;
}