import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building, MapPin, Phone, Mail, Globe, Hash } from 'lucide-react';

interface CompanyData {
  name: string;
  address: string;
  postalCode: string;
  city: string;
  country?: string;
  phone: string;
  email: string;
  website: string;
  taxNumber: string;
  vatNumber: string;
}

interface CompanyFormFieldsProps {
  formData: CompanyData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: {
    address?: string;
    postalCode?: string;
    city?: string;
    phone?: string;
    email?: string;
  };
  required?: {
    name?: boolean;
    address?: boolean;
    postalCode?: boolean;
    city?: boolean;
    phone?: boolean;
    email?: boolean;
  };
}

export function CompanyFormFields({ 
  formData, 
  onChange,
  errors = {},
  required = { 
    name: true, 
    address: true, 
    postalCode: true, 
    city: true, 
    phone: true, 
    email: true
  }
}: CompanyFormFieldsProps) {

  return (
    <div className="space-y-6">
      {/* Firmenname */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Firmenname {required.name && <span className="text-muted-foreground">*</span>}
        </Label>
        <div className="relative">
          <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="name"
            name="name"
            placeholder="cleanflow Reinigungsservice GmbH"
            value={formData.name}
            onChange={onChange}
            className="pl-9"
            required={required.name}
          />
        </div>
      </div>

      {/* Adresse */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="address">
            Adresse {required.address && <span className="text-muted-foreground">*</span>}
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="address"
              name="address"
              placeholder="Musterstrasse 123"
              value={formData.address}
              onChange={onChange}
              className={`pl-9 ${errors.address ? "border-destructive" : ""}`}
              required={required.address}
            />
          </div>
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode">
            PLZ {required.postalCode && <span className="text-muted-foreground">*</span>}
          </Label>
          <Input
            id="postalCode"
            name="postalCode"
            placeholder="8000"
            value={formData.postalCode}
            onChange={onChange}
            required={required.postalCode}
            pattern="[0-9]{4}"
            className={errors.postalCode ? "border-destructive" : ""}
          />
          {errors.postalCode && (
            <p className="text-sm text-destructive">{errors.postalCode}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">
          Ort {required.city && <span className="text-muted-foreground">*</span>}
        </Label>
        <Input
          id="city"
          name="city"
          placeholder="Zürich"
          value={formData.city}
          onChange={onChange}
          required={required.city}
          className={errors.city ? "border-destructive" : ""}
        />
        {errors.city && (
          <p className="text-sm text-destructive">{errors.city}</p>
        )}
      </div>

      {/* Kontaktdaten */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">
            Telefon {required.phone && <span className="text-muted-foreground">*</span>}
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+41 44 123 45 67"
              value={formData.phone}
              onChange={onChange}
              className={`pl-9 ${errors.phone ? "border-destructive" : ""}`}
              required={required.phone}
              pattern="^\+?[1-9]\d{1,14}$"
            />
          </div>
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">
            E-Mail {required.email && <span className="text-muted-foreground">*</span>}
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="info@cleanflow.ai"
              value={formData.email}
              onChange={onChange}
              className={`pl-9 ${errors.email ? "border-destructive" : ""}`}
              required={required.email}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website (optional)</Label>
        <div className="relative">
          <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="website"
            name="website"
            type="url"
            placeholder="https://www.cleanflow.ai"
            value={formData.website}
            onChange={onChange}
            className="pl-9"
          />
        </div>
      </div>

      {/* Steuernummern */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="taxNumber">Steuernummer (optional)</Label>
          <div className="relative">
            <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="taxNumber"
              name="taxNumber"
              placeholder="CHE-123.456.789"
              value={formData.taxNumber}
              onChange={onChange}
              className="pl-9"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="vatNumber">MWST-Nummer (optional)</Label>
          <div className="relative">
            <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="vatNumber"
              name="vatNumber"
              placeholder="CHE-123.456.789 MWST"
              value={formData.vatNumber}
              onChange={onChange}
              className="pl-9"
            />
          </div>
        </div>
      </div>
    </div>
  );
}