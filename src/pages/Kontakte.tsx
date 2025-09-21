import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Building2, Plus, Search, Edit, Trash2, Phone, Smartphone, Mail, MapPin, Grid3X3, List, X } from "lucide-react";
import { useCompanies, useCompanyMutations } from '@/hooks/useCompanies';
import { useContactPersons, useContactPersonMutations } from '@/hooks/useContactPersons';
import { ContactForm } from '@/components/Contacts/ContactForm';

const Kontakte = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [formMode, setFormMode] = useState<'company' | 'person'>('company');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const { data: companies, isLoading: companiesLoading } = useCompanies();
  const { data: contactPersons, isLoading: personsLoading } = useContactPersons();
  const { createCompany, updateCompany, deleteCompany } = useCompanyMutations();
  const { createContactPerson, updateContactPerson, deleteContactPerson } = useContactPersonMutations();

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

  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* Header - Made sticky */}
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-4 border-b">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Kontakte</h1>
          </div>
        
        {/* Desktop: Single row layout */}
        <div className="hidden lg:flex items-center gap-4 w-full lg:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Suchen nach Name, E-Mail, Telefon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-9 w-80 transition-all duration-200 focus:w-96"
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
          
          {/* Search Results Info */}
          {isSearching && (
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              {hasNoResults ? 'Keine Ergebnisse' : `${totalCount} Ergebnis${totalCount !== 1 ? 'se' : ''}`}
            </div>
          )}
          
           <Tabs value={activeTab} onValueChange={setActiveTab}>
             <TabsList className="grid grid-cols-3">
               <TabsTrigger value="all" className="flex items-center gap-2">
                 <Users className="h-5 w-5" />
                 <span>Alle</span>
                 <Badge variant="secondary" className="ml-2 rounded-full bg-primary/10 text-primary border-0 px-2 py-0.5 text-xs font-medium">
                   {totalCount}
                 </Badge>
               </TabsTrigger>
               <TabsTrigger value="companies" className="flex items-center gap-2">
                 <Building2 className="h-5 w-5" />
                 <span>Unternehmen</span>
                 <Badge variant="secondary" className="ml-2 rounded-full bg-primary/10 text-primary border-0 px-2 py-0.5 text-xs font-medium">
                   {filteredCompanies.length}
                 </Badge>
               </TabsTrigger>
               <TabsTrigger value="persons" className="flex items-center gap-2">
                 <Users className="h-5 w-5" />
                 <span>Personen</span>
                 <Badge variant="secondary" className="ml-2 rounded-full bg-primary/10 text-primary border-0 px-2 py-0.5 text-xs font-medium">
                   {filteredPersons.length}
                 </Badge>
               </TabsTrigger>
             </TabsList>
           </Tabs>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
              className="flex items-center gap-2"
              disabled={activeTab === 'all'}
            >
              {viewMode === 'table' ? <Grid3X3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
              {viewMode === 'table' ? 'Karten' : 'Tabelle'}
            </Button>
            
            <Button
              onClick={() => {
                if (activeTab === 'companies') {
                  setSelectedCompany(null);
                  setFormMode('company');
                } else if (activeTab === 'persons') {
                  setSelectedPerson(null);
                  setFormMode('person');
                } else {
                  // For 'all' tab, default to company
                  setSelectedCompany(null);
                  setFormMode('company');
                }
                setIsFormOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Hinzufügen
            </Button>
          </div>
        </div>
        
        {/* Mobile: Stacked layout */}
        <div className="lg:hidden flex flex-col gap-4 w-full">
          <div className="relative">
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
          
          {/* Search Results Info */}
          {isSearching && (
            <div className="text-sm text-muted-foreground text-center">
              {hasNoResults ? 'Keine Ergebnisse gefunden' : `${totalCount} Ergebnis${totalCount !== 1 ? 'se' : ''} gefunden`}
            </div>
          )}
          
          {/* Full width button on mobile */}
          <Button
            onClick={() => {
              if (activeTab === 'companies') {
                setSelectedCompany(null);
                setFormMode('company');
              } else if (activeTab === 'persons') {
                setSelectedPerson(null);
                setFormMode('person');
              } else {
                // For 'all' tab, default to company
                setSelectedCompany(null);
                setFormMode('company');
              }
              setIsFormOpen(true);
            }}
            className="flex items-center justify-center gap-2 w-full"
          >
            <Plus className="h-4 w-4" />
            Hinzufügen
          </Button>
          
           <Tabs value={activeTab} onValueChange={setActiveTab}>
             <TabsList className="grid w-full grid-cols-3">
               <TabsTrigger value="all" className="flex items-center gap-2">
                 <Users className="h-5 w-5" />
                 <span>Alle</span>
                 <Badge variant="secondary" className="ml-2 rounded-full bg-primary/10 text-primary border-0 px-2 py-0.5 text-xs font-medium">
                   {totalCount}
                 </Badge>
               </TabsTrigger>
               <TabsTrigger value="companies" className="flex items-center gap-2">
                 <Building2 className="h-5 w-5" />
                 <span>Unternehmen</span>
                 <Badge variant="secondary" className="ml-2 rounded-full bg-primary/10 text-primary border-0 px-2 py-0.5 text-xs font-medium">
                   {filteredCompanies.length}
                 </Badge>
               </TabsTrigger>
               <TabsTrigger value="persons" className="flex items-center gap-2">
                 <Users className="h-5 w-5" />
                 <span>Personen</span>
                 <Badge variant="secondary" className="ml-2 rounded-full bg-primary/10 text-primary border-0 px-2 py-0.5 text-xs font-medium">
                   {filteredPersons.length}
                 </Badge>
               </TabsTrigger>
             </TabsList>
           </Tabs>
        </div>
        </div>
      </div>

      {/* Mobile Only Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="lg:hidden">
        <div className="hidden">
          <TabsList>
            <TabsTrigger value="all">Alle</TabsTrigger>
            <TabsTrigger value="companies">Unternehmen</TabsTrigger>
            <TabsTrigger value="persons">Personen</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all">
          {/* Mobile Combined View */}
          <div className="space-y-6">
            {/* Companies Section */}
            {filteredCompanies.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Unternehmen ({filteredCompanies.length})
                </h3>
                <div className="space-y-4">
                  {filteredCompanies.map((company) => (
                    <Card key={`company-${company.id}`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{company.name}</h3>
                            {(company.city || company.postal_code) && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                <MapPin className="h-3 w-3" />
                                {company.city && company.postal_code ? `${company.postal_code} ${company.city}` : company.city || company.postal_code}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedCompany(company);
                                setFormMode('company');
                                setIsFormOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteCompany.mutate(company.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {company.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <a href={`mailto:${company.email}`} className="text-primary hover:underline">
                                {company.email}
                              </a>
                            </div>
                          )}
                          {company.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <a href={`tel:${company.phone}`} className="text-primary hover:underline">
                                {company.phone}
                              </a>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            {getStatusBadge(company.status)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Persons Section */}
            {filteredPersons.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Personen ({filteredPersons.length})
                </h3>
                <div className="space-y-4">
                  {filteredPersons.map((person) => (
                    <Card key={`person-${person.id}`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">
                              {`${person.first_name} ${person.last_name}`}
                            </h3>
                            {person.title && (
                              <p className="text-sm text-muted-foreground mt-1">{person.title}</p>
                            )}
                            {person.customer_companies?.name && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                <Building2 className="h-3 w-3" />
                                {person.customer_companies.name}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedPerson(person);
                                setFormMode('person');
                                setIsFormOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteContactPerson.mutate(person.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {person.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <a href={`mailto:${person.email}`} className="text-primary hover:underline">
                                {person.email}
                              </a>
                            </div>
                          )}
                          {person.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <a href={`tel:${person.phone}`} className="text-primary hover:underline">
                                {person.phone}
                              </a>
                            </div>
                          )}
                          {person.mobile && (
                            <div className="flex items-center gap-2 text-sm">
                              <Smartphone className="h-4 w-4 text-muted-foreground" />
                              <a href={`tel:${person.mobile}`} className="text-primary hover:underline">
                                {person.mobile}
                              </a>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            {person.is_primary_contact && <Badge variant="default">Primär</Badge>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {hasNoResults && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg mb-2">Keine Ergebnisse gefunden</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Versuchen Sie andere Suchbegriffe oder{' '}
                    <button onClick={clearSearch} className="text-primary hover:underline">
                      löschen Sie die Suche
                    </button>
                  </p>
                </CardContent>
              </Card>
            )}

            {!isSearching && filteredCompanies.length === 0 && filteredPersons.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg mb-2">Noch keine Kontakte</p>
                  <p className="text-sm text-muted-foreground">
                    Fügen Sie Ihren ersten Kontakt hinzu, um zu beginnen.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="companies">
          {/* Mobile Companies with Title */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Unternehmen ({filteredCompanies.length})
            </h3>
            
            {companiesLoading ? (
              <Card>
                <CardContent className="p-4">
                  <p className="text-center">Lädt...</p>
                </CardContent>
              </Card>
            ) : filteredCompanies.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  {isSearching ? (
                    <div className="flex flex-col items-center gap-4">
                      <Search className="h-12 w-12 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground text-lg mb-2">Keine Unternehmen gefunden</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Versuchen Sie andere Suchbegriffe oder{' '}
                          <button onClick={clearSearch} className="text-primary hover:underline">
                            löschen Sie die Suche
                          </button>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <Building2 className="h-12 w-12 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground text-lg mb-2">Noch keine Unternehmen</p>
                        <p className="text-sm text-muted-foreground">
                          Fügen Sie Ihr erstes Unternehmen hinzu, um zu beginnen.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredCompanies.map((company) => (
                  <Card key={company.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{company.name}</h3>
                          {(company.city || company.postal_code) && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3" />
                              {company.city && company.postal_code ? `${company.postal_code} ${company.city}` : company.city || company.postal_code}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedCompany(company);
                              setFormMode('company');
                              setIsFormOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteCompany.mutate(company.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {company.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a href={`mailto:${company.email}`} className="text-primary hover:underline">
                              {company.email}
                            </a>
                          </div>
                        )}
                        {company.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <a href={`tel:${company.phone}`} className="text-primary hover:underline">
                              {company.phone}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          {getStatusBadge(company.status)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="persons">
          {/* Mobile Persons with Title */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Personen ({filteredPersons.length})
            </h3>
            
            {personsLoading ? (
              <Card>
                <CardContent className="p-4">
                  <p className="text-center">Lädt...</p>
                </CardContent>
              </Card>
            ) : filteredPersons.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  {isSearching ? (
                    <div className="flex flex-col items-center gap-4">
                      <Search className="h-12 w-12 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground text-lg mb-2">Keine Personen gefunden</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Versuchen Sie andere Suchbegriffe oder{' '}
                          <button onClick={clearSearch} className="text-primary hover:underline">
                            löschen Sie die Suche
                          </button>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <Users className="h-12 w-12 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground text-lg mb-2">Noch keine Personen</p>
                        <p className="text-sm text-muted-foreground">
                          Fügen Sie Ihre erste Person hinzu, um zu beginnen.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredPersons.map((person) => (
                  <Card key={person.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {`${person.first_name} ${person.last_name}`}
                          </h3>
                          {person.title && (
                            <p className="text-sm text-muted-foreground mt-1">{person.title}</p>
                          )}
                          {person.customer_companies?.name && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                              <Building2 className="h-3 w-3" />
                              {person.customer_companies.name}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedPerson(person);
                              setFormMode('person');
                              setIsFormOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteContactPerson.mutate(person.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {person.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a href={`mailto:${person.email}`} className="text-primary hover:underline">
                              {person.email}
                            </a>
                          </div>
                        )}
                        {person.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <a href={`tel:${person.phone}`} className="text-primary hover:underline">
                              {person.phone}
                            </a>
                          </div>
                        )}
                        {person.mobile && (
                          <div className="flex items-center gap-2 text-sm">
                            <Smartphone className="h-4 w-4 text-muted-foreground" />
                            <a href={`tel:${person.mobile}`} className="text-primary hover:underline">
                              {person.mobile}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          {person.is_primary_contact && <Badge variant="default">Primär</Badge>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Desktop Only Tabs */}
      <div className="hidden lg:block">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="all">
            {/* Desktop Combined View - Cards Only */}
            <div className="space-y-6">
              {/* Companies Section */}
              {filteredCompanies.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Unternehmen ({filteredCompanies.length})
                  </h3>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {filteredCompanies.map((company) => (
                      <Card key={`company-${company.id}`}>
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{company.name}</h3>
                              {(company.city || company.postal_code) && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                  <MapPin className="h-3 w-3" />
                                  {company.city && company.postal_code ? `${company.postal_code} ${company.city}` : company.city || company.postal_code}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedCompany(company);
                                  setFormMode('company');
                                  setIsFormOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteCompany.mutate(company.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            {company.email && (
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <a href={`mailto:${company.email}`} className="text-primary hover:underline">
                                  {company.email}
                                </a>
                              </div>
                            )}
                            {company.phone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <a href={`tel:${company.phone}`} className="text-primary hover:underline">
                                  {company.phone}
                                </a>
                              </div>
                            )}
                            <div className="flex items-center justify-between">
                              {getStatusBadge(company.status)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Persons Section */}
              {filteredPersons.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Personen ({filteredPersons.length})
                  </h3>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {filteredPersons.map((person) => (
                      <Card key={`person-${person.id}`}>
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">
                                {`${person.first_name} ${person.last_name}`}
                              </h3>
                              {person.title && (
                                <p className="text-sm text-muted-foreground mt-1">{person.title}</p>
                              )}
                              {person.customer_companies?.name && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                  <Building2 className="h-3 w-3" />
                                  {person.customer_companies.name}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedPerson(person);
                                  setFormMode('person');
                                  setIsFormOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteContactPerson.mutate(person.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            {person.email && (
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <a href={`mailto:${person.email}`} className="text-primary hover:underline">
                                  {person.email}
                                </a>
                              </div>
                            )}
                            {person.phone && (
                              <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                                <a href={`tel:${person.phone}`} className="text-primary hover:underline">
                                  {person.phone}
                                </a>
                              </div>
                            )}
                            {person.mobile && (
                              <div className="flex items-center gap-2 text-sm">
                                <Smartphone className="h-4 w-4 text-muted-foreground" />
                                <a href={`tel:${person.mobile}`} className="text-primary hover:underline">
                                  {person.mobile}
                                </a>
                              </div>
                            )}
                            <div className="flex items-center justify-between">
                              {person.is_primary_contact && <Badge variant="default">Primär</Badge>}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {hasNoResults && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg mb-2">Keine Ergebnisse gefunden</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Versuchen Sie andere Suchbegriffe oder{' '}
                      <button onClick={clearSearch} className="text-primary hover:underline">
                        löschen Sie die Suche
                      </button>
                    </p>
                  </CardContent>
                </Card>
              )}

              {!isSearching && filteredCompanies.length === 0 && filteredPersons.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg mb-2">Noch keine Kontakte</p>
                    <p className="text-sm text-muted-foreground">
                      Fügen Sie Ihren ersten Kontakt hinzu, um zu beginnen.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="companies">
            {/* Desktop Companies with Title */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Unternehmen ({filteredCompanies.length})
              </h3>
              
              {/* Desktop Table View */}
              <div className={`${viewMode === 'cards' ? 'hidden' : 'block'}`}>
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Ort</TableHead>
                        <TableHead>Kontakt</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aktionen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {companiesLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">Lädt...</TableCell>
                        </TableRow>
                      ) : filteredCompanies.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            {isSearching ? (
                              <div className="flex flex-col items-center gap-2">
                                <Search className="h-8 w-8 text-muted-foreground" />
                                <p className="text-muted-foreground">Keine Unternehmen gefunden</p>
                                <button onClick={clearSearch} className="text-sm text-primary hover:underline">
                                  Suche löschen
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-2">
                                <Building2 className="h-8 w-8 text-muted-foreground" />
                                <p className="text-muted-foreground">Noch keine Unternehmen</p>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCompanies.map((company) => (
                          <TableRow key={company.id}>
                            <TableCell className="font-medium">{company.name}</TableCell>
                            <TableCell>{company.city && company.postal_code ? `${company.postal_code} ${company.city}` : company.city || company.postal_code || '-'}</TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
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
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedCompany(company);
                                    setFormMode('company');
                                    setIsFormOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteCompany.mutate(company.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </Card>
              </div>

              {/* Desktop Card View */}
              <div className={`${viewMode === 'table' ? 'hidden' : 'block'}`}>
                {companiesLoading ? (
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-center">Lädt...</p>
                    </CardContent>
                  </Card>
                ) : filteredCompanies.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      {isSearching ? (
                        <div className="flex flex-col items-center gap-4">
                          <Search className="h-12 w-12 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground text-lg mb-2">Keine Unternehmen gefunden</p>
                            <p className="text-sm text-muted-foreground mb-4">
                              Versuchen Sie andere Suchbegriffe oder{' '}
                              <button onClick={clearSearch} className="text-primary hover:underline">
                                löschen Sie die Suche
                              </button>
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-4">
                          <Building2 className="h-12 w-12 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground text-lg mb-2">Noch keine Unternehmen</p>
                            <p className="text-sm text-muted-foreground">
                              Fügen Sie Ihr erstes Unternehmen hinzu, um zu beginnen.
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {filteredCompanies.map((company) => (
                      <Card key={company.id}>
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{company.name}</h3>
                              {(company.city || company.postal_code) && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                  <MapPin className="h-3 w-3" />
                                  {company.city && company.postal_code ? `${company.postal_code} ${company.city}` : company.city || company.postal_code}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedCompany(company);
                                  setFormMode('company');
                                  setIsFormOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteCompany.mutate(company.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            {company.email && (
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <a href={`mailto:${company.email}`} className="text-primary hover:underline">
                                  {company.email}
                                </a>
                              </div>
                            )}
                            {company.phone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <a href={`tel:${company.phone}`} className="text-primary hover:underline">
                                  {company.phone}
                                </a>
                              </div>
                            )}
                            <div className="flex items-center justify-between">
                              {getStatusBadge(company.status)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="persons">
            {/* Desktop Persons with Title */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5" />
                Personen ({filteredPersons.length})
              </h3>
              
              {/* Desktop Table View */}
              <div className={`${viewMode === 'cards' ? 'hidden' : 'block'}`}>
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Unternehmen</TableHead>
                        <TableHead>Kontakt</TableHead>
                        <TableHead>Primär</TableHead>
                        <TableHead>Aktionen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {personsLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">Lädt...</TableCell>
                        </TableRow>
                      ) : filteredPersons.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            {isSearching ? (
                              <div className="flex flex-col items-center gap-2">
                                <Search className="h-8 w-8 text-muted-foreground" />
                                <p className="text-muted-foreground">Keine Personen gefunden</p>
                                <button onClick={clearSearch} className="text-sm text-primary hover:underline">
                                  Suche löschen
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-2">
                                <Users className="h-8 w-8 text-muted-foreground" />
                                <p className="text-muted-foreground">Noch keine Personen</p>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredPersons.map((person) => (
                          <TableRow key={person.id}>
                            <TableCell className="font-medium">
                              <div>
                                {`${person.first_name} ${person.last_name}`}
                                {person.title && <div className="text-sm text-muted-foreground">{person.title}</div>}
                              </div>
                            </TableCell>
                            <TableCell>{person.customer_companies?.name || '-'}</TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
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
                                {person.mobile && (
                                  <div className="flex items-center gap-1 text-sm">
                                    <Smartphone className="h-3 w-3" />
                                    {person.mobile}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {person.is_primary_contact && <Badge variant="default">Primär</Badge>}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedPerson(person);
                                    setFormMode('person');
                                    setIsFormOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteContactPerson.mutate(person.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </Card>
              </div>

              {/* Desktop Card View */}
              <div className={`${viewMode === 'table' ? 'hidden' : 'block'}`}>
                {personsLoading ? (
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-center">Lädt...</p>
                    </CardContent>
                  </Card>
                ) : filteredPersons.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      {isSearching ? (
                        <div className="flex flex-col items-center gap-4">
                          <Search className="h-12 w-12 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground text-lg mb-2">Keine Personen gefunden</p>
                            <p className="text-sm text-muted-foreground mb-4">
                              Versuchen Sie andere Suchbegriffe oder{' '}
                              <button onClick={clearSearch} className="text-primary hover:underline">
                                löschen Sie die Suche
                              </button>
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-4">
                          <Users className="h-12 w-12 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground text-lg mb-2">Noch keine Personen</p>
                            <p className="text-sm text-muted-foreground">
                              Fügen Sie Ihre erste Person hinzu, um zu beginnen.
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {filteredPersons.map((person) => (
                      <Card key={person.id}>
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">
                                {`${person.first_name} ${person.last_name}`}
                              </h3>
                              {person.title && (
                                <p className="text-sm text-muted-foreground mt-1">{person.title}</p>
                              )}
                              {person.customer_companies?.name && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                  <Building2 className="h-3 w-3" />
                                  {person.customer_companies.name}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedPerson(person);
                                  setFormMode('person');
                                  setIsFormOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteContactPerson.mutate(person.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            {person.email && (
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <a href={`mailto:${person.email}`} className="text-primary hover:underline">
                                  {person.email}
                                </a>
                              </div>
                            )}
                            {person.phone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <a href={`tel:${person.phone}`} className="text-primary hover:underline">
                                  {person.phone}
                                </a>
                              </div>
                            )}
                            {person.mobile && (
                              <div className="flex items-center gap-2 text-sm">
                                <Smartphone className="h-4 w-4 text-muted-foreground" />
                                <a href={`tel:${person.mobile}`} className="text-primary hover:underline">
                                  {person.mobile}
                                </a>
                              </div>
                            )}
                            <div className="flex items-center justify-between">
                              {person.is_primary_contact && <Badge variant="default">Primär</Badge>}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Contact Form Modal */}
      <ContactForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedCompany(null);
          setSelectedPerson(null);
        }}
        onSubmitCompany={handleCompanySubmit}
        onSubmitPerson={handlePersonSubmit}
        company={selectedCompany}
        contactPerson={selectedPerson}
        initialMode={formMode}
      />
    </div>
  );
};

export default Kontakte;