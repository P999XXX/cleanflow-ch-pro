import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useCompanies, useCompanyMutations, CustomerCompany, CustomerCompanyInput } from '@/hooks/useCompanies';
import { useContactPersons, useContactPersonMutations, ContactPerson, ContactPersonInput } from '@/hooks/useContactPersons';
import { useAllContacts } from '@/hooks/useAllContacts';
import { useEdgeFunctionContactSave } from '@/hooks/useContactSave';
import { useUserRole } from '@/hooks/useUserRole';
import { RoleGuard } from '@/components/Auth/RoleGuard';
import { ContactForm } from '@/components/Contacts/ContactForm';
import { ContactsFilters } from '@/components/Contacts/ContactsFilters';
import { ContactsCardsView } from '@/components/Contacts/ContactsCardsView';
import { ContactsTableView } from '@/components/Contacts/ContactsTableView';
import { ContactDetailsDialog } from '@/components/Contacts/ContactDetailsDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { NavigationStackItem, DeleteItem, ViewMode } from '@/types/contacts';

const Kontakte = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [contactTypeFilter, setContactTypeFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CustomerCompany | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<ContactPerson | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [itemType, setItemType] = useState<'company' | 'person'>('company');
  const [navigationStack, setNavigationStack] = useState<NavigationStackItem[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<DeleteItem | null>(null);

  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const { data: companies, isLoading: companiesLoading } = useCompanies();
  const { data: contactPersons, isLoading: personsLoading } = useContactPersons();
  const { data: allContacts } = useAllContacts();
  const { createCompany, updateCompany, deleteCompany } = useCompanyMutations();
  const { deleteContactPerson } = useContactPersonMutations();
  const saveContactMutation = useEdgeFunctionContactSave();
  const { canManageContacts } = useUserRole();

  // Status update mutations
  const updateCompanyStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('customer_companies')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['allContacts'] });
      toast({ title: "Status erfolgreich aktualisiert" });
    },
    onError: (error) => {
      console.error('Error updating company status:', error);
      toast({ 
        title: "Fehler beim Aktualisieren", 
        description: "Der Status konnte nicht aktualisiert werden.",
        variant: "destructive" 
      });
    },
  });

  const updatePersonStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('contact_persons')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactPersons'] });
      queryClient.invalidateQueries({ queryKey: ['allContacts'] });
      toast({ title: "Status erfolgreich aktualisiert" });
    },
    onError: (error) => {
      console.error('Error updating person status:', error);
      toast({ 
        title: "Fehler beim Aktualisieren", 
        description: "Der Status konnte nicht aktualisiert werden.",
        variant: "destructive" 
      });
    },
  });

  // Handle URL parameters for filtering (e.g., ?type=kunde)
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam) {
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

  // Available contact types for filters - unified system
  const availableContactTypes = useMemo(() => {
    return ['Unternehmen', 'Geschäftskunde', 'Privatkunde', 'Mitarbeiter', 'Person'];
  }, []);

  // Optimized filtering with useMemo for performance - unified contacts
  const filteredAllContacts = useMemo(() => {
    if (!allContacts) return [];
    
    let filtered = allContacts;
    
    // Filter by contact type
    if (contactTypeFilter !== 'all') {
      const selectedTypes = contactTypeFilter.split(',');
      filtered = filtered.filter(contact => 
        selectedTypes.includes(contact.contact_type)
      );
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(term) ||
        contact.email?.toLowerCase().includes(term) ||
        contact.phone?.toLowerCase().includes(term) ||
        contact.mobile?.toLowerCase().includes(term) ||
        contact.address?.toLowerCase().includes(term) ||
        contact.city?.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }, [allContacts, searchTerm, contactTypeFilter]);

  // Separate contacts by type for display
  const filteredCompanies = useMemo(() => 
    filteredAllContacts.filter(c => c.type === 'company'), 
    [filteredAllContacts]
  );

  const filteredPersons = useMemo(() => 
    filteredAllContacts.filter(c => c.type === 'person'), 
    [filteredAllContacts]
  );

  const totalCount = filteredAllContacts.length;
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

  const handleNavigateToPerson = useCallback((person: ContactPerson) => {
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

  const handleStatusUpdate = async (item: any, type: 'company' | 'person', newStatus: string) => {
    if (type === 'company') {
      await updateCompanyStatusMutation.mutateAsync({
        id: item.id,
        status: newStatus
      });
      // Update selected item to reflect new status
      setSelectedItem({ ...item, status: newStatus });
    } else {
      await updatePersonStatusMutation.mutateAsync({
        id: item.id,
        status: newStatus
      });
      // Update selected item to reflect new status
      setSelectedItem({ ...item, status: newStatus });
    }
  };

  const handleCompanySubmit = (companyData: CustomerCompanyInput) => {
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

  const handlePersonSubmit = async (personData: ContactPersonInput, employeeDetails?: any, children?: any[]) => {
    // CRITICAL FIX: Use Edge Function for atomic transaction
    const payload = {
      contact: {
        ...personData,
        id: selectedPerson?.id,
      },
      employee_details: personData.is_employee ? employeeDetails : undefined,
      children: personData.is_employee && children ? children : undefined,
    };

    await saveContactMutation.mutateAsync(payload, {
      onSuccess: () => {
        setIsFormOpen(false);
        setSelectedPerson(null);

        if (navigationStack.length > 0) {
          const previousItem = navigationStack[navigationStack.length - 1];
          setNavigationStack(prev => prev.slice(0, -1));
          setSelectedItem(previousItem.item);
          setItemType(previousItem.type);
          setDetailsOpen(true);
        }
      },
    });
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
        viewMode={viewMode}
        onViewModeToggle={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
        onAddClick={canManageContacts() ? handleAddClick : undefined}
        isMobile={isMobile}
        availableContactTypes={availableContactTypes}
      />

      {/* Main Content */}
      <div className="mt-6">
        {effectiveViewMode === 'cards' ? (
          <ContactsCardsView
            companies={filteredCompanies}
            persons={filteredPersons}
            showSections={true}
            isSearching={isSearching}
            hasNoResults={hasNoResults}
            onClearSearch={clearSearch}
            onCardClick={handleCardClick}
          />
        ) : (
          <ContactsTableView
            companies={filteredCompanies}
            persons={filteredPersons}
            showSections={true}
            isSearching={isSearching}
            hasNoResults={hasNoResults}
            onClearSearch={clearSearch}
            onCardClick={handleCardClick}
            getStatusBadge={getStatusBadge}
          />
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
        onEdit={canManageContacts() ? handleEditItem : undefined}
        onDelete={canManageContacts() ? handleDeleteItem : undefined}
        onGoBack={handleGoBack}
        onNavigateToCompany={handleNavigateToCompany}
        onNavigateToPerson={handleNavigateToPerson}
        getStatusBadge={getStatusBadge}
        getCompanyTypeAbbreviation={getCompanyTypeAbbreviation}
        onStatusUpdate={canManageContacts() ? handleStatusUpdate : undefined}
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
