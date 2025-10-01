import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface UnifiedContact {
  id: string;
  name: string;
  contact_type: 'Geschäftskunde' | 'Privatkunde' | 'Mitarbeiter';
  email?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  status?: string;
  industry_category?: string;
  company_type?: string;
  position?: string;
  is_primary_contact?: boolean;
  is_employee?: boolean;
  is_private_customer?: boolean;
  customer_company_id?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  type: 'company' | 'person';
}

export const useAllContacts = () => {
  return useQuery({
    queryKey: ['all-contacts'],
    queryFn: async () => {
      // Fetch companies
      const { data: companies, error: companiesError } = await supabase
        .from('customer_companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (companiesError) throw companiesError;

      // Fetch contact persons
      const { data: persons, error: personsError } = await supabase
        .from('contact_persons')
        .select('*')
        .order('created_at', { ascending: false });

      if (personsError) throw personsError;

      // Transform companies to unified format
      const unifiedCompanies: UnifiedContact[] = (companies || []).map(company => ({
        id: company.id,
        name: company.name,
        contact_type: 'Geschäftskunde' as const,
        email: company.email || undefined,
        phone: company.phone || undefined,
        mobile: undefined,
        address: company.address || undefined,
        city: company.city || undefined,
        postal_code: company.postal_code || undefined,
        status: company.status || undefined,
        industry_category: company.industry_category || undefined,
        company_type: company.company_type || undefined,
        position: undefined,
        is_primary_contact: undefined,
        is_employee: false,
        is_private_customer: false,
        customer_company_id: undefined,
        company_id: company.company_id,
        created_at: company.created_at,
        updated_at: company.updated_at,
        type: 'company' as const
      }));

      // Transform persons to unified format
      const unifiedPersons: UnifiedContact[] = (persons || []).map(person => ({
        id: person.id,
        name: `${person.first_name} ${person.last_name}`,
        contact_type: (person.contact_type || 
          (person.is_employee ? 'Mitarbeiter' : 'Privatkunde')) as 'Privatkunde' | 'Mitarbeiter',
        email: person.email || undefined,
        phone: person.phone || undefined,
        mobile: person.mobile || undefined,
        address: undefined,
        city: undefined,
        postal_code: undefined,
        status: undefined,
        industry_category: undefined,
        company_type: undefined,
        position: person.position || undefined,
        is_primary_contact: person.is_primary_contact || false,
        is_employee: person.is_employee || false,
        is_private_customer: person.is_private_customer || false,
        customer_company_id: person.customer_company_id || undefined,
        company_id: person.company_id,
        created_at: person.created_at,
        updated_at: person.updated_at,
        type: 'person' as const
      }));

      // Combine and sort by created_at
      const allContacts = [...unifiedCompanies, ...unifiedPersons].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      return allContacts;
    }
  });
};
