import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ContactPersonInput } from './useContactPersons';
import { EmployeeDetailsInput } from './useEmployeeDetails';
import { showSuccessToast, showErrorToast } from '@/utils/errorHandling';
import { queryKeys } from '@/lib/queryConfig';

interface Child {
  first_name: string;
  last_name: string;
  birth_date: string;
}

interface SaveContactPayload {
  contact: ContactPersonInput & { id?: string };
  employee_details?: EmployeeDetailsInput;
  children?: Child[];
  role?: string;
}

export const useEdgeFunctionContactSave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SaveContactPayload) => {
      console.log('Calling save-contact Edge Function with payload:', payload);

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error('No active session');
      }

      const { data, error } = await supabase.functions.invoke('save-contact', {
        body: payload,
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) {
        console.error('Edge Function error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Unknown error occurred');
      }

      return data;
    },
    onSuccess: (data) => {
      console.log('Contact saved successfully:', data);
      
      // Invalidate all related queries using centralized keys
      queryClient.invalidateQueries({ queryKey: queryKeys.contactPersons });
      queryClient.invalidateQueries({ queryKey: queryKeys.allContacts });
      queryClient.invalidateQueries({ queryKey: queryKeys.employeeDetails() });
      queryClient.invalidateQueries({ queryKey: queryKeys.employeeChildren() });

      showSuccessToast('Die Kontaktdaten wurden erfolgreich gespeichert.');
    },
    onError: (error: any) => {
      console.error('Error saving contact:', error);
      showErrorToast(error, 'Der Kontakt konnte nicht gespeichert werden.');
    },
  });
};
