import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatIBAN, formatAHV, validateIBANChecksum } from '@/schemas/employeeSchemas';

interface ValidatedInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'iban' | 'ahv' | 'text';
  placeholder?: string;
  required?: boolean;
  error?: string;
}

export const ValidatedInput = ({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  error,
}: ValidatedInputProps) => {
  const [validationState, setValidationState] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    if (!value) {
      setValidationState('idle');
      setValidationMessage('');
      return;
    }

    if (type === 'iban') {
      const cleaned = value.replace(/\s/g, '');
      const ibanRegex = /^CH[0-9]{19}$/;
      
      if (!ibanRegex.test(cleaned)) {
        setValidationState('invalid');
        setValidationMessage('Ungültiges Format (CH + 19 Ziffern)');
      } else if (!validateIBANChecksum(value)) {
        setValidationState('invalid');
        setValidationMessage('Ungültige IBAN-Prüfsumme');
      } else {
        setValidationState('valid');
        setValidationMessage('Gültige IBAN');
      }
    } else if (type === 'ahv') {
      const ahvRegex = /^756\.[0-9]{4}\.[0-9]{4}\.[0-9]{2}$/;
      
      if (!ahvRegex.test(value)) {
        setValidationState('invalid');
        setValidationMessage('Ungültiges Format (756.XXXX.XXXX.XX)');
      } else {
        setValidationState('valid');
        setValidationMessage('Gültige AHV-Nummer');
      }
    }
  }, [value, type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Auto-format based on type
    if (type === 'iban' && newValue) {
      newValue = formatIBAN(newValue);
    } else if (type === 'ahv' && newValue) {
      newValue = formatAHV(newValue);
    }

    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="relative">
        <Input
          id={id}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={
            validationState === 'valid'
              ? 'pr-10 border-success focus:ring-success'
              : validationState === 'invalid'
              ? 'pr-10 border-destructive focus:ring-destructive'
              : ''
          }
        />
        {validationState !== 'idle' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {validationState === 'valid' ? (
              <CheckCircle2 className="h-4 w-4 text-success" />
            ) : (
              <AlertCircle className="h-4 w-4 text-destructive" />
            )}
          </div>
        )}
      </div>
      {validationMessage && (
        <p
          className={`text-xs ${
            validationState === 'valid' ? 'text-success' : 'text-destructive'
          }`}
        >
          {validationMessage}
        </p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};
