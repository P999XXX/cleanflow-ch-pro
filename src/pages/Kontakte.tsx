import { useState, useMemo, useCallback } from 'react';
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{item: any, type: 'company' | 'person'} | null>(null);

  const isMobile = useIsMobile();
  const { data: companies, isLoading: companiesLoading } = useCompanies();
  const { data: contactPersons, isLoading: personsLoading } = useContactPersons();
  const { createCompany, updateCompany, deleteCompany } = useCompanyMutations();
  const { createContactPerson, updateContactPerson, deleteContactPerson } = useContactPersonMutations();

  // Force cards view on mobile and tablet by default, allow table on desktop
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
      person.department?.toLowerCase().includes(term) ||
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
    setDetailsOpen(true);
  }, []);

  // Handle navigation between company and person details
  const handleNavigateToCompany = useCallback((companyId: string) => {
    const company = companies?.find(c => c.id === companyId);
    if (company) {
      setSelectedItem(company);
      setItemType('company');
    }
  }, [companies]);

  const handleNavigateToPerson = useCallback((person: any) => {
    // Find the full person data from contactPersons to ensure consistency
    const fullPersonData = contactPersons?.find(p => p.id === person.id);
    setSelectedItem(fullPersonData || person);
    setItemType('person');
  }, [contactPersons]);

  // Handle edit actions
  const handleEditItem = useCallback(() => {
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
        { onSuccess: () => { setIsFormOpen(false); setSelectedCompany(null); } }
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
        { onSuccess: () => { setIsFormOpen(false); setSelectedPerson(null); } }
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
              (item.city || item.postal_code) && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">
                    {item.city && item.postal_code ? `${item.postal_code} ${item.city}` : item.city || item.postal_code}
                  </span>
                </div>
              )
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
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            {type === 'company' ? (
              getStatusBadge(item.status)
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
              Personen
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

  // Unified table view component
  const TableView = ({ companies, persons, showSections = false }: { companies: any[], persons: any[], showSections?: boolean }) => (
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

      {/* Companies Table */}
      {companies.length > 0 && (
        <div className="space-y-3">
          {showSections && (
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Unternehmen
              <Badge variant="secondary" className="ml-2 rounded-full bg-primary/10 text-primary border-0 px-2 py-0.5 text-xs font-medium">
                {companies.length}
              </Badge>
            </h3>
          )}
          <Card>
            <Table className="lg:table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="lg:w-1/4">Name</TableHead>
                  <TableHead className="lg:w-1/4">Ort</TableHead>
                  <TableHead className="lg:w-1/4">Kontakt</TableHead>
                  <TableHead className="text-right lg:w-1/4"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow 
                    key={company.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleCardClick(company, 'company')}
                  >
                    <TableCell className="font-medium lg:w-1/4 lg:whitespace-nowrap">{company.name}</TableCell>
                    <TableCell className="lg:w-1/4 lg:whitespace-nowrap">{company.city && company.postal_code ? `${company.postal_code} ${company.city}` : company.city || company.postal_code || '-'}</TableCell>
                    <TableCell className="lg:w-1/4 lg:whitespace-nowrap">
                      <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 lg:whitespace-nowrap">
                        {company.email && (
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            <a href={`mailto:${company.email}`} className="text-foreground/70 hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}>
                              {company.email}
                            </a>
                          </div>
                        )}
                        {company.phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            <a href={`tel:${company.phone}`} className="text-foreground/70 hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}>
                              {company.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right lg:w-1/4 lg:whitespace-nowrap">{getStatusBadge(company.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {/* Persons Table */}
      {persons.length > 0 && (
        <div className="space-y-3">
          {showSections && (
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Personen
              <Badge variant="secondary" className="ml-2 rounded-full bg-primary/10 text-primary border-0 px-2 py-0.5 text-xs font-medium">
                {persons.length}
              </Badge>
            </h3>
          )}
          <Card>
            <Table className="lg:table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="lg:w-1/4">Name</TableHead>
                  <TableHead className="lg:w-1/4">Unternehmen</TableHead>
                  <TableHead className="lg:w-1/4">Kontakt</TableHead>
                  <TableHead className="text-right lg:w-1/4">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {persons.map((person) => (
                  <TableRow 
                    key={person.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleCardClick(person, 'person')}
                  >
                    <TableCell className="font-medium lg:w-1/4 lg:whitespace-nowrap">
                      <div>
                        <div className="font-medium">{`${person.first_name} ${person.last_name}`}</div>
                        {person.title && <div className="text-sm text-muted-foreground">{person.title}</div>}
                      </div>
                    </TableCell>
                    <TableCell className="lg:w-1/4 lg:whitespace-nowrap">
                      {person.customer_companies?.name || '-'}
                    </TableCell>
                    <TableCell className="lg:w-1/4 lg:whitespace-nowrap">
                      <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 lg:whitespace-nowrap">
                        {person.email && (
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            <a href={`mailto:${person.email}`} className="text-foreground/70 hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}>
                              {person.email}
                            </a>
                          </div>
                        )}
                        {person.phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            <a href={`tel:${person.phone}`} className="text-foreground/70 hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}>
                              {person.phone}
                            </a>
                          </div>
                        )}
                        {person.mobile && (
                          <div className="flex items-center gap-1 text-sm">
                            <Smartphone className="h-3 w-3" />
                            <a href={`tel:${person.mobile}`} className="text-foreground/70 hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}>
                              {person.mobile}
                            </a>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right lg:w-1/4 lg:whitespace-nowrap">
                      {person.is_primary_contact && (
                        <Badge variant="secondary" className="bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 font-medium">
                          Primär
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* Header - Responsive */}
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-4 border-b">
        <div className="flex flex-col space-y-4">
          {/* Title */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Kontakte</h1>
            
            {/* Desktop: Right-aligned controls */}
            <div className="hidden lg:flex items-center gap-3">
              {/* View Mode Toggle - Desktop only */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
                className="flex items-center gap-2"
              >
                {viewMode === 'table' ? <Grid3X3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
              </Button>
              
              {/* Add Button - Desktop */}
              <Button
                onClick={() => {
                  if (activeTab === 'companies') {
                    setSelectedCompany(null);
                    setFormMode('company');
                  } else if (activeTab === 'persons') {
                    setSelectedPerson(null);
                    setFormMode('person');
                  } else {
                    setSelectedCompany(null);
                    setFormMode('company');
                  }
                  setIsFormOpen(true);
                }}
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Hinzufügen
              </Button>
            </div>
          </div>
        
          {/* Search */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Suchen nach Name, E-Mail, Telefon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-9 w-full"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Mobile/Tablet: Add Button after search, before tabs */}
          <div className="lg:hidden">
            <Button
              onClick={() => {
                if (activeTab === 'companies') {
                  setSelectedCompany(null);
                  setFormMode('company');
                } else if (activeTab === 'persons') {
                  setSelectedPerson(null);
                  setFormMode('person');
                } else {
                  setSelectedCompany(null);
                  setFormMode('company');
                }
                setIsFormOpen(true);
              }}
              size="sm"
              className="flex items-center gap-2 w-full"
            >
              <Plus className="h-4 w-4" />
              Hinzufügen
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full lg:w-auto">
              <TabsTrigger value="all" className="flex items-center gap-1 px-2">
                <Contact className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Alle</span>
                <Badge 
                  variant="secondary" 
                  className={`ml-0.5 rounded-full bg-primary/10 text-primary border-0 px-1.5 py-0.5 text-xs ${
                    activeTab === 'all' ? 'font-bold' : 'font-medium'
                  } hover:bg-primary/10`}
                >
                  {totalCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="companies" className="flex items-center gap-1 px-2">
                <Building className="h-4 w-4" />
                <span className="text-xs sm:text-sm">
                  <span className="hidden sm:inline">Unternehmen</span>
                  <span className="sm:hidden">Firma</span>
                </span>
                <Badge 
                  variant="secondary" 
                  className={`ml-0.5 rounded-full bg-primary/10 text-primary border-0 px-1.5 py-0.5 text-xs ${
                    activeTab === 'companies' ? 'font-bold' : 'font-medium'
                  } hover:bg-primary/10`}
                >
                  {filteredCompanies.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="persons" className="flex items-center gap-1 px-2">
                <Users className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Personen</span>
                <Badge 
                  variant="secondary" 
                  className={`ml-0.5 rounded-full bg-primary/10 text-primary border-0 px-1.5 py-0.5 text-xs ${
                    activeTab === 'persons' ? 'font-bold' : 'font-medium'
                  } hover:bg-primary/10`}
                >
                  {filteredPersons.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search Results Info - Mobile */}
          {isSearching && (
            <div className="text-sm text-muted-foreground flex items-center lg:hidden">
              {hasNoResults ? 'Keine Ergebnisse' : `${totalCount} Ergebnis${totalCount !== 1 ? 'se' : ''}`}
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="mt-4">
        {/* Dynamic Subtitle */}
        <div className="mb-4">
          <h2 className="text-lg font-medium text-muted-foreground">
            {activeTab === 'companies' ? 'Unternehmen' : activeTab === 'persons' ? 'Personen' : 'Alle anzeige'}
          </h2>
        </div>

        {/* Tab Content */}
        {activeTab === 'all' && (
          <div className="space-y-6">
            {effectiveViewMode === 'cards' ? (
              <CardsView companies={filteredCompanies} persons={filteredPersons} showSections={true} />
            ) : (
              <TableView companies={filteredCompanies} persons={filteredPersons} showSections={true} />
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

      {/* Contact Form */}
      <ContactForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmitCompany={handleCompanySubmit}
        onSubmitPerson={handlePersonSubmit}
        company={selectedCompany}
        contactPerson={selectedPerson}
        initialMode={formMode}
      />

      {/* Contact Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {itemType === 'company' ? <Building2 className="h-5 w-5" /> : <Users className="h-5 w-5" />}
              {itemType === 'company' 
                ? selectedItem?.name 
                : `${selectedItem?.first_name} ${selectedItem?.last_name}`
              }
            </DialogTitle>
            <DialogDescription>
              {itemType === 'company' ? 'Unternehmensdetails' : 'Kontaktperson Details'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Details & Map */}
              <div className="space-y-6">
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Kontaktinformationen</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {itemType === 'company' ? (
                      <>
                        {selectedItem.email && (
                          <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a href={`mailto:${selectedItem.email}`} className="text-primary hover:underline">
                              {selectedItem.email}
                            </a>
                          </div>
                        )}
                        {selectedItem.phone && (
                          <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <a href={`tel:${selectedItem.phone}`} className="text-primary hover:underline">
                              {selectedItem.phone}
                            </a>
                          </div>
                        )}
                        {selectedItem.address && (
                          <div className="flex items-start gap-3">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p>{selectedItem.address}</p>
                              <p>{selectedItem.postal_code} {selectedItem.city}</p>
                            </div>
                          </div>
                        )}
                        {selectedItem.website && (
                          <div className="flex items-center gap-3">
                            <MessageCircle className="h-4 w-4 text-muted-foreground" />
                            <a href={selectedItem.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              {selectedItem.website}
                            </a>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {selectedItem.title && (
                          <div className="flex items-center gap-3">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedItem.title}</span>
                          </div>
                        )}
                        {selectedItem.email && (
                          <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a href={`mailto:${selectedItem.email}`} className="text-primary hover:underline">
                              {selectedItem.email}
                            </a>
                          </div>
                        )}
                        {selectedItem.phone && (
                          <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <a href={`tel:${selectedItem.phone}`} className="text-primary hover:underline">
                              {selectedItem.phone}
                            </a>
                          </div>
                        )}
                        {selectedItem.mobile && (
                          <div className="flex items-center gap-3">
                            <Smartphone className="h-4 w-4 text-muted-foreground" />
                            <a href={`tel:${selectedItem.mobile}`} className="text-primary hover:underline">
                              {selectedItem.mobile}
                            </a>
                          </div>
                        )}
                        {selectedItem.customer_companies && (
                          <div className="flex items-center gap-3">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <button 
                              onClick={() => handleNavigateToCompany(selectedItem.customer_companies.id)}
                              className="text-primary hover:underline"
                            >
                              {selectedItem.customer_companies.name}
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Google Map for companies */}
                {itemType === 'company' && selectedItem.address && (
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold">Standort</h3>
                    </CardHeader>
                    <CardContent>
                      <GoogleMap
                        address={`${selectedItem.address}, ${selectedItem.postal_code} ${selectedItem.city}`}
                      />
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right Column - Related Data */}
              <div className="space-y-6">
                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleEditItem} className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Bearbeiten
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteItem} className="flex-1">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Löschen
                  </Button>
                </div>

                {/* Company: Show contact persons */}
                {itemType === 'company' && contactPersons && (
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold">Kontaktpersonen</h3>
                    </CardHeader>
                    <CardContent>
                      {contactPersons
                        .filter(person => person.customer_company_id === selectedItem.id)
                        .length > 0 ? (
                        <div className="space-y-3">
                          {contactPersons
                            .filter(person => person.customer_company_id === selectedItem.id)
                            .map(person => (
                              <div key={person.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">{person.first_name} {person.last_name}</p>
                                    {person.title && <p className="text-sm text-muted-foreground">{person.title}</p>}
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleNavigateToPerson(person)}
                                  >
                                    Anzeigen
                                  </Button>
                                </div>
                              </div>
                            ))
                          }
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Keine Kontaktpersonen vorhanden</p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kontakt löschen</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Der Kontakt wird permanent gelöscht und alle verknüpften Daten gehen verloren.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="w-full sm:w-auto bg-destructive hover:bg-destructive/90">
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Kontakte;