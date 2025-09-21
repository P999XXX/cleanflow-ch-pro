import { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Building2, Plus, Search, Edit, Trash2, Phone, Mail, MapPin } from "lucide-react";
import { useCompanies, useCompanyMutations } from '@/hooks/useCompanies';
import { useContactPersons, useContactPersonMutations } from '@/hooks/useContactPersons';
import { ContactForm } from '@/components/Contacts/ContactForm';

const Kontakte = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('companies');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [formMode, setFormMode] = useState<'company' | 'person'>('company');

  const { data: companies, isLoading: companiesLoading } = useCompanies();
  const { data: contactPersons, isLoading: personsLoading } = useContactPersons();
  const { createCompany, updateCompany, deleteCompany } = useCompanyMutations();
  const { createContactPerson, updateContactPerson, deleteContactPerson } = useContactPersonMutations();

  const filteredCompanies = companies?.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.city?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredPersons = contactPersons?.filter(person =>
    `${person.first_name} ${person.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.customer_companies?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
      aktiv: { label: 'Aktiv', variant: 'default' as const },
      inaktiv: { label: 'Inaktiv', variant: 'secondary' as const },
      potentiell: { label: 'Potentiell', variant: 'outline' as const },
    };
    const config = statusConfig[status] || statusConfig.aktiv;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Kontakte</h1>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <TabsList className="grid w-full sm:w-auto grid-cols-2">
            <TabsTrigger value="companies" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Unternehmen</span>
              <span className="sm:hidden">Firmen</span>
              <span className="ml-1">({filteredCompanies.length})</span>
            </TabsTrigger>
            <TabsTrigger value="persons" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Personen</span>
              <span className="ml-1">({filteredPersons.length})</span>
            </TabsTrigger>
          </TabsList>
          
          <Button
            onClick={() => {
              if (activeTab === 'companies') {
                setSelectedCompany(null);
                setFormMode('company');
              } else {
                setSelectedPerson(null);
                setFormMode('person');
              }
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            <span className="sm:hidden">{activeTab === 'companies' ? 'Firma' : 'Person'}</span>
            <span className="hidden sm:inline">{activeTab === 'companies' ? 'Neues Unternehmen' : 'Neue Person'}</span>
          </Button>
        </div>

        <TabsContent value="companies">
          {/* Desktop Table View */}
          <div className="hidden lg:block">
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
                      <TableCell colSpan={5} className="text-center">Keine Unternehmen gefunden</TableCell>
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

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {companiesLoading ? (
              <Card>
                <CardContent className="p-4">
                  <p className="text-center">Lädt...</p>
                </CardContent>
              </Card>
            ) : filteredCompanies.length === 0 ? (
              <Card>
                <CardContent className="p-4">
                  <p className="text-center">Keine Unternehmen gefunden</p>
                </CardContent>
              </Card>
            ) : (
              filteredCompanies.map((company) => (
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
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="persons">
          {/* Desktop Table View */}
          <div className="hidden lg:block">
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
                      <TableCell colSpan={5} className="text-center">Keine Personen gefunden</TableCell>
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

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {personsLoading ? (
              <Card>
                <CardContent className="p-4">
                  <p className="text-center">Lädt...</p>
                </CardContent>
              </Card>
            ) : filteredPersons.length === 0 ? (
              <Card>
                <CardContent className="p-4">
                  <p className="text-center">Keine Personen gefunden</p>
                </CardContent>
              </Card>
            ) : (
              filteredPersons.map((person) => (
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
                          <Phone className="h-4 w-4 text-muted-foreground" />
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
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

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
        isLoading={createCompany.isPending || updateCompany.isPending || createContactPerson.isPending || updateContactPerson.isPending}
        initialMode={formMode}
      />
    </div>
  );
};

export default Kontakte;