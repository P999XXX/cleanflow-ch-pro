import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Users, Building2, Plus, Search, Edit, Trash2, Phone, Smartphone, Mail, MapPin, Grid3X3, List, X, Contact, Building, MessageCircle } from "lucide-react";
import { useCompanies, useCompanyMutations } from '@/hooks/useCompanies';
import { useContactPersons, useContactPersonMutations } from '@/hooks/useContactPersons';
import { ContactForm } from '@/components/Contacts/ContactForm';
import { useIsMobile } from '@/hooks/use-mobile';
import GoogleMap from '@/components/ui/google-map';

const Kontakte = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [formMode, setFormMode] = useState<'company' | 'person'>('company');
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

  // Company type mapping function - defined early to avoid hoisting issues
  const getFullCompanyType = (type: string): string => {
    const companyTypeMap: Record<string, string> = {
      'AG': 'Aktiengesellschaft',
      'GmbH': 'Gesellschaft mit beschränkter Haftung',
      'KG': 'Kommanditgesellschaft',
      'OHG': 'Offene Handelsgesellschaft',
      'Einzelunternehmen': 'Einzelunternehmen',
      'Genossenschaft': 'Genossenschaft',
      'Verein': 'Verein',
      'Stiftung': 'Stiftung',
      'Öffentlich': 'Öffentliche Einrichtung',
      'Sonstige': 'Sonstige'
    };
    return companyTypeMap[type] || type;
  };

  // Set default view mode based on device type
  React.useEffect(() => {
    if (!isMobile && viewMode === 'cards') {
      setViewMode('table');
    }
  }, [isMobile]);

  // Force cards view on mobile and tablet by default, desktop defaults to table
  const effectiveViewMode = isMobile ? 'cards' : viewMode;

  // Optimized filtering with useMemo for performance
  const filteredCompanies = useMemo(() => {
    if (!companies || !searchTerm.trim()) return companies || [];
    
    const term = searchTerm.toLowerCase().trim();
    return companies.filter(company =>
      company.name.toLowerCase().includes(term) ||
      company.email?.toLowerCase().includes(term) ||
      company.city?.toLowerCase().includes(term) ||
      company.address?.toLowerCase().includes(term) ||
      company.phone?.toLowerCase().includes(term)
    );
  }, [companies, searchTerm]);

  const filteredPersons = useMemo(() => {
    if (!contactPersons || !searchTerm.trim()) return contactPersons || [];
    
    const term = searchTerm.toLowerCase().trim();
    return contactPersons.filter(person =>
      `${person.first_name} ${person.last_name}`.toLowerCase().includes(term) ||
      person.email?.toLowerCase().includes(term) ||
      person.phone?.toLowerCase().includes(term) ||
      person.mobile?.toLowerCase().includes(term) ||
      person.position?.toLowerCase().includes(term) ||
      person.customer_companies?.name?.toLowerCase().includes(term)
    );
  }, [contactPersons, searchTerm]);

  const totalCount = filteredCompanies.length + filteredPersons.length;
  const isSearching = searchTerm.trim().length > 0;
  const hasNoResults = isSearching && totalCount === 0;

  // Clear search function
  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Handle card clicks to open details
  const handleCardClick = useCallback((item: any, type: 'company' | 'person') => {
    setSelectedItem(item);
    setItemType(type);
    setNavigationStack([]); // Clear navigation stack for new entry point
    setDetailsOpen(true);
  }, []);

  // Handle navigation between company and person details
  const handleNavigateToCompany = useCallback((companyId: string) => {
    const company = companies?.find(c => c.id === companyId);
    if (company) {
      // Push current item to navigation stack before navigating
      setNavigationStack(prev => [...prev, { item: selectedItem, type: itemType }]);
      setSelectedItem(company);
      setItemType('company');
    }
  }, [companies, selectedItem, itemType]);

  const handleNavigateToPerson = useCallback((person: any) => {
    // Find the full person data from contactPersons to ensure consistency
    const fullPersonData = contactPersons?.find(p => p.id === person.id);
    // Push current item to navigation stack before navigating
    setNavigationStack(prev => [...prev, { item: selectedItem, type: itemType }]);
    setSelectedItem(fullPersonData || person);
    setItemType('person');
  }, [contactPersons, selectedItem, itemType]);

  // Handle going back in navigation
  const handleGoBack = useCallback(() => {
    if (navigationStack.length > 0) {
      const previousItem = navigationStack[navigationStack.length - 1];
      setNavigationStack(prev => prev.slice(0, -1)); // Remove last item from stack
      setSelectedItem(previousItem.item);
      setItemType(previousItem.type);
    } else {
      // No previous item, close the dialog
      setDetailsOpen(false);
      setNavigationStack([]);
    }
  }, [navigationStack]);

  // Handle edit actions
  const handleEditItem = useCallback(() => {
    // Push current detail state to navigation stack before opening edit form
    setNavigationStack(prev => [...prev, { item: selectedItem, type: itemType }]);
    
    if (itemType === 'company') {
      setSelectedCompany(selectedItem);
      setFormMode('company');
    } else {
      setSelectedPerson(selectedItem);
      setFormMode('person');
    }
    setDetailsOpen(false);
    setIsFormOpen(true);
  }, [selectedItem, itemType]);

  // Handle form close - go back to details if there's a navigation stack
  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setSelectedCompany(null);
    setSelectedPerson(null);
    
    if (navigationStack.length > 0) {
      // Go back to the previous detail view
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
            setIsFormOpen(false); 
            setSelectedCompany(null);
            
            // Go back to details if there's a navigation stack
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
        onSuccess: () => setIsFormOpen(false)
      });
    }
  };

  const handlePersonSubmit = (personData) => {
    if (selectedPerson) {
      updateContactPerson.mutate(
        { id: selectedPerson.id, contactPerson: personData },
        { 
          onSuccess: () => { 
            setIsFormOpen(false); 
            setSelectedPerson(null);
            
            // Go back to details if there's a navigation stack
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
        onSuccess: () => setIsFormOpen(false)
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      aktiv: { 
        label: 'Aktiv', 
        variant: 'default' as const,
        className: 'bg-green-500/15 text-green-700 hover:bg-green-500/25 border-green-500/20 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20'
      },
      inaktiv: { 
        label: 'Inaktiv', 
        variant: 'secondary' as const,
        className: 'bg-gray-500/15 text-gray-700 hover:bg-gray-500/25 border-gray-500/20 dark:bg-gray-500/10 dark:text-gray-400 dark:hover:bg-gray-500/20'
      },
      potentiell: { 
        label: 'Potentiell', 
        variant: 'outline' as const,
        className: 'bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20'
      },
    };
    const config = statusConfig[status] || statusConfig.aktiv;
    return (
      <Badge 
        variant={config.variant} 
        className={`${config.className} font-medium`}
      >
        {config.label}
      </Badge>
    );
  };

  // Unified card component for consistent design
  const ContactCard = ({ item, type }: { item: any, type: 'company' | 'person' }) => (
    <Card 
      className="cursor-pointer hover:shadow-md transition-all duration-200 animate-fade-in hover-scale h-full flex flex-col"
      onClick={() => handleCardClick(item, type)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
             <h3 className="font-semibold text-lg truncate">
               {type === 'company' ? item.name : `${item.first_name} ${item.last_name}`}
             </h3>
             {type === 'company' ? (
               <div className="space-y-1">
                 {item.company_type && (
                   <p className="text-sm font-normal text-muted-foreground">{item.company_type}</p>
                 )}
                 {(item.city || item.postal_code) && (
                   <div className="flex items-center gap-1 text-sm text-muted-foreground">
                     <MapPin className="h-3 w-3 flex-shrink-0" />
                     <span className="truncate">
                       {item.city && item.postal_code ? `${item.postal_code} ${item.city}` : item.city || item.postal_code}
                     </span>
                   </div>
                 )}
               </div>
             ) : (
              <div className="space-y-1 mt-1">
                {item.title && (
                  <p className="text-sm text-muted-foreground truncate">{item.title}</p>
                )}
                {item.customer_companies?.name && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Building2 className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{item.customer_companies.name}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2 flex-wrap">
            {type === 'company' ? (
              <>
                {getStatusBadge(item.status)}
                {item.industry_category && (
                  <Badge 
                    variant="outline" 
                    className="bg-purple-500/15 text-purple-700 hover:bg-purple-500/25 border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-400 dark:hover:bg-purple-500/20 font-medium"
                  >
                    {item.industry_category}
                  </Badge>
                )}
                {item.contact_type && (
                  <Badge 
                    variant="outline" 
                    className="bg-orange-500/15 text-orange-700 hover:bg-orange-500/25 border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400 dark:hover:bg-orange-500/20 font-medium"
                  >
                    {item.contact_type}
                  </Badge>
                )}
              </>
            ) : (
              item.is_primary_contact && (
                <Badge variant="secondary" className="bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 font-medium">
                  Primär
                </Badge>
              )
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 flex-1 flex flex-col justify-end">
        <div className="flex flex-col gap-2 text-sm">
          {item.email && (
            <div className="flex items-center gap-2 min-w-0">
              <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <a 
                href={`mailto:${item.email}`} 
                className="text-foreground/70 hover:text-foreground transition-colors truncate"
                onClick={(e) => e.stopPropagation()}
                title={item.email}
              >
                {item.email}
              </a>
            </div>
          )}
          {item.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <a 
                href={`tel:${item.phone}`} 
                className="text-foreground/70 hover:text-foreground transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {item.phone}
              </a>
            </div>
          )}
          {item.mobile && (
            <div className="flex items-center gap-2">
              <Smartphone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <a 
                href={`tel:${item.mobile}`} 
                className="text-foreground/70 hover:text-foreground transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {item.mobile}
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Unified cards view component
  const CardsView = ({ companies, persons, showSections = false }: { companies: any[], persons: any[], showSections?: boolean }) => (
    <div className="space-y-6 animate-fade-in">
      {/* No results message */}
      {isSearching && hasNoResults && (
        <div className="text-center py-12 text-muted-foreground animate-fade-in">
          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-lg font-medium mb-2">Keine Ergebnisse gefunden</p>
          <p className="text-sm">Versuchen Sie einen anderen Suchbegriff</p>
          <Button variant="outline" className="mt-4" onClick={clearSearch}>
            Suche zurücksetzen
          </Button>
        </div>
      )}

      {/* Companies Section */}
      {companies.length > 0 && (
        <div className="space-y-4">
          {showSections && (
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Unternehmen
              <Badge variant="secondary" className="ml-2 rounded-full bg-primary/10 text-primary border-0 px-2 py-0.5 text-xs font-medium">
                {companies.length}
              </Badge>
            </h3>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {companies.map((company) => (
              <ContactCard key={`company-${company.id}`} item={company} type="company" />
            ))}
          </div>
        </div>
      )}

      {/* Persons Section */}
      {persons.length > 0 && (
        <div className="space-y-4">
          {showSections && (
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Kontaktpersonen
              <Badge variant="secondary" className="ml-2 rounded-full bg-primary/10 text-primary border-0 px-2 py-0.5 text-xs font-medium">
                {persons.length}
              </Badge>
            </h3>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {persons.map((person) => (
              <ContactCard key={`person-${person.id}`} item={person} type="person" />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Table view component
  const TableView = ({ companies, persons }: { companies: any[], persons: any[] }) => (
    <div className="space-y-8 animate-fade-in">
      {/* No results message */}
      {isSearching && hasNoResults && (
        <div className="text-center py-12 text-muted-foreground animate-fade-in">
          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-lg font-medium mb-2">Keine Ergebnisse gefunden</p>
          <p className="text-sm">Versuchen Sie einen anderen Suchbegriff</p>
          <Button variant="outline" className="mt-4" onClick={clearSearch}>
            Suche zurücksetzen
          </Button>
        </div>
      )}

      {/* Companies Table */}
      {companies.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Unternehmen
            <Badge variant="secondary" className="ml-2 rounded-full bg-primary/10 text-primary border-0 px-2 py-0.5 text-xs font-medium">
              {companies.length}
            </Badge>
          </h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Ort</TableHead>
                  <TableHead>Kontakt</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow 
                    key={company.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleCardClick(company, 'company')}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        {company.name}
                      </div>
                    </TableCell>
                    <TableCell>{company.company_type}</TableCell>
                    <TableCell>
                      {company.city && company.postal_code 
                        ? `${company.postal_code} ${company.city}` 
                        : company.city || company.postal_code || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {company.email && (
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {company.email}
                          </div>
                        )}
                        {company.phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {company.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(company.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCompany(company);
                            setFormMode('company');
                            setIsFormOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Persons Table */}
      {persons.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Kontaktpersonen
            <Badge variant="secondary" className="ml-2 rounded-full bg-primary/10 text-primary border-0 px-2 py-0.5 text-xs font-medium">
              {persons.length}
            </Badge>
          </h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Unternehmen</TableHead>
                  <TableHead>Kontakt</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {persons.map((person) => (
                  <TableRow 
                    key={person.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleCardClick(person, 'person')}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        {person.first_name} {person.last_name}
                      </div>
                    </TableCell>
                    <TableCell>{person.position || '-'}</TableCell>
                    <TableCell>{person.customer_companies?.name || '-'}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {person.email && (
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {person.email}
                          </div>
                        )}
                        {person.phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {person.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {person.is_primary_contact && (
                        <Badge variant="secondary" className="bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 font-medium">
                          Primär
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPerson(person);
                            setFormMode('person');
                            setIsFormOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Kontakte</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Geschäftskontakte und Kundendaten
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => { setFormMode('company'); setIsFormOpen(true); }} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Unternehmen hinzufügen
          </Button>
          <Button onClick={() => { setFormMode('person'); setIsFormOpen(true); }} variant="outline" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Person hinzufügen
          </Button>
        </div>
      </div>

      {/* Search and View Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Suche nach Namen, E-Mail, Ort..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1 h-7 w-7 p-0"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {!isMobile && (
              <div className="flex items-center gap-2">
                <Button
                  variant={effectiveViewMode === 'cards' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className="flex items-center gap-2"
                >
                  <Grid3X3 className="h-4 w-4" />
                  Karten
                </Button>
                <Button
                  variant={effectiveViewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="flex items-center gap-2"
                >
                  <List className="h-4 w-4" />
                  Tabelle
                </Button>
              </div>
            )}
          </div>

          {/* Results Summary */}
          {(companiesLoading || personsLoading) ? (
            <div className="mt-4 text-center text-muted-foreground">
              Lade Kontakte...
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <span>Gefunden: {totalCount} Kontakte</span>
              {filteredCompanies.length > 0 && (
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {filteredCompanies.length} Unternehmen
                </span>
              )}
              {filteredPersons.length > 0 && (
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {filteredPersons.length} Personen
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Contact className="h-4 w-4" />
            Alle Kontakte
          </TabsTrigger>
          <TabsTrigger value="companies" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Unternehmen
          </TabsTrigger>
          <TabsTrigger value="persons" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Personen
          </TabsTrigger>
        </TabsList>

        <div className="min-h-[400px]">
          {activeTab === 'all' && (
            <div className="space-y-6">
              {effectiveViewMode === 'cards' ? (
                <CardsView companies={filteredCompanies} persons={filteredPersons} showSections={true} />
              ) : (
                <TableView companies={filteredCompanies} persons={filteredPersons} />
              )}
            </div>
          )}

          {activeTab === 'companies' && (
            <div className="space-y-6">
              {effectiveViewMode === 'cards' ? (
                <CardsView companies={filteredCompanies} persons={[]} />
              ) : (
                <TableView companies={filteredCompanies} persons={[]} />
              )}
            </div>
          )}

          {activeTab === 'persons' && (
            <div className="space-y-6">
              {effectiveViewMode === 'cards' ? (
                <CardsView companies={[]} persons={filteredPersons} />
              ) : (
                <TableView companies={[]} persons={filteredPersons} />
              )}
            </div>
          )}
        </div>
      </Tabs>

      {/* Contact Form */}
      <ContactForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmitCompany={handleCompanySubmit}
        onSubmitPerson={handlePersonSubmit}
        company={selectedCompany}
        contactPerson={selectedPerson}
        initialMode={formMode}
      />

      {/* Details Dialog - Enhanced with Maps Header */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-6xl p-0">
          <div className="max-h-[80vh] overflow-y-auto">
            {/* Google Maps Header with Title Overlay - Only for companies with address */}
            {itemType === 'company' && selectedItem && (selectedItem.address || selectedItem.city) ? (
              <div className="relative w-full h-64">
                <GoogleMap
                  address={selectedItem.address}
                  postal_code={selectedItem.postal_code}
                  city={selectedItem.city}
                  country={selectedItem.country}
                  className="w-full h-full"
                />
                {/* Title Overlay on Map */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                      <div className="flex items-center gap-3 text-white">
                        <Building2 className="h-8 w-8 text-white drop-shadow-lg" />
                        <div className="flex flex-col">
                          <span className="text-2xl lg:text-3xl font-bold drop-shadow-lg">{selectedItem?.name}</span>
                          {selectedItem?.company_type && (
                            <span className="text-sm font-medium text-white/90 mt-1 drop-shadow">
                              ({getFullCompanyType(selectedItem.company_type)})
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {getStatusBadge(selectedItem.status)}
                        {selectedItem.industry_category && (
                          <Badge 
                            variant="outline" 
                            className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm font-medium"
                          >
                            {selectedItem.industry_category}
                          </Badge>
                        )}
                        {selectedItem.contact_type && (
                          <Badge 
                            variant="outline" 
                            className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm font-medium"
                          >
                            {selectedItem.contact_type}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Regular Header for Persons or Companies without Address */
              <DialogHeader className="pb-4 border-b px-6 pt-6">
                <DialogTitle className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pr-8">
                  <div className="flex items-center gap-3">
                    {itemType === 'company' ? (
                      <>
                        <Building2 className="h-6 w-6 text-primary" />
                        <div className="flex flex-col">
                          <span className="text-xl lg:text-2xl font-semibold">{selectedItem?.name}</span>
                          {selectedItem?.company_type && (
                            <span className="text-sm font-normal text-muted-foreground mt-1">
                              ({getFullCompanyType(selectedItem.company_type)})
                            </span>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <Users className="h-6 w-6 text-primary" />
                        <span className="text-xl lg:text-2xl font-semibold">
                          {selectedItem ? `${selectedItem.first_name} ${selectedItem.last_name}` : ''}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 lg:mr-2 flex-wrap">
                    {itemType === 'company' && selectedItem && (
                      <>
                        {getStatusBadge(selectedItem.status)}
                        {selectedItem.industry_category && (
                          <Badge 
                            variant="outline" 
                            className="bg-purple-500/15 text-purple-700 hover:bg-purple-500/25 border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-400 dark:hover:bg-purple-500/20 font-medium"
                          >
                            {selectedItem.industry_category}
                          </Badge>
                        )}
                        {selectedItem.contact_type && (
                          <Badge 
                            variant="outline" 
                            className="bg-orange-500/15 text-orange-700 hover:bg-orange-500/25 border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400 dark:hover:bg-orange-500/20 font-medium"
                          >
                            {selectedItem.contact_type}
                          </Badge>
                        )}
                      </>
                    )}
                    {itemType === 'person' && selectedItem?.is_primary_contact && (
                      <Badge variant="secondary" className="bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 font-medium">
                        Primärkontakt
                      </Badge>
                    )}
                  </div>
                </DialogTitle>
              </DialogHeader>
            )}
            
            {selectedItem && (
              <div className="space-y-6 animate-fade-in px-6 pb-6 pt-6">
                {itemType === 'company' ? (
                  <>
                    {/* Company Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedItem.email && (
                        <div className="flex items-center gap-2 p-2 bg-background rounded-md">
                          <Mail className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">E-Mail</p>
                             <a href={`mailto:${selectedItem.email}`} className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                               {selectedItem.email}
                             </a>
                          </div>
                        </div>
                      )}
                      {selectedItem.phone && (
                        <div className="flex items-center gap-2 p-2 bg-background rounded-md">
                          <Phone className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">Telefon</p>
                             <a href={`tel:${selectedItem.phone}`} className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                               {selectedItem.phone}
                             </a>
                          </div>
                        </div>
                      )}
                      {selectedItem.website && (
                        <div className="flex items-center gap-2 p-2 bg-background rounded-md">
                          <Building2 className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">Website</p>
                            <a 
                              href={selectedItem.website.startsWith('http') ? selectedItem.website : `https://${selectedItem.website}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-sm font-medium text-primary hover:underline transition-colors"
                            >
                              {selectedItem.website}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                     {/* Contact Persons */}
                     {selectedItem.contact_persons && selectedItem.contact_persons.length > 0 && (
                       <div className="bg-muted/80 rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Kontaktpersonen
                              <Badge variant="secondary" className="ml-2 rounded-full bg-primary/10 text-primary border-0 px-2 py-0.5 text-xs font-medium">
                                {selectedItem.contact_persons.length}
                              </Badge>
                            </h4>
                          </div>
                         <div className="grid gap-3">
                           {selectedItem.contact_persons.map((contact) => (
                             <div key={contact.id} className="bg-background rounded-lg p-3 border border-border/50 hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => handleNavigateToPerson(contact)}>
                               <div className="flex items-start justify-between">
                                 <div className="flex-1">
                                   <div className="flex items-center justify-between">
                                     <span className="font-medium text-sm text-foreground hover:text-primary transition-colors">
                                       {contact.first_name} {contact.last_name}
                                     </span>
                                     {contact.is_primary_contact && (
                                       <Badge variant="secondary" className="bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 font-medium text-xs">
                                         Primär
                                       </Badge>
                                     )}
                                   </div>
                                    <div className="flex flex-wrap items-center gap-1 mt-1 text-xs text-muted-foreground">
                                      {contact.position && <span>{contact.position}</span>}
                                    </div>
                                 </div>
                               </div>
                               {contact.notes && (
                                 <div className="mt-2 pt-2 border-t border-border/50">
                                   <p className="text-xs text-muted-foreground line-clamp-2">{contact.notes}</p>
                                 </div>
                               )}
                             </div>
                           ))}
                         </div>
                       </div>
                     )}

                     {/* Address */}
                    {(selectedItem.address || selectedItem.city || selectedItem.postal_code) && (
                      <div className="bg-muted/80 rounded-lg p-4 space-y-3">
                        <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
                          Adresse
                        </h4>
                        <div className="p-2 bg-background rounded-md">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-primary mt-0.5" />
                            <div className="text-sm">
                              {selectedItem.address && <div>{selectedItem.address}</div>}
                              <div>
                                {selectedItem.postal_code && selectedItem.city 
                                  ? `${selectedItem.postal_code} ${selectedItem.city}` 
                                  : selectedItem.postal_code || selectedItem.city}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Additional Info */}
                    {(selectedItem.vat_number || selectedItem.tax_number) && (
                      <div className="bg-muted/80 rounded-lg p-4 space-y-3">
                        <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
                          Zusätzliche Informationen
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedItem.vat_number && (
                            <div className="p-2 bg-background rounded-md">
                              <p className="text-xs text-muted-foreground">USt-IdNr.</p>
                              <p className="text-sm font-medium">{selectedItem.vat_number}</p>
                            </div>
                          )}
                          {selectedItem.tax_number && (
                            <div className="p-2 bg-background rounded-md">
                              <p className="text-xs text-muted-foreground">Steuernummer</p>
                              <p className="text-sm font-medium">{selectedItem.tax_number}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* Person Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedItem.position && (
                        <div className="p-2 bg-background rounded-md">
                          <p className="text-xs text-muted-foreground">Position</p>
                          <p className="text-sm font-medium">{selectedItem.position}</p>
                        </div>
                      )}
                      {selectedItem.customer_company_id && selectedItem.customer_companies && (
                        <div className="p-2 bg-background rounded-md">
                          <p className="text-xs text-muted-foreground">Unternehmen</p>
                          <button 
                            onClick={() => handleNavigateToCompany(selectedItem.customer_company_id)}
                            className="text-sm font-medium flex items-center gap-1 text-primary hover:underline cursor-pointer transition-colors"
                          >
                            <Building2 className="h-3 w-3" />
                            {selectedItem.customer_companies.name}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedItem.email && (
                        <div className="flex items-center gap-2 p-2 bg-background rounded-md">
                          <Mail className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">E-Mail</p>
                             <a href={`mailto:${selectedItem.email}`} className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                               {selectedItem.email}
                             </a>
                          </div>
                        </div>
                      )}
                      {selectedItem.phone && (
                        <div className="flex items-center gap-2 p-2 bg-background rounded-md">
                          <Phone className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">Telefon</p>
                             <a href={`tel:${selectedItem.phone}`} className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                               {selectedItem.phone}
                             </a>
                          </div>
                        </div>
                      )}
                      {selectedItem.mobile && (
                        <div className="flex items-center gap-2 p-2 bg-background rounded-md">
                          <MessageCircle className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="text-xs text-muted-foreground">WhatsApp</p>
                             <a 
                               href={`https://wa.me/${selectedItem.mobile.replace(/[^\d]/g, '').replace(/^0/, '41')}`} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                             >
                               {selectedItem.mobile}
                             </a>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Notes */}
                    {selectedItem.notes && (
                      <div className="bg-muted/80 rounded-lg p-4 space-y-3">
                        <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
                          Notizen
                        </h4>
                        <div className="p-2 bg-background rounded-md">
                          <p className="text-sm">{selectedItem.notes}</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            
            {/* Action Buttons at Bottom */}
            <div className="flex flex-col items-center gap-3 pt-4 border-t mt-6 px-6 pb-6">
              <Button onClick={handleEditItem} className="w-full flex items-center justify-center gap-2">
                <Edit className="h-4 w-4" />
                Bearbeiten
              </Button>
              <button 
                type="button" 
                onClick={handleGoBack}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                {navigationStack.length > 0 ? 'Zurück' : 'Schliessen'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
            <AlertDialogAction onClick={confirmDelete} className="w-full bg-destructive hover:bg-destructive/90">
              Löschen
            </AlertDialogAction>
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