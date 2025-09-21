import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CustomerCompany {
  id: string;
  name: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country: string;
  phone?: string;
  email?: string;
  website?: string;
  vat_number?: string;
  notes?: string;
  status: string;
  company_type?: string;
  industry_category?: string;
  contact_type?: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  contact_persons?: Array<{
    id: string;
    first_name: string;
    last_name: string;
    title?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    department?: string;
    is_primary_contact: boolean;
    notes?: string;
  }>;
}

export interface CustomerCompanyInput {
  name: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  vat_number?: string;
  notes?: string;
  status?: string;
  company_type?: string;
  industry_category?: string;
  contact_type?: string;
}

export const useCompanies = () => {
  return useQuery({
    queryKey: ['customer-companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_companies')
        .select(`
          *,
          contact_persons (
            id,
            first_name,
            last_name,
            title,
            email,
            phone,
            mobile,
            department,
            is_primary_contact,
            notes
          )
        `)
        .order('name');

      if (error) throw error;
      return data as CustomerCompany[];
    },
  });
};

export const useCompanyMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createCompany = useMutation({
    mutationFn: async (company: CustomerCompanyInput) => {
      // Get the user's company_id first
      const { data: userCompany } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!userCompany) throw new Error('Firma nicht gefunden');

      const { data, error } = await supabase
        .from('customer_companies')
        .insert({
          ...company,
          company_id: userCompany.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-companies'] });
      toast({
        title: 'Erfolg',
        description: 'Unternehmen wurde erfolgreich erstellt',
      });
    },
    onError: () => {
      toast({
        title: 'Fehler',
        description: 'Fehler beim Erstellen des Unternehmens',
        variant: 'destructive',
      });
    },
  });

  const updateCompany = useMutation({
    mutationFn: async ({ id, company }: { id: string; company: CustomerCompanyInput }) => {
      const { data, error } = await supabase
        .from('customer_companies')
        .update(company)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-companies'] });
      toast({
        title: 'Erfolg',
        description: 'Unternehmen wurde erfolgreich aktualisiert',
      });
    },
    onError: () => {
      toast({
        title: 'Fehler',
        description: 'Fehler beim Aktualisieren des Unternehmens',
        variant: 'destructive',
      });
    },
  });

  const deleteCompany = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('customer_companies')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-companies'] });
      queryClient.invalidateQueries({ queryKey: ['contact-persons'] });
      toast({
        title: 'Erfolg',
        description: 'Unternehmen wurde erfolgreich gelöscht',
      });
    },
    onError: () => {
      toast({
        title: 'Fehler',
        description: 'Fehler beim Löschen des Unternehmens',
        variant: 'destructive',
      });
    },
  });

  return {
    createCompany,
    updateCompany,
    deleteCompany,
  };
};