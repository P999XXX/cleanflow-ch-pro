import { useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Generic hook for updating contact status (companies and persons)
 */
export function useContactStatusUpdate() {
  const queryClient = useQueryClient();

  // Company status update mutation
  const updateCompanyStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('customer_companies')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['allContacts'] });
      toast({ title: "Status erfolgreich aktualisiert" });
    },
    onError: (error) => {
      console.error('Error updating company status:', error);
      toast({ 
        title: "Fehler beim Aktualisieren", 
        description: "Der Status konnte nicht aktualisiert werden.",
        variant: "destructive" 
      });
    },
  });

  // Person status update mutation
  const updatePersonStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('contact_persons')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactPersons'] });
      queryClient.invalidateQueries({ queryKey: ['allContacts'] });
      toast({ title: "Status erfolgreich aktualisiert" });
    },
    onError: (error) => {
      console.error('Error updating person status:', error);
      toast({ 
        title: "Fehler beim Aktualisieren", 
        description: "Der Status konnte nicht aktualisiert werden.",
        variant: "destructive" 
      });
    },
  });

  // Generic status update handler
  const handleStatusUpdate = async (item: any, type: 'company' | 'person', newStatus: string) => {
    if (type === 'company') {
      await updateCompanyStatusMutation.mutateAsync({
        id: item.id,
        status: newStatus
      });
    } else {
      await updatePersonStatusMutation.mutateAsync({
        id: item.id,
        status: newStatus
      });
    }
  };

  return {
    updateCompanyStatusMutation,
    updatePersonStatusMutation,
    handleStatusUpdate,
  };
}

/**
 * Type for the contact status update hook return value
 */
export type ContactStatusUpdateHook = ReturnType<typeof useContactStatusUpdate>;