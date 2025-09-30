import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EmployeeDetails {
  id: string;
  contact_person_id: string;
  birth_date?: string;
  birth_place?: string;
  current_address?: string;
  address_since?: string;
  origin_country?: string;
  permit_type?: 'CH' | 'B' | 'C' | 'F' | 'L';
  permit_document_url?: string;
  ahv_number?: string;
  marital_status?: 'ledig' | 'verheiratet' | 'geschieden' | 'verwitwet' | 'in_partnerschaft';
  tax_residence?: boolean;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  employment_start_date?: string;
  company_id: string;
}

export interface EmployeeChild {
  id: string;
  employee_details_id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
}

export interface EmployeeDetailsInput {
  contact_person_id?: string;
  birth_date?: string;
  birth_place?: string;
  current_address?: string;
  address_since?: string;
  origin_country?: string;
  permit_type?: 'CH' | 'B' | 'C' | 'F' | 'L';
  permit_document_url?: string;
  ahv_number?: string;
  marital_status?: 'ledig' | 'verheiratet' | 'geschieden' | 'verwitwet' | 'in_partnerschaft';
  tax_residence?: boolean;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  employment_start_date?: string;
}

export const useEmployeeDetails = (contactPersonId?: string) => {
  return useQuery({
    queryKey: ['employee-details', contactPersonId],
    queryFn: async () => {
      if (!contactPersonId) return null;
      
      const { data, error } = await supabase
        .from('employee_details')
        .select('*')
        .eq('contact_person_id', contactPersonId)
        .maybeSingle();

      if (error) throw error;
      return data as EmployeeDetails | null;
    },
    enabled: !!contactPersonId,
  });
};

export const useEmployeeChildren = (employeeDetailsId?: string) => {
  return useQuery({
    queryKey: ['employee-children', employeeDetailsId],
    queryFn: async () => {
      if (!employeeDetailsId) return [];
      
      const { data, error } = await supabase
        .from('employee_children')
        .select('*')
        .eq('employee_details_id', employeeDetailsId)
        .order('birth_date');

      if (error) throw error;
      return data as EmployeeChild[];
    },
    enabled: !!employeeDetailsId,
  });
};

export const useEmployeeDetailsMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createOrUpdateEmployeeDetails = useMutation({
    mutationFn: async ({ 
      contactPersonId, 
      details 
    }: { 
      contactPersonId: string; 
      details: EmployeeDetailsInput 
    }) => {
      const { data: userCompany } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!userCompany) throw new Error('Firma nicht gefunden');

      // Check if employee details already exist
      const { data: existing } = await supabase
        .from('employee_details')
        .select('id')
        .eq('contact_person_id', contactPersonId)
        .maybeSingle();

      if (existing) {
        // Update
        const { data, error } = await supabase
          .from('employee_details')
          .update(details)
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create
        const { data, error } = await supabase
          .from('employee_details')
          .insert({
            ...details,
            contact_person_id: contactPersonId,
            company_id: userCompany.id,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-details'] });
      toast({
        title: 'Erfolg',
        description: 'Mitarbeiterdaten wurden gespeichert',
      });
    },
    onError: () => {
      toast({
        title: 'Fehler',
        description: 'Fehler beim Speichern der Mitarbeiterdaten',
        variant: 'destructive',
      });
    },
  });

  const createEmployeeChild = useMutation({
    mutationFn: async ({ 
      employeeDetailsId, 
      child 
    }: { 
      employeeDetailsId: string; 
      child: Omit<EmployeeChild, 'id' | 'employee_details_id'> 
    }) => {
      const { data, error } = await supabase
        .from('employee_children')
        .insert({
          ...child,
          employee_details_id: employeeDetailsId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-children'] });
      toast({
        title: 'Erfolg',
        description: 'Kind wurde hinzugefügt',
      });
    },
    onError: () => {
      toast({
        title: 'Fehler',
        description: 'Fehler beim Hinzufügen des Kindes',
        variant: 'destructive',
      });
    },
  });

  const deleteEmployeeChild = useMutation({
    mutationFn: async (childId: string) => {
      const { error } = await supabase
        .from('employee_children')
        .delete()
        .eq('id', childId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-children'] });
      toast({
        title: 'Erfolg',
        description: 'Kind wurde entfernt',
      });
    },
    onError: () => {
      toast({
        title: 'Fehler',
        description: 'Fehler beim Entfernen des Kindes',
        variant: 'destructive',
      });
    },
  });

  return {
    createOrUpdateEmployeeDetails,
    createEmployeeChild,
    deleteEmployeeChild,
  };
};
