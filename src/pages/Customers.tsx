import { useState, useEffect } from "react";
import { Plus, Search, Building2, User, Phone, Mail, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerCompanyDialog } from "@/components/Customers/CustomerCompanyDialog";
import { ContactPersonDialog } from "@/components/Customers/ContactPersonDialog";

interface CustomerCompany {
  id: string;
  name: string;
  address?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  vat_number?: string;
  notes?: string;
  status: 'aktiv' | 'inaktiv' | 'potenziell';
  created_at: string;
  updated_at: string;
}

interface ContactPerson {
  id: string;
  customer_company_id?: string;
  first_name: string;
  last_name: string;
  title?: string;
  department?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  notes?: string;
  is_primary_contact: boolean;
  customer_company?: {
    name: string;
  };
}

export default function Customers() {
  const { user } = useAuth();
  const [customerCompanies, setCustomerCompanies] = useState<CustomerCompany[]>([]);
  const [contactPersons, setContactPersons] = useState<ContactPerson[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CustomerCompany | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactPerson | null>(null);
  const [userCompanyId, setUserCompanyId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchUserCompany();
    }
  }, [user]);

  useEffect(() => {
    if (userCompanyId) {
      fetchCustomerCompanies();
      fetchContactPersons();
    }
  }, [userCompanyId]);

  const fetchUserCompany = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_id', user?.id)
        .single();

      if (error) throw error;
      setUserCompanyId(data?.id);
    } catch (error) {
      console.error('Error fetching user company:', error);
      toast.error('Fehler beim Laden der Firmendaten');
    }
  };

  const fetchCustomerCompanies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customer_companies')
        .select('*')
        .eq('company_id', userCompanyId)
        .order('name', { ascending: true });

      if (error) throw error;
      setCustomerCompanies((data || []).map(company => ({
        ...company,
        status: company.status as 'aktiv' | 'inaktiv' | 'potenziell'
      })));
    } catch (error) {
      console.error('Error fetching customer companies:', error);
      toast.error('Fehler beim Laden der Kundenunternehmen');
    } finally {
      setLoading(false);
    }
  };

  const fetchContactPersons = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_persons')
        .select(`
          *,
          customer_company:customer_companies(name)
        `)
        .eq('company_id', userCompanyId)
        .order('last_name', { ascending: true });

      if (error) throw error;
      setContactPersons(data || []);
    } catch (error) {
      console.error('Error fetching contact persons:', error);
      toast.error('Fehler beim Laden der Kontaktpersonen');
    }
  };

  const handleCompanySaved = () => {
    fetchCustomerCompanies();
    setCompanyDialogOpen(false);
    setSelectedCompany(null);
  };

  const handleContactSaved = () => {
    fetchContactPersons();
    setContactDialogOpen(false);
    setSelectedContact(null);
  };

  const editCompany = (company: CustomerCompany) => {
    setSelectedCompany(company);
    setCompanyDialogOpen(true);
  };

  const editContact = (contact: ContactPerson) => {
    setSelectedContact(contact);
    setContactDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aktiv':
        return 'default';
      case 'inaktiv':
        return 'secondary';
      case 'potenziell':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const filteredCompanies = customerCompanies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContacts = contactPersons.filter(contact =>
    contact.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.customer_company?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-96">Laden...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kunden</h2>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Kundenunternehmen und Kontaktpersonen
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Suchen nach Name, E-Mail oder Stadt..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setCompanyDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Unternehmen
          </Button>
          <Button variant="outline" onClick={() => setContactDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Person
          </Button>
        </div>
      </div>

      <Tabs defaultValue="companies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="companies">
            <Building2 className="mr-2 h-4 w-4" />
            Unternehmen ({filteredCompanies.length})
          </TabsTrigger>
          <TabsTrigger value="contacts">
            <User className="mr-2 h-4 w-4" />
            Kontaktpersonen ({filteredContacts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="companies">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompanies.map((company) => (
              <Card
                key={company.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => editCompany(company)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{company.name}</CardTitle>
                    <Badge variant={getStatusColor(company.status)}>
                      {company.status}
                    </Badge>
                  </div>
                  {company.vat_number && (
                    <CardDescription>UID: {company.vat_number}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-2">
                  {company.address && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-2 h-3 w-3" />
                      <span>
                        {company.address}
                        {company.postal_code && company.city && (
                          <>, {company.postal_code} {company.city}</>
                        )}
                      </span>
                    </div>
                  )}
                  {company.phone && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="mr-2 h-3 w-3" />
                      {company.phone}
                    </div>
                  )}
                  {company.email && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="mr-2 h-3 w-3" />
                      {company.email}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {filteredCompanies.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                {searchTerm ? 'Keine Unternehmen gefunden' : 'Noch keine Unternehmen erfasst'}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="contacts">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.map((contact) => (
              <Card
                key={contact.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => editContact(contact)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">
                    {contact.first_name} {contact.last_name}
                    {contact.is_primary_contact && (
                      <Badge variant="default" className="ml-2 text-xs">
                        Hauptkontakt
                      </Badge>
                    )}
                  </CardTitle>
                  {contact.title && (
                    <CardDescription>{contact.title}</CardDescription>
                  )}
                  {contact.customer_company && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Building2 className="mr-2 h-3 w-3" />
                      {contact.customer_company.name}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-2">
                  {contact.department && (
                    <div className="text-sm text-muted-foreground">
                      {contact.department}
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="mr-2 h-3 w-3" />
                      {contact.phone}
                    </div>
                  )}
                  {contact.email && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="mr-2 h-3 w-3" />
                      {contact.email}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {filteredContacts.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                {searchTerm ? 'Keine Kontaktpersonen gefunden' : 'Noch keine Kontaktpersonen erfasst'}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <CustomerCompanyDialog
        open={companyDialogOpen}
        onOpenChange={setCompanyDialogOpen}
        onSaved={handleCompanySaved}
        customerCompany={selectedCompany}
        userCompanyId={userCompanyId}
      />

      <ContactPersonDialog
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
        onSaved={handleContactSaved}
        contactPerson={selectedContact}
        userCompanyId={userCompanyId}
      />
    </div>
  );
}