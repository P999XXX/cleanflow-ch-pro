import { CustomerCompany } from '@/hooks/useCompanies';
import { ContactPerson } from '@/hooks/useContactPersons';

/**
 * Union type representing either a company or a person contact
 */
export type ContactItem = CustomerCompany | ContactPerson;

/**
 * Type guard to check if a contact item is a company
 */
export function isCompany(item: ContactItem): item is CustomerCompany {
  return 'company_type' in item;
}

/**
 * Type guard to check if a contact item is a person
 */
export function isPerson(item: ContactItem): item is ContactPerson {
  return 'first_name' in item && 'last_name' in item;
}

/**
 * Navigation stack item for detail view navigation
 */
export interface NavigationStackItem {
  item: ContactItem;
  type: 'company' | 'person';
}

/**
 * Item to delete with its type
 */
export interface DeleteItem {
  item: ContactItem;
  type: 'company' | 'person';
}

/**
 * Contact type for filtering
 */
export type ContactType = 'all' | 'Unternehmen' | 'Geschäftskunde' | 'Privatkunde' | 'Mitarbeiter' | 'Person';

/**
 * View mode for contact display
 */
export type ViewMode = 'table' | 'cards';

/**
 * Active tab selection
 */
export type ActiveTab = 'all' | 'companies' | 'persons';
