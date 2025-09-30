/**
 * Central type definitions for the contact management system
 */

export interface CustomerCompany {
  id: string;
  name: string;
  company_type?: string;
  industry_category?: string;
  contact_type?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  vat_number?: string;
  notes?: string;
  status?: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  contact_persons?: ContactPerson[];
}

export interface ContactPerson {
  id: string;
  first_name: string;
  last_name: string;
  position?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  is_primary_contact?: boolean;
  notes?: string;
  customer_company_id?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  customer_companies?: {
    name: string;
    company_type?: string;
    contact_type?: string;
  };
}

export interface CustomerCompanyInput {
  name: string;
  company_type?: string;
  industry_category?: string;
  contact_type?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  vat_number?: string;
  notes?: string;
  status?: string;
}

export interface ContactPersonInput {
  first_name: string;
  last_name: string;
  position?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  is_primary_contact?: boolean;
  notes?: string;
  customer_company_id?: string;
}

export type ContactItem = CustomerCompany | ContactPerson;

export type ContactFormMode = 'company' | 'person';

export type ViewMode = 'cards' | 'table';

export type ActiveTab = 'companies' | 'persons';

export interface ContactFormErrors {
  [key: string]: string;
}

export interface NavigationHistoryItem {
  type: 'company' | 'person';
  id: string;
}
