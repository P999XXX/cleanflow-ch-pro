import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ContactPersonInput } from './useContactPersons';
import { EmployeeDetailsInput } from './useEmployeeDetails';

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
      
      // Invalidate all related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['contactPersons'] });
      queryClient.invalidateQueries({ queryKey: ['allContacts'] });
      queryClient.invalidateQueries({ queryKey: ['employeeDetails'] });
      queryClient.invalidateQueries({ queryKey: ['employeeChildren'] });

      toast({
        title: 'Kontakt gespeichert',
        description: 'Die Kontaktdaten wurden erfolgreich gespeichert.',
      });

      // Vibration for mobile devices
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    },
    onError: (error: any) => {
      console.error('Error saving contact:', error);
      toast({
        title: 'Fehler beim Speichern',
        description: error.message || 'Der Kontakt konnte nicht gespeichert werden.',
        variant: 'destructive',
      });
    },
  });
};
