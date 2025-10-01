import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useCompanies, useCompanyMutations } from '@/hooks/useCompanies';
import { useContactPersons, useContactPersonMutations } from '@/hooks/useContactPersons';
import { useEmployeeDetailsMutations } from '@/hooks/useEmployeeDetails';
import { ContactForm } from '@/components/Contacts/ContactForm';
import { ContactsFilters } from '@/components/Contacts/ContactsFilters';
import { ContactsCardsView } from '@/components/Contacts/ContactsCardsView';
import { ContactsTableView } from '@/components/Contacts/ContactsTableView';
import { ContactDetailsDialog } from '@/components/Contacts/ContactDetailsDialog';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const { data: companies, isLoading: companiesLoading } = useCompanies();
  const { data: contactPersons, isLoading: personsLoading } = useContactPersons();
  const { createCompany, updateCompany, deleteCompany } = useCompanyMutations();
  const { createContactPerson, updateContactPerson, deleteContactPerson } = useContactPersonMutations();
  const { createOrUpdateEmployeeDetails, createEmployeeChild } = useEmployeeDetailsMutations();

  // Handle URL parameters for filtering (e.g., ?type=kunde)
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam) {
      // Capitalize first letter to match database values
      const formattedType = typeParam.charAt(0).toUpperCase() + typeParam.slice(1).toLowerCase();
      setContactTypeFilter(formattedType);
    }
  }, [searchParams]);

  // Set default view mode based on device type
  React.useEffect(() => {
    if (!isMobile && viewMode === 'cards') {
      setViewMode('table');
    }
  }, [isMobile]);

  // Force cards view on mobile and tablet by default, desktop defaults to table
  const effectiveViewMode = isMobile ? 'cards' : viewMode;

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

  // Optimized filtering with useMemo for performance
  const filteredCompanies = useMemo(() => {
    if (!companies) return [];
    
    let filtered = companies;
    
    // Filter by contact type (supports multiple types comma-separated)
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

  const filteredPersons = useMemo(() => {
    if (!contactPersons) return [];
    
    let filtered = contactPersons.filter(person => !person.is_employee);
    
    // Filter by contact type (supports multiple types comma-separated)
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
  const isSearching = searchTerm.trim().length > 0;
  const hasNoResults = isSearching && totalCount === 0;

  // Clear search function
  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Handle card clicks to open details
  const handleCardClick = useCallback((item: any, type: 'company' | 'person') => {
    setIsFormOpen(false);
    setDeleteDialogOpen(false);
    setSelectedItem(item);
    setItemType(type);
    setNavigationStack([]);
    setDetailsOpen(true);
  }, []);

  // Handle navigation between company and person details
  const handleNavigateToCompany = useCallback((companyId: string) => {
    const company = companies?.find(c => c.id === companyId);
    if (company) {
      setNavigationStack(prev => [...prev, { item: selectedItem, type: itemType }]);
      setSelectedItem(company);
      setItemType('company');
    }
  }, [companies, selectedItem, itemType]);

  const handleNavigateToPerson = useCallback((person: any) => {
    const fullPersonData = contactPersons?.find(p => p.id === person.id);
    setNavigationStack(prev => [...prev, { item: selectedItem, type: itemType }]);
    setSelectedItem(fullPersonData || person);
    setItemType('person');
  }, [contactPersons, selectedItem, itemType]);

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
  }, [navigationStack]);

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
  }, [selectedItem, itemType]);

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
  }, [navigationStack]);

  // Handle delete actions
  const handleDeleteItem = useCallback(() => {
    setItemToDelete({ item: selectedItem, type: itemType });
    setDeleteDialogOpen(true);
  }, [selectedItem, itemType]);

  const confirmDelete = useCallback(() => {
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
  }, [itemToDelete, deleteCompany, deleteContactPerson]);

  const handleCompanySubmit = (companyData) => {
    if (selectedCompany) {
      updateCompany.mutate(
        { id: selectedCompany.id, company: companyData },
        { 
          onSuccess: () => { 
            // Vibration für mobile Geräte
            if (navigator.vibrate) {
              navigator.vibrate(50);
            }
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
          // Vibration für mobile Geräte
          if (navigator.vibrate) {
            navigator.vibrate(50);
          }
          setIsFormOpen(false);
        }
      });
    }
  };

  const handlePersonSubmit = async (personData, employeeDetails, children) => {
    if (selectedPerson) {
      updateContactPerson.mutate(
        { id: selectedPerson.id, contactPerson: personData },
        { 
          onSuccess: async (updatedPerson) => {
            // If employee data is provided, save it
            if (personData.is_employee && employeeDetails) {
              await createOrUpdateEmployeeDetails.mutateAsync({
                contactPersonId: updatedPerson.id,
                details: employeeDetails
              });

              // Save children if any
              if (children && children.length > 0) {
                // TODO: Handle children updates
              }
            }

            // Vibration für mobile Geräte
            if (navigator.vibrate) {
              navigator.vibrate(50);
            }
            
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
          // If employee data is provided, save it
          if (personData.is_employee && employeeDetails) {
            const employeeDetailsResult = await createOrUpdateEmployeeDetails.mutateAsync({
              contactPersonId: createdPerson.id,
              details: employeeDetails
            });

            // Save children if any
            if (children && children.length > 0 && employeeDetailsResult) {
              for (const child of children) {
                await createEmployeeChild.mutateAsync({
                  employeeDetailsId: employeeDetailsResult.id,
                  child
                });
              }
            }
          }

          // Vibration für mobile Geräte
          if (navigator.vibrate) {
            navigator.vibrate(50);
          }

          setIsFormOpen(false);
        }
      });
    }
  };

  // Helper function to get company type abbreviation
  const getCompanyTypeAbbreviation = (companyType: string) => {
    const abbreviations: Record<string, string> = {
      'GmbH': 'GmbH',
      'AG': 'AG',
      'Einzelunternehmen': 'EU',
      'Personengesellschaft': 'PG',
      'Kapitalgesellschaft': 'KG',
      'Genossenschaft': 'eG',
      'Stiftung': 'Stift.',
      'Verein': 'e.V.',
      'Kommanditgesellschaft': 'KG',
      'Offene Handelsgesellschaft': 'OHG',
      'Gesellschaft bürgerlichen Rechts': 'GbR',
      'Limited': 'Ltd.',
      'Unternehmergesellschaft': 'UG'
    };
    
    if (abbreviations[companyType]) {
      return abbreviations[companyType];
    }
    
    for (const [fullName, abbrev] of Object.entries(abbreviations)) {
      if (companyType.toLowerCase().includes(fullName.toLowerCase())) {
        return abbrev;
      }
    }
    
    return companyType.length > 3 ? companyType.substring(0, 3) + '.' : companyType;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline'; className: string }> = {
      aktiv: { 
        label: 'Aktiv', 
        variant: 'default',
        className: 'bg-success/10 text-success border-success/20'
      },
      inaktiv: { 
        label: 'Inaktiv', 
        variant: 'secondary',
        className: 'bg-muted text-muted-foreground border-muted'
      },
      potentiell: { 
        label: 'Potentiell', 
        variant: 'outline',
        className: 'bg-primary/10 text-primary border-primary/20'
      },
    };
    const config = statusConfig[status] || statusConfig.aktiv;
    return (
      <Badge 
        variant={config.variant} 
        className={`${config.className} font-medium border`}
      >
        {config.label}
      </Badge>
    );
  };

  // Handle add button click - reset form state
  const handleAddClick = () => {
    setDetailsOpen(false);
    setDeleteDialogOpen(false);
    setSelectedCompany(null);
    setSelectedPerson(null);
    setIsFormOpen(true);
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
        onTabChange={(tab) => setActiveTab(tab as 'all' | 'companies' | 'persons' | 'employees')}
        totalCount={totalCount}
        companiesCount={filteredCompanies.length}
        personsCount={filteredPersons.length}
        employeesCount={filteredEmployees.length}
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
            {activeTab === 'all' && (
              <ContactsCardsView
                companies={filteredCompanies}
                persons={filteredPersons}
                employees={filteredEmployees}
                showSections={true}
                isSearching={isSearching}
                hasNoResults={hasNoResults}
                onClearSearch={clearSearch}
                onCardClick={handleCardClick}
              />
            )}
            {activeTab === 'companies' && (
              <ContactsCardsView
                companies={filteredCompanies}
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
                persons={filteredPersons}
                showSections={true}
                isSearching={isSearching}
                hasNoResults={hasNoResults}
                onClearSearch={clearSearch}
                onCardClick={handleCardClick}
              />
            )}
            {activeTab === 'employees' && (
              <ContactsCardsView
                companies={[]}
                persons={[]}
                employees={filteredEmployees}
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
            {activeTab === 'all' && (
              <ContactsTableView
                companies={filteredCompanies}
                persons={filteredPersons}
                employees={filteredEmployees}
                showSections={true}
                isSearching={isSearching}
                hasNoResults={hasNoResults}
                onClearSearch={clearSearch}
                onCardClick={handleCardClick}
                getStatusBadge={getStatusBadge}
              />
            )}
            {activeTab === 'companies' && (
              <ContactsTableView
                companies={filteredCompanies}
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
                persons={filteredPersons}
                showSections={true}
                isSearching={isSearching}
                hasNoResults={hasNoResults}
                onClearSearch={clearSearch}
                onCardClick={handleCardClick}
                getStatusBadge={getStatusBadge}
              />
            )}
            {activeTab === 'employees' && (
              <ContactsTableView
                companies={[]}
                persons={[]}
                employees={filteredEmployees}
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
        company={selectedCompany}
        contactPerson={selectedPerson}
        onSubmitCompany={handleCompanySubmit}
        onSubmitPerson={handlePersonSubmit}
      />

      {/* Details Dialog */}
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
