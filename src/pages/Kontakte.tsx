import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Building2, Plus, Search, Edit, Trash2, Phone, Mail } from "lucide-react";
import { useCompanies, useCompanyMutations } from '@/hooks/useCompanies';
import { useContactPersons, useContactPersonMutations } from '@/hooks/useContactPersons';
import { CompanyForm } from '@/components/Contacts/CompanyForm';
import { ContactPersonForm } from '@/components/Contacts/ContactPersonForm';

const Kontakte = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('companies');
  const [isCompanyFormOpen, setIsCompanyFormOpen] = useState(false);
  const [isPersonFormOpen, setIsPersonFormOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);

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
        { onSuccess: () => { setIsCompanyFormOpen(false); setSelectedCompany(null); } }
      );
    } else {
      createCompany.mutate(companyData, {
        onSuccess: () => setIsCompanyFormOpen(false)
      });
    }
  };

  const handlePersonSubmit = (personData) => {
    if (selectedPerson) {
      updateContactPerson.mutate(
        { id: selectedPerson.id, contactPerson: personData },
        { onSuccess: () => { setIsPersonFormOpen(false); setSelectedPerson(null); } }
      );
    } else {
      createContactPerson.mutate(personData, {
        onSuccess: () => setIsPersonFormOpen(false)
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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Kontakte</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="companies" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Unternehmen ({filteredCompanies.length})
            </TabsTrigger>
            <TabsTrigger value="persons" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Personen ({filteredPersons.length})
            </TabsTrigger>
          </TabsList>
          
          <Button
            onClick={() => {
              if (activeTab === 'companies') {
                setSelectedCompany(null);
                setIsCompanyFormOpen(true);
              } else {
                setSelectedPerson(null);
                setIsPersonFormOpen(true);
              }
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {activeTab === 'companies' ? 'Neues Unternehmen' : 'Neue Person'}
          </Button>
        </div>

        <TabsContent value="companies">
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
                              setIsCompanyFormOpen(true);
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
        </TabsContent>

        <TabsContent value="persons">
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
                              setIsPersonFormOpen(true);
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
        </TabsContent>
      </Tabs>

      <CompanyForm
        isOpen={isCompanyFormOpen}
        onClose={() => {
          setIsCompanyFormOpen(false);
          setSelectedCompany(null);
        }}
        onSubmit={handleCompanySubmit}
        company={selectedCompany}
        isLoading={createCompany.isPending || updateCompany.isPending}
      />

      <ContactPersonForm
        isOpen={isPersonFormOpen}
        onClose={() => {
          setIsPersonFormOpen(false);
          setSelectedPerson(null);
        }}
        onSubmit={handlePersonSubmit}
        contactPerson={selectedPerson}
        isLoading={createContactPerson.isPending || updateContactPerson.isPending}
      />
    </div>
  );
};

export default Kontakte;