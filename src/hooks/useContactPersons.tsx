import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ContactPerson {
  id: string;
  first_name: string;
  last_name: string;
  position?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  is_primary_contact: boolean;
  is_employee: boolean;
  notes?: string;
  customer_company_id?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  customer_companies?: {
    name: string;
  };
}

export interface ContactPersonInput {
  first_name: string;
  last_name: string;
  position?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  is_primary_contact?: boolean;
  is_employee?: boolean;
  notes?: string;
  customer_company_id?: string;
}

export const useContactPersons = () => {
  return useQuery({
    queryKey: ['contact-persons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_persons')
        .select(`
          id,
          first_name,
          last_name,
          position,
          email,
          phone,
          mobile,
          is_primary_contact,
          is_employee,
          notes,
          customer_company_id,
          company_id,
          created_at,
          updated_at,
          customer_companies (
            name
          )
        `)
        .order('last_name');

      if (error) throw error;
      return data as ContactPerson[];
    },
  });
};

export const useContactPersonMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createContactPerson = useMutation({
    mutationFn: async (contactPerson: ContactPersonInput) => {
      // Get the user's company_id first
      const { data: userCompany } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!userCompany) throw new Error('Firma nicht gefunden');

      const { data, error } = await supabase
        .from('contact_persons')
        .insert({
          ...contactPerson,
          company_id: userCompany.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-persons'] });
      toast({
        title: 'Erfolg',
        description: 'Kontaktperson wurde erfolgreich erstellt',
      });
    },
    onError: () => {
      toast({
        title: 'Fehler',
        description: 'Fehler beim Erstellen der Kontaktperson',
        variant: 'destructive',
      });
    },
  });

  const updateContactPerson = useMutation({
    mutationFn: async ({ id, contactPerson }: { id: string; contactPerson: ContactPersonInput }) => {
      const { data, error } = await supabase
        .from('contact_persons')
        .update(contactPerson)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-persons'] });
      toast({
        title: 'Erfolg',
        description: 'Kontaktperson wurde erfolgreich aktualisiert',
      });
    },
    onError: () => {
      toast({
        title: 'Fehler',
        description: 'Fehler beim Aktualisieren der Kontaktperson',
        variant: 'destructive',
      });
    },
  });

  const deleteContactPerson = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_persons')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-persons'] });
      toast({
        title: 'Erfolg',
        description: 'Kontaktperson wurde erfolgreich gelöscht',
      });
    },
    onError: () => {
      toast({
        title: 'Fehler',
        description: 'Fehler beim Löschen der Kontaktperson',
        variant: 'destructive',
      });
    },
  });

  return {
    createContactPerson,
    updateContactPerson,
    deleteContactPerson,
  };
};