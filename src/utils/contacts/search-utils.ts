import { CustomerCompany, ContactPerson } from "@/types/contacts";

/**
 * Filters companies based on search term and contact type
 */
export const filterCompanies = (
  companies: CustomerCompany[],
  searchTerm: string,
  contactTypeFilter: string
): CustomerCompany[] => {
  let filtered = companies;
  
  // Filter by contact type (supports multiple types comma-separated)
  if (contactTypeFilter !== 'alle') {
    const selectedTypes = contactTypeFilter.split(',');
    filtered = filtered.filter(company => 
      selectedTypes.includes(company.contact_type || '')
    );
  }
  
  // Filter by search term
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase().trim();
    filtered = filtered.filter(company =>
      company.name.toLowerCase().includes(term) ||
      company.email?.toLowerCase().includes(term) ||
      company.city?.toLowerCase().includes(term) ||
      company.address?.toLowerCase().includes(term) ||
      company.phone?.toLowerCase().includes(term)
    );
  }
  
  return filtered;
};

/**
 * Filters contact persons based on search term and contact type
 */
export const filterContactPersons = (
  persons: ContactPerson[],
  searchTerm: string,
  contactTypeFilter: string
): ContactPerson[] => {
  let filtered = persons;
  
  // Filter by contact type (supports multiple types comma-separated)
  if (contactTypeFilter !== 'alle') {
    const selectedTypes = contactTypeFilter.split(',');
    filtered = filtered.filter(person => {
      return selectedTypes.includes(person.customer_companies?.contact_type || '');
    });
  }
  
  // Filter by search term
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase().trim();
    filtered = filtered.filter(person =>
      `${person.first_name} ${person.last_name}`.toLowerCase().includes(term) ||
      person.email?.toLowerCase().includes(term) ||
      person.phone?.toLowerCase().includes(term) ||
      person.mobile?.toLowerCase().includes(term) ||
      person.position?.toLowerCase().includes(term) ||
      person.customer_companies?.name?.toLowerCase().includes(term)
    );
  }
  
  return filtered;
};

/**
 * Gets unique contact types from companies
 */
export const getUniqueContactTypes = (companies: CustomerCompany[]): string[] => {
  const types = companies
    .map((company) => company.contact_type)
    .filter((type): type is string => !!type);
  return Array.from(new Set(types));
};
