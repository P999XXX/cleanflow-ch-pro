import { useCompanies, useCompanyMutations } from "@/hooks/useCompanies";
import { useContactPersons, useContactPersonMutations } from "@/hooks/useContactPersons";

/**
 * Centralized hook for all contact data operations
 */
export const useContactsData = () => {
  // Fetch data
  const { data: companies = [], isLoading: companiesLoading } = useCompanies();
  const { data: persons = [], isLoading: personsLoading } = useContactPersons();

  // Mutations
  const {
    createCompany,
    updateCompany,
    deleteCompany,
  } = useCompanyMutations();

  const {
    createContactPerson,
    updateContactPerson,
    deleteContactPerson,
  } = useContactPersonMutations();

  return {
    // Data
    companies,
    persons,
    isLoading: companiesLoading || personsLoading,

    // Company mutations
    createCompany,
    updateCompany,
    deleteCompany,

    // Person mutations
    createContactPerson,
    updateContactPerson,
    deleteContactPerson,
  };
};
