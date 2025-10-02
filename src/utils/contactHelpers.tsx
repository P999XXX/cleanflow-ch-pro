import { Badge } from "@/components/ui/badge";

/**
 * Helper function to get company type abbreviation
 */
export function getCompanyTypeAbbreviation(companyType: string): string {
  const abbreviations: Record<string, string> = {
    'GmbH': 'GmbH',
    'AG': 'AG',
    'Einzelunternehmen': 'EU',
    'Personengesellschaft': 'PG',
    'Kapitalgesellschaft': 'KG',
    'Genossenschaft': 'eG',
    'Stiftung': 'Stift.',
    'Verein': 'e.V.',
    'Kommanditgesellschaft': 'KG',
    'Offene Handelsgesellschaft': 'OHG',
    'Gesellschaft bürgerlichen Rechts': 'GbR',
    'Limited': 'Ltd.',
    'Unternehmergesellschaft': 'UG'
  };
  
  if (abbreviations[companyType]) {
    return abbreviations[companyType];
  }
  
  for (const [fullName, abbrev] of Object.entries(abbreviations)) {
    if (companyType.toLowerCase().includes(fullName.toLowerCase())) {
      return abbrev;
    }
  }
  
  return companyType.length > 3 ? companyType.substring(0, 3) + '.' : companyType;
}

/**
 * Helper function to get status badge component
 */
export function getStatusBadge(status: string): JSX.Element {
  const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline'; className: string }> = {
    aktiv: { 
      label: 'Aktiv', 
      variant: 'default',
      className: 'bg-success/10 text-success border-success/20'
    },
    inaktiv: { 
      label: 'Inaktiv', 
      variant: 'secondary',
      className: 'bg-muted text-muted-foreground border-muted'
    },
    potentiell: { 
      label: 'Potentiell', 
      variant: 'outline',
      className: 'bg-primary/10 text-primary border-primary/20'
    },
  };
  
  const config = statusConfig[status] || statusConfig.aktiv;
  
  return (
    <Badge 
      variant={config.variant} 
      className={`${config.className} font-medium border`}
    >
      {config.label}
    </Badge>
  );
}

/**
 * Helper function to format address for display
 */
export function formatAddress(address?: string, postalCode?: string, city?: string, country?: string): string {
  const parts = [address, postalCode, city, country].filter(Boolean);
  return parts.join(', ');
}

/**
 * Helper function to format phone numbers for international use
 */
export function formatPhoneForWhatsApp(phone: string): string {
  // Remove all non-digit characters and replace leading 0 with 41 for Switzerland
  return phone.replace(/[^\d]/g, '').replace(/^0/, '41');
}

/**
 * Helper function to validate Swiss postal code
 */
export function isValidSwissPostalCode(postalCode: string): boolean {
  return /^\d{4}$/.test(postalCode);
}

/**
 * Helper function to validate Swiss phone number
 */
export function isValidSwissPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/[\s\-\/()]/g, '');
  return /^(\+41|0)[0-9]{8,}$/.test(cleanPhone);
}

/**
 * Helper function to validate email
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Available contact types for filtering - unified system
 */
export const AVAILABLE_CONTACT_TYPES = [
  'Unternehmen', 
  'Geschäftskunde', 
  'Privatkunde', 
  'Mitarbeiter', 
  'Person'
];

/**
 * Contact type for the contact type selector
 */
export type ContactTypeSelectorType = string;