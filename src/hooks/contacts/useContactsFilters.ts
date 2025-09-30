import { useState, useMemo, useCallback } from "react";
import { CustomerCompany, ContactPerson, ActiveTab } from "@/types/contacts";
import { filterCompanies, filterContactPersons, getUniqueContactTypes } from "@/utils/contacts/search-utils";

/**
 * Hook for managing contact filters and search
 */
export const useContactsFilters = (
  companies: CustomerCompany[],
  persons: ContactPerson[]
) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [contactTypeFilter, setContactTypeFilter] = useState<string>("alle");
  const [activeTab, setActiveTab] = useState<ActiveTab>("companies");

  // Get available contact types
  const availableContactTypes = useMemo(
    () => getUniqueContactTypes(companies),
    [companies]
  );

  // Filter data
  const filteredCompanies = useMemo(
    () => filterCompanies(companies, searchTerm, contactTypeFilter),
    [companies, searchTerm, contactTypeFilter]
  );

  const filteredPersons = useMemo(
    () => filterContactPersons(persons, searchTerm, contactTypeFilter),
    [persons, searchTerm, contactTypeFilter]
  );

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    contactTypeFilter,
    setContactTypeFilter,
    activeTab,
    setActiveTab,
    availableContactTypes,
    filteredCompanies,
    filteredPersons,
    clearSearch,
  };
};
