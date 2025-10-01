import { useMemo } from 'react';
import { useCompanies } from './useCompanies';
import { useContactPersons } from './useContactPersons';

export interface FilteredContactsData {
  companies: any[];
  persons: any[];
  employees: any[];
  totalCount: number;
  isLoading: boolean;
  availableContactTypes: string[];
}

/**
 * Combined hook for fetching and filtering all contact data
 */
export function useContactsData(
  searchTerm: string,
  contactTypeFilter: string
): FilteredContactsData {
  const { data: companies, isLoading: companiesLoading } = useCompanies();
  const { data: contactPersons, isLoading: personsLoading } = useContactPersons();

  // Extract unique contact types from companies
  const availableContactTypes = useMemo(() => {
    if (!companies) return [];
    const types = new Set<string>();
    companies.forEach(company => {
      if (company.contact_type) {
        types.add(company.contact_type);
      }
    });
    return Array.from(types).sort();
  }, [companies]);

  // Filter companies
  const filteredCompanies = useMemo(() => {
    if (!companies) return [];
    
    let filtered = companies;
    
    // Filter by contact type
    if (contactTypeFilter !== 'all') {
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
  }, [companies, searchTerm, contactTypeFilter]);

  // Filter contact persons (non-employees)
  const filteredPersons = useMemo(() => {
    if (!contactPersons) return [];
    
    let filtered = contactPersons.filter(person => !person.is_employee);
    
    // Filter by contact type
    if (contactTypeFilter !== 'all') {
      const selectedTypes = contactTypeFilter.split(',');
      filtered = filtered.filter(person => {
        const fullCompany = companies?.find(company => company.id === person.customer_company_id);
        return selectedTypes.includes(fullCompany?.contact_type || '');
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
  }, [contactPersons, searchTerm, contactTypeFilter, companies]);

  // Filter employees
  const filteredEmployees = useMemo(() => {
    if (!contactPersons) return [];
    
    let filtered = contactPersons.filter(person => person.is_employee === true);
    
    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(person =>
        `${person.first_name} ${person.last_name}`.toLowerCase().includes(term) ||
        person.email?.toLowerCase().includes(term) ||
        person.phone?.toLowerCase().includes(term) ||
        person.mobile?.toLowerCase().includes(term) ||
        person.position?.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }, [contactPersons, searchTerm]);

  const totalCount = filteredCompanies.length + filteredPersons.length + filteredEmployees.length;

  return {
    companies: filteredCompanies,
    persons: filteredPersons,
    employees: filteredEmployees,
    totalCount,
    isLoading: companiesLoading || personsLoading,
    availableContactTypes,
  };
}
