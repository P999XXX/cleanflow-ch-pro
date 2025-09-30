import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ContactForm } from '@/components/Contacts/ContactForm';
import { ContactsFilters } from '@/components/Contacts/ContactsFilters';
import { ContactsCardsView } from '@/components/Contacts/ContactsCardsView';
import { ContactsTableView } from '@/components/Contacts/ContactsTableView';
import { ContactDetailsDialog } from '@/components/Contacts/ContactDetailsDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { useContactsData } from '@/hooks/contacts/useContactsData';
import { useContactsFilters } from '@/hooks/contacts/useContactsFilters';
import { useContactsNavigation } from '@/hooks/contacts/useContactsNavigation';
import { CustomerCompany, ContactPerson, ViewMode } from '@/types/contacts';
import { getStatusBadge } from '@/utils/contacts/status-utils';
import { getCompanyTypeAbbreviation } from '@/utils/contacts/formatting';
import { CustomerCompany as CompanyType, CustomerCompanyInput } from '@/hooks/useCompanies';
import { ContactPerson as PersonType, ContactPersonInput } from '@/hooks/useContactPersons';

const Kontakte = () => {
  // UI State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyType | null>(null);
  const [editingPerson, setEditingPerson] = useState<PersonType | null>(null);
  const [formMode, setFormMode] = useState<'company' | 'person'>('company');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{item: CompanyType | PersonType, type: 'company' | 'person'} | null>(null);

  const isMobile = useIsMobile();

  // Custom hooks for data, filters, and navigation
  const {
    companies,
    persons,
    isLoading,
    createCompany,
    updateCompany,
    deleteCompany,
    createContactPerson,
    updateContactPerson,
    deleteContactPerson,
  } = useContactsData();

  const {
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
  } = useContactsFilters(companies as CustomerCompany[], persons as ContactPerson[]);

  const {
    selectedCompany: navSelectedCompany,
    selectedPerson: navSelectedPerson,
    isDetailsOpen,
    navigationHistory,
    handleCardClick: navHandleCardClick,
    handleNavigateToCompany: navHandleNavigateToCompany,
    handleNavigateToPerson: navHandleNavigateToPerson,
    handleGoBack: navHandleGoBack,
    closeDetails,
  } = useContactsNavigation();

  // Set default view mode based on device type
  React.useEffect(() => {
    if (!isMobile && viewMode === 'cards') {
      setViewMode('table');
    }
  }, [isMobile]);

  // Force cards view on mobile and tablet by default, desktop defaults to table
  const effectiveViewMode = isMobile ? 'cards' : viewMode;

  const totalCount = filteredCompanies.length + filteredPersons.length;
  const isSearching = searchTerm.trim().length > 0;
  const hasNoResults = isSearching && totalCount === 0;

  // Wrap navigation handlers to work with our types
  const handleCardClick = useCallback((item: CompanyType | PersonType) => {
    navHandleCardClick(item as any);
  }, [navHandleCardClick]);

  const handleNavigateToCompany = useCallback((companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      navHandleNavigateToCompany(company as any);
    }
  }, [companies, navHandleNavigateToCompany]);

  const handleNavigateToPerson = useCallback((person: PersonType) => {
    navHandleNavigateToPerson(person as any);
  }, [navHandleNavigateToPerson]);

  const handleGoBack = useCallback(() => {
    navHandleGoBack(companies as any[], persons as any[]);
  }, [navHandleGoBack, companies, persons]);

  // Handle edit actions
  const handleEditItem = useCallback(() => {
    if (navSelectedCompany) {
      setEditingCompany(navSelectedCompany as CompanyType);
      setFormMode('company');
    } else if (navSelectedPerson) {
      setEditingPerson(navSelectedPerson as PersonType);
      setFormMode('person');
    }
    closeDetails();
    setIsFormOpen(true);
  }, [navSelectedCompany, navSelectedPerson, closeDetails]);

  // Handle form close
  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setEditingCompany(null);
    setEditingPerson(null);
  }, []);

  // Handle delete actions
  const handleDeleteItem = useCallback(() => {
    if (navSelectedCompany) {
      setItemToDelete({ item: navSelectedCompany as CompanyType, type: 'company' });
    } else if (navSelectedPerson) {
      setItemToDelete({ item: navSelectedPerson as PersonType, type: 'person' });
    }
    setDeleteDialogOpen(true);
  }, [navSelectedCompany, navSelectedPerson]);

  const confirmDelete = useCallback(() => {
    if (itemToDelete) {
      if (itemToDelete.type === 'company') {
        deleteCompany.mutate(itemToDelete.item.id);
      } else {
        deleteContactPerson.mutate(itemToDelete.item.id);
      }
      setDeleteDialogOpen(false);
      closeDetails();
      setItemToDelete(null);
    }
  }, [itemToDelete, deleteCompany, deleteContactPerson, closeDetails]);

  const handleCompanySubmit = (companyData: CustomerCompanyInput) => {
    if (editingCompany) {
      updateCompany.mutate(
        { id: editingCompany.id, company: companyData },
        { 
          onSuccess: () => { 
            setIsFormOpen(false); 
            setEditingCompany(null);
          } 
        }
      );
    } else {
      createCompany.mutate(companyData, {
        onSuccess: () => setIsFormOpen(false)
      });
    }
  };

  const handlePersonSubmit = (personData: ContactPersonInput) => {
    if (editingPerson) {
      updateContactPerson.mutate(
        { id: editingPerson.id, contactPerson: personData },
        { 
          onSuccess: () => { 
            setIsFormOpen(false); 
            setEditingPerson(null);
          } 
        }
      );
    } else {
      createContactPerson.mutate(personData, {
        onSuccess: () => setIsFormOpen(false)
      });
    }
  };

  // Handle add button click based on active tab
  const handleAddClick = () => {
    if (activeTab === 'persons') {
      setEditingPerson(null);
      setFormMode('person');
    } else {
      setEditingCompany(null);
      setFormMode('company');
    }
    setIsFormOpen(true);
  };

  // Fix activeTab type for filter
  const handleTabChange = (tab: string) => {
    if (tab === 'companies' || tab === 'persons') {
      setActiveTab(tab);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* Header and Filters */}
      <ContactsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onClearSearch={clearSearch}
        contactTypeFilter={contactTypeFilter}
        onContactTypeChange={setContactTypeFilter}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        totalCount={totalCount}
        companiesCount={filteredCompanies.length}
        personsCount={filteredPersons.length}
        viewMode={viewMode}
        onViewModeToggle={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
        onAddClick={handleAddClick}
        isMobile={isMobile}
        availableContactTypes={availableContactTypes}
      />

      {/* Main Content */}
      <div className="mt-6">
        {effectiveViewMode === 'cards' ? (
          <>
            {activeTab === 'companies' && (
              <ContactsCardsView
                companies={filteredCompanies as CompanyType[]}
                persons={[]}
                showSections={true}
                isSearching={isSearching}
                hasNoResults={hasNoResults}
                onClearSearch={clearSearch}
                onCardClick={handleCardClick}
              />
            )}
            {activeTab === 'persons' && (
              <ContactsCardsView
                companies={[]}
                persons={filteredPersons as PersonType[]}
                showSections={true}
                isSearching={isSearching}
                hasNoResults={hasNoResults}
                onClearSearch={clearSearch}
                onCardClick={handleCardClick}
              />
            )}
          </>
        ) : (
          <>
            {activeTab === 'companies' && (
              <ContactsTableView
                companies={filteredCompanies as CompanyType[]}
                persons={[]}
                showSections={true}
                isSearching={isSearching}
                hasNoResults={hasNoResults}
                onClearSearch={clearSearch}
                onCardClick={handleCardClick}
                getStatusBadge={getStatusBadge}
              />
            )}
            {activeTab === 'persons' && (
              <ContactsTableView
                companies={[]}
                persons={filteredPersons as PersonType[]}
                showSections={true}
                isSearching={isSearching}
                hasNoResults={hasNoResults}
                onClearSearch={clearSearch}
                onCardClick={handleCardClick}
                getStatusBadge={getStatusBadge}
              />
            )}
          </>
        )}
      </div>

      {/* Contact Form Dialog */}
      <ContactForm 
        isOpen={isFormOpen}
        onClose={handleFormClose}
        company={editingCompany || undefined}
        contactPerson={editingPerson || undefined}
        onSubmitCompany={handleCompanySubmit}
        onSubmitPerson={handlePersonSubmit}
        initialMode={formMode}
      />

      {/* Details Dialog */}
      <ContactDetailsDialog
        isOpen={isDetailsOpen}
        onClose={closeDetails}
        selectedItem={navSelectedCompany || navSelectedPerson}
        itemType={navSelectedCompany ? 'company' : 'person'}
        navigationStack={navigationHistory as any}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
        onGoBack={handleGoBack}
        onNavigateToCompany={handleNavigateToCompany}
        onNavigateToPerson={handleNavigateToPerson}
        getStatusBadge={getStatusBadge}
        getCompanyTypeAbbreviation={getCompanyTypeAbbreviation}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kontakt löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Der Kontakt wird permanent gelöscht und alle verknüpften Daten gehen verloren.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col items-center gap-3 pt-4">
            <Button onClick={confirmDelete} variant="destructive" className="w-full">
              Löschen
            </Button>
            <button 
              type="button" 
              onClick={() => setDeleteDialogOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Abbrechen
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Kontakte;
