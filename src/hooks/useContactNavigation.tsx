import { useState, useCallback } from 'react';
import { NavigationStackItem } from '@/types/contacts';
import { CustomerCompany } from '@/hooks/useCompanies';
import { ContactPerson } from '@/hooks/useContactPersons';

/**
 * Custom hook for managing contact details navigation stack
 */
export function useContactNavigation() {
  const [selectedItem, setSelectedItem] = useState<any>(null); // TODO: Use ContactItem with type guards
  const [itemType, setItemType] = useState<'company' | 'person'>('company');
  const [navigationStack, setNavigationStack] = useState<NavigationStackItem[]>([]);

  // Handle card clicks to open details
  const handleCardClick = useCallback((item: any, type: 'company' | 'person') => {
    setSelectedItem(item);
    setItemType(type);
    setNavigationStack([]);
  }, []);

  // Handle navigation between company and person details
  const handleNavigateToCompany = useCallback((companyId: string, companies?: CustomerCompany[]) => {
    const company = companies?.find(c => c.id === companyId);
    if (company) {
      setNavigationStack(prev => [...prev, { item: selectedItem, type: itemType }]);
      setSelectedItem(company);
      setItemType('company');
    }
  }, [selectedItem, itemType]);

  const handleNavigateToPerson = useCallback((person: ContactPerson, contactPersons?: ContactPerson[]) => {
    const fullPersonData = contactPersons?.find(p => p.id === person.id);
    setNavigationStack(prev => [...prev, { item: selectedItem, type: itemType }]);
    setSelectedItem(fullPersonData || person);
    setItemType('person');
  }, [selectedItem, itemType]);

  // Handle going back in navigation
  const handleGoBack = useCallback(() => {
    if (navigationStack.length > 0) {
      const previousItem = navigationStack[navigationStack.length - 1];
      setNavigationStack(prev => prev.slice(0, -1));
      setSelectedItem(previousItem.item);
      setItemType(previousItem.type);
    }
  }, [navigationStack]);

  // Handle edit actions
  const handleEditItem = useCallback(() => {
    setNavigationStack(prev => [...prev, { item: selectedItem, type: itemType }]);
  }, [selectedItem, itemType]);

  // Reset navigation state
  const resetNavigation = useCallback(() => {
    setSelectedItem(null);
    setItemType('company');
    setNavigationStack([]);
  }, []);

  return {
    // State
    selectedItem,
    itemType,
    navigationStack,

    // Setters
    setSelectedItem,
    setItemType,
    setNavigationStack,

    // Actions
    handleCardClick,
    handleNavigateToCompany,
    handleNavigateToPerson,
    handleGoBack,
    handleEditItem,
    resetNavigation,
  };
}

/**
 * Type for the contact navigation hook return value
 */
export type ContactNavigationHook = ReturnType<typeof useContactNavigation>;