import { useCallback } from 'react';
import { useCompanyMutations } from './useCompanies';
import { useContactPersonMutations } from './useContactPersons';
import { useEmployeeDetailsMutations } from './useEmployeeDetails';

interface NavigationItem {
  item: any;
  type: 'company' | 'person';
}

interface UseContactsActionsProps {
  companies?: any[];
  contactPersons?: any[];
  navigationStack: NavigationItem[];
  setNavigationStack: (value: NavigationItem[] | ((prev: NavigationItem[]) => NavigationItem[])) => void;
  setSelectedItem: (item: any) => void;
  setItemType: (type: 'company' | 'person') => void;
  setDetailsOpen: (open: boolean) => void;
  setIsFormOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setSelectedCompany: (company: any) => void;
  setSelectedPerson: (person: any) => void;
  setItemToDelete: (item: { item: any; type: 'company' | 'person' } | null) => void;
  selectedItem: any;
  itemType: 'company' | 'person';
}

/**
 * Custom hook for handling all contact-related actions
 */
export function useContactsActions({
  companies,
  contactPersons,
  navigationStack,
  setNavigationStack,
  setSelectedItem,
  setItemType,
  setDetailsOpen,
  setIsFormOpen,
  setDeleteDialogOpen,
  setSelectedCompany,
  setSelectedPerson,
  setItemToDelete,
  selectedItem,
  itemType,
}: UseContactsActionsProps) {
  const { createCompany, updateCompany, deleteCompany } = useCompanyMutations();
  const { createContactPerson, updateContactPerson, deleteContactPerson } = useContactPersonMutations();
  const { createOrUpdateEmployeeDetails, createEmployeeChild } = useEmployeeDetailsMutations();

  // Handle card clicks to open details
  const handleCardClick = useCallback((item: any, type: 'company' | 'person') => {
    setIsFormOpen(false);
    setDeleteDialogOpen(false);
    setSelectedItem(item);
    setItemType(type);
    setNavigationStack([]);
    setDetailsOpen(true);
  }, [setIsFormOpen, setDeleteDialogOpen, setSelectedItem, setItemType, setNavigationStack, setDetailsOpen]);

  // Handle navigation between company and person details
  const handleNavigateToCompany = useCallback((companyId: string) => {
    const company = companies?.find(c => c.id === companyId);
    if (company) {
      setNavigationStack(prev => [...prev, { item: selectedItem, type: itemType }]);
      setSelectedItem(company);
      setItemType('company');
    }
  }, [companies, selectedItem, itemType, setNavigationStack, setSelectedItem, setItemType]);

  const handleNavigateToPerson = useCallback((person: any) => {
    const fullPersonData = contactPersons?.find(p => p.id === person.id);
    setNavigationStack(prev => [...prev, { item: selectedItem, type: itemType }]);
    setSelectedItem(fullPersonData || person);
    setItemType('person');
  }, [contactPersons, selectedItem, itemType, setNavigationStack, setSelectedItem, setItemType]);

  // Handle going back in navigation
  const handleGoBack = useCallback(() => {
    if (navigationStack.length > 0) {
      const previousItem = navigationStack[navigationStack.length - 1];
      setNavigationStack(prev => prev.slice(0, -1));
      setSelectedItem(previousItem.item);
      setItemType(previousItem.type);
    } else {
      setDetailsOpen(false);
      setNavigationStack([]);
    }
  }, [navigationStack, setNavigationStack, setSelectedItem, setItemType, setDetailsOpen]);

  // Handle edit actions
  const handleEditItem = useCallback(() => {
    setNavigationStack(prev => [...prev, { item: selectedItem, type: itemType }]);
    
    if (itemType === 'company') {
      setSelectedCompany(selectedItem);
    } else {
      setSelectedPerson(selectedItem);
    }
    setDetailsOpen(false);
    setDeleteDialogOpen(false);
    setIsFormOpen(true);
  }, [selectedItem, itemType, setNavigationStack, setSelectedCompany, setSelectedPerson, setDetailsOpen, setDeleteDialogOpen, setIsFormOpen]);

  // Handle form close - go back to details if there's a navigation stack
  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setSelectedCompany(null);
    setSelectedPerson(null);
    
    if (navigationStack.length > 0) {
      const previousItem = navigationStack[navigationStack.length - 1];
      setNavigationStack(prev => prev.slice(0, -1));
      setSelectedItem(previousItem.item);
      setItemType(previousItem.type);
      setDetailsOpen(true);
    }
  }, [navigationStack, setIsFormOpen, setSelectedCompany, setSelectedPerson, setNavigationStack, setSelectedItem, setItemType, setDetailsOpen]);

  // Handle delete actions
  const handleDeleteItem = useCallback(() => {
    setItemToDelete({ item: selectedItem, type: itemType });
    setDeleteDialogOpen(true);
  }, [selectedItem, itemType, setItemToDelete, setDeleteDialogOpen]);

  // Handle add button click
  const handleAddClick = useCallback(() => {
    setDetailsOpen(false);
    setDeleteDialogOpen(false);
    setSelectedCompany(null);
    setSelectedPerson(null);
    setIsFormOpen(true);
  }, [setDetailsOpen, setDeleteDialogOpen, setSelectedCompany, setSelectedPerson, setIsFormOpen]);

  // Company submission handler
  const handleCompanySubmit = useCallback((companyData: any, selectedCompany: any) => {
    if (selectedCompany) {
      updateCompany.mutate(
        { id: selectedCompany.id, company: companyData },
        { 
          onSuccess: () => { 
            if (navigator.vibrate) navigator.vibrate(50);
            setIsFormOpen(false); 
            setSelectedCompany(null);
            
            if (navigationStack.length > 0) {
              const previousItem = navigationStack[navigationStack.length - 1];
              setNavigationStack(prev => prev.slice(0, -1));
              setSelectedItem(previousItem.item);
              setItemType(previousItem.type);
              setDetailsOpen(true);
            }
          } 
        }
      );
    } else {
      createCompany.mutate(companyData, {
        onSuccess: () => {
          if (navigator.vibrate) navigator.vibrate(50);
          setIsFormOpen(false);
        }
      });
    }
  }, [updateCompany, createCompany, navigationStack, setIsFormOpen, setSelectedCompany, setNavigationStack, setSelectedItem, setItemType, setDetailsOpen]);

  // Person submission handler
  const handlePersonSubmit = useCallback(async (personData: any, employeeDetails: any, children: any, selectedPerson: any) => {
    if (selectedPerson) {
      updateContactPerson.mutate(
        { id: selectedPerson.id, contactPerson: personData },
        { 
          onSuccess: async (updatedPerson) => {
            if (personData.is_employee && employeeDetails) {
              await createOrUpdateEmployeeDetails.mutateAsync({
                contactPersonId: updatedPerson.id,
                details: employeeDetails
              });
            }

            if (navigator.vibrate) navigator.vibrate(50);
            setIsFormOpen(false); 
            setSelectedPerson(null);
            
            if (navigationStack.length > 0) {
              const previousItem = navigationStack[navigationStack.length - 1];
              setNavigationStack(prev => prev.slice(0, -1));
              setSelectedItem(previousItem.item);
              setItemType(previousItem.type);
              setDetailsOpen(true);
            }
          } 
        }
      );
    } else {
      createContactPerson.mutate(personData, {
        onSuccess: async (createdPerson) => {
          if (personData.is_employee && employeeDetails) {
            const employeeDetailsResult = await createOrUpdateEmployeeDetails.mutateAsync({
              contactPersonId: createdPerson.id,
              details: employeeDetails
            });

            if (children && children.length > 0 && employeeDetailsResult) {
              for (const child of children) {
                await createEmployeeChild.mutateAsync({
                  employeeDetailsId: employeeDetailsResult.id,
                  child
                });
              }
            }
          }

          if (navigator.vibrate) navigator.vibrate(50);
          setIsFormOpen(false);
        }
      });
    }
  }, [updateContactPerson, createContactPerson, createOrUpdateEmployeeDetails, createEmployeeChild, navigationStack, setIsFormOpen, setSelectedPerson, setNavigationStack, setSelectedItem, setItemType, setDetailsOpen]);

  // Delete confirmation handler
  const confirmDelete = useCallback((itemToDelete: { item: any; type: 'company' | 'person' } | null) => {
    if (itemToDelete) {
      if (itemToDelete.type === 'company') {
        deleteCompany.mutate(itemToDelete.item.id);
      } else {
        deleteContactPerson.mutate(itemToDelete.item.id);
      }
      setDeleteDialogOpen(false);
      setDetailsOpen(false);
      setItemToDelete(null);
    }
  }, [deleteCompany, deleteContactPerson, setDeleteDialogOpen, setDetailsOpen, setItemToDelete]);

  return {
    handleCardClick,
    handleNavigateToCompany,
    handleNavigateToPerson,
    handleGoBack,
    handleEditItem,
    handleFormClose,
    handleDeleteItem,
    handleAddClick,
    handleCompanySubmit,
    handlePersonSubmit,
    confirmDelete,
  };
}
