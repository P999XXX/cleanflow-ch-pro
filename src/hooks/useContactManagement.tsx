import { useState, useCallback } from 'react';
import { CustomerCompany, CustomerCompanyInput } from '@/hooks/useCompanies';
import { ContactPerson, ContactPersonInput } from '@/hooks/useContactPersons';
import { ViewMode, ActiveTab } from '@/types/contacts';

/**
 * Custom hook for managing contact-related state and UI interactions
 */
export function useContactManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');
  const [contactTypeFilter, setContactTypeFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CustomerCompany | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<ContactPerson | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Clear search function
  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Handle add button click - reset form state
  const handleAddClick = useCallback(() => {
    setDetailsOpen(false);
    setDeleteDialogOpen(false);
    setSelectedCompany(null);
    setSelectedPerson(null);
    setIsFormOpen(true);
  }, []);

  // Toggle view mode
  const toggleViewMode = useCallback(() => {
    setViewMode(prev => prev === 'table' ? 'cards' : 'table');
  }, []);

  // Handle tab change with filter reset
  const handleTabChange = useCallback((tab: ActiveTab) => {
    setActiveTab(tab);
    setContactTypeFilter('all'); // Reset filters when tab changes for better UX
  }, []);

  return {
    // State
    searchTerm,
    activeTab,
    contactTypeFilter,
    isFormOpen,
    selectedCompany,
    selectedPerson,
    viewMode,
    detailsOpen,
    deleteDialogOpen,

    // Setters
    setSearchTerm,
    setActiveTab: handleTabChange,
    setContactTypeFilter,
    setIsFormOpen,
    setSelectedCompany,
    setSelectedPerson,
    setViewMode,
    setDetailsOpen,
    setDeleteDialogOpen,

    // Derived actions
    clearSearch,
    handleAddClick,
    toggleViewMode,
  };
}

/**
 * Type for the contact management hook return value
 */
export type ContactManagementHook = ReturnType<typeof useContactManagement>;