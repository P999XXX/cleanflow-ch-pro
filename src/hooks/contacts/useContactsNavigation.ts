import { useState, useCallback } from "react";
import { CustomerCompany, ContactPerson, NavigationHistoryItem } from "@/types/contacts";

/**
 * Hook for managing contact details navigation
 */
export const useContactsNavigation = () => {
  const [selectedCompany, setSelectedCompany] = useState<CustomerCompany | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<ContactPerson | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<NavigationHistoryItem[]>([]);

  const handleCardClick = useCallback((item: CustomerCompany | ContactPerson) => {
    if ("name" in item) {
      setSelectedCompany(item);
      setSelectedPerson(null);
    } else {
      setSelectedPerson(item);
      setSelectedCompany(null);
    }
    setIsDetailsOpen(true);
    setNavigationHistory([]);
  }, []);

  const handleNavigateToCompany = useCallback((company: CustomerCompany) => {
    if (selectedCompany) {
      setNavigationHistory((prev) => [
        ...prev,
        { type: "company", id: selectedCompany.id },
      ]);
    } else if (selectedPerson) {
      setNavigationHistory((prev) => [
        ...prev,
        { type: "person", id: selectedPerson.id },
      ]);
    }
    setSelectedCompany(company);
    setSelectedPerson(null);
  }, [selectedCompany, selectedPerson]);

  const handleNavigateToPerson = useCallback((person: ContactPerson) => {
    if (selectedCompany) {
      setNavigationHistory((prev) => [
        ...prev,
        { type: "company", id: selectedCompany.id },
      ]);
    } else if (selectedPerson) {
      setNavigationHistory((prev) => [
        ...prev,
        { type: "person", id: selectedPerson.id },
      ]);
    }
    setSelectedCompany(null);
    setSelectedPerson(person);
  }, [selectedCompany, selectedPerson]);

  const handleGoBack = useCallback(
    (companies: CustomerCompany[], persons: ContactPerson[]) => {
      if (navigationHistory.length === 0) return;

      const lastItem = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory((prev) => prev.slice(0, -1));

      if (lastItem.type === "company") {
        const company = companies.find((c) => c.id === lastItem.id);
        if (company) {
          setSelectedCompany(company);
          setSelectedPerson(null);
        }
      } else {
        const person = persons.find((p) => p.id === lastItem.id);
        if (person) {
          setSelectedPerson(person);
          setSelectedCompany(null);
        }
      }
    },
    [navigationHistory]
  );

  const closeDetails = useCallback(() => {
    setIsDetailsOpen(false);
    setSelectedCompany(null);
    setSelectedPerson(null);
    setNavigationHistory([]);
  }, []);

  return {
    selectedCompany,
    selectedPerson,
    isDetailsOpen,
    navigationHistory,
    handleCardClick,
    handleNavigateToCompany,
    handleNavigateToPerson,
    handleGoBack,
    closeDetails,
  };
};
