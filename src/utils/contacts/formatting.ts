import { CustomerCompany, ContactPerson } from "@/types/contacts";

/**
 * Formats a complete address string
 */
export const formatAddress = (
  address?: string,
  postalCode?: string,
  city?: string,
  country?: string
): string => {
  const parts = [address, postalCode && city ? `${postalCode} ${city}` : postalCode || city, country];
  return parts.filter(Boolean).join(", ");
};

/**
 * Gets abbreviated company type
 */
export const getCompanyTypeAbbreviation = (type?: string): string => {
  const typeMap: { [key: string]: string } = {
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
  
  if (!type) return "";
  
  if (typeMap[type]) {
    return typeMap[type];
  }
  
  for (const [fullName, abbrev] of Object.entries(typeMap)) {
    if (type.toLowerCase().includes(fullName.toLowerCase())) {
      return abbrev;
    }
  }
  
  return type.length > 3 ? type.substring(0, 3) + '.' : type;
};

/**
 * Gets full name of a contact person
 */
export const getContactPersonFullName = (person: ContactPerson): string => {
  return `${person.first_name} ${person.last_name}`.trim();
};

/**
 * Gets display name for a contact (company or person)
 */
export const getContactDisplayName = (contact: CustomerCompany | ContactPerson): string => {
  if ('name' in contact) {
    return contact.name;
  }
  return getContactPersonFullName(contact);
};

/**
 * Formats phone number for display
 */
export const formatPhoneNumber = (phone?: string): string => {
  if (!phone) return "";
  // Simple formatting - can be enhanced
  return phone.trim();
};

/**
 * Formats email for display
 */
export const formatEmail = (email?: string): string => {
  if (!email) return "";
  return email.toLowerCase().trim();
};
