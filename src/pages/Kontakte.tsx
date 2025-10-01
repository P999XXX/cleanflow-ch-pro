import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ContactForm } from '@/components/Contacts/ContactForm';
import { ContactsFilters } from '@/components/Contacts/ContactsFilters';
import { ContactsContent } from '@/components/Contacts/ContactsContent';
import { ContactDetailsDialog } from '@/components/Contacts/ContactDetailsDialog';
import { DeleteContactDialog } from '@/components/Contacts/DeleteContactDialog';
import { useContactsData } from '@/hooks/useContactsData';
import { useContactsActions } from '@/hooks/useContactsActions';
import { useIsMobile } from '@/hooks/use-mobile';
import { getCompanyTypeAbbreviation, getStatusBadge } from '@/lib/contactUtils';

/**
 * Main Kontakte page - refactored for better maintainability
 * Coordinates between filters, content views, and dialogs
 */
const Kontakte = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'companies' | 'persons' | 'employees'>('all');
  const [contactTypeFilter, setContactTypeFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [itemType, setItemType] = useState<'company' | 'person'>('company');
  const [navigationStack, setNavigationStack] = useState<Array<{item: any, type: 'company' | 'person'}>>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{item: any, type: 'company' | 'person'} | null>(null);

  const isMobile = useIsMobile();
  
  // Fetch and filter all contact data using custom hook
  const { 
    companies, 
    persons, 
    employees, 
    totalCount, 
    availableContactTypes 
  } = useContactsData(searchTerm, contactTypeFilter);

  // Get all action handlers from custom hook
  const {
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
  } = useContactsActions({
    companies,
    contactPersons: persons,
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
  });

  // Handle URL parameters for filtering
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam) {
      const formattedType = typeParam.charAt(0).toUpperCase() + typeParam.slice(1).toLowerCase();
      setContactTypeFilter(formattedType);
    }
  }, [searchParams]);

  // Set default view mode based on device type
  useEffect(() => {
    if (!isMobile && viewMode === 'cards') {
      setViewMode('table');
    }
  }, [isMobile, viewMode]);

  const effectiveViewMode = isMobile ? 'cards' : viewMode;
  const isSearching = searchTerm.trim().length > 0;
  const hasNoResults = isSearching && totalCount === 0;

  const clearSearch = useCallback(() => setSearchTerm(''), []);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <ContactsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onClearSearch={clearSearch}
        contactTypeFilter={contactTypeFilter}
        onContactTypeChange={setContactTypeFilter}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as 'all' | 'companies' | 'persons' | 'employees')}
        totalCount={totalCount}
        companiesCount={companies.length}
        personsCount={persons.length}
        employeesCount={employees.length}
        viewMode={viewMode}
        onViewModeToggle={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
        onAddClick={handleAddClick}
        isMobile={isMobile}
        availableContactTypes={availableContactTypes}
      />

      <div className="mt-6">
        <ContactsContent
          viewMode={effectiveViewMode}
          activeTab={activeTab}
          companies={companies}
          persons={persons}
          employees={employees}
          isSearching={isSearching}
          hasNoResults={hasNoResults}
          onClearSearch={clearSearch}
          onCardClick={handleCardClick}
        />
      </div>

      <ContactForm 
        isOpen={isFormOpen}
        onClose={handleFormClose}
        company={selectedCompany}
        contactPerson={selectedPerson}
        onSubmitCompany={(data) => handleCompanySubmit(data, selectedCompany)}
        onSubmitPerson={(data, details, children) => handlePersonSubmit(data, details, children, selectedPerson)}
      />

      <ContactDetailsDialog
        isOpen={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setDeleteDialogOpen(false);
          setNavigationStack([]);
        }}
        selectedItem={selectedItem}
        itemType={itemType}
        navigationStack={navigationStack}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
        onGoBack={handleGoBack}
        onNavigateToCompany={handleNavigateToCompany}
        onNavigateToPerson={handleNavigateToPerson}
        getStatusBadge={getStatusBadge}
        getCompanyTypeAbbreviation={getCompanyTypeAbbreviation}
      />

      <DeleteContactDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => confirmDelete(itemToDelete)}
      />
    </div>
  );
};

export default Kontakte;
