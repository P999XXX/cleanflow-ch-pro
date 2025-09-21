import { useState, useEffect, createContext, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CompanyData {
  id?: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  taxNumber: string;
  vatNumber: string;
}

interface CompanyContextType {
  companyData: CompanyData | null;
  hasCompany: boolean;
  loading: boolean;
  saveCompany: (data: CompanyData) => Promise<boolean>;
  refreshCompanyData: () => Promise<void>;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const refreshCompanyData = async () => {
    console.log('CompanyData: refreshCompanyData called', { hasUser: !!user, userId: user?.id });
    
    if (!user) {
      console.log('CompanyData: No user, setting loading to false');
      setLoading(false);
      return;
    }

    try {
      console.log('CompanyData: Fetching company data for user:', user.id);
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('CompanyData: Error loading company data:', error);
        return;
      }

      console.log('CompanyData: Query result', { data, error });

      if (data) {
        console.log('CompanyData: Setting company data');
        setCompanyData({
          id: data.id,
          name: data.name || '',
          address: data.address || '',
          postalCode: data.postal_code || '',
          city: data.city || '',
          phone: data.phone || '',
          email: data.email || '',
          website: data.website || '',
          taxNumber: data.tax_number || '',
          vatNumber: data.vat_number || '',
        });
      } else {
        console.log('CompanyData: No company data found');
        setCompanyData(null);
      }
    } catch (error) {
      console.error('CompanyData: Error loading company data:', error);
    } finally {
      console.log('CompanyData: Setting loading to false');
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCompanyData();
  }, [user]);

  const waitForCompany = async (maxAttempts = 10, delayMs = 400) => {
    if (!user) return null;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (data && !error && data.name) return data;
      await new Promise((r) => setTimeout(r, delayMs));
    }
    return null;
  };

  const saveCompany = async (data: CompanyData): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Fehler",
        description: "Sie müssen angemeldet sein.",
        variant: "destructive",
      });
      return false;
    }

    const companyPayload = {
      name: data.name,
      address: data.address,
      postal_code: data.postalCode,
      city: data.city,
      phone: data.phone,
      email: data.email,
      website: data.website,
      tax_number: data.taxNumber,
      vat_number: data.vatNumber,
      owner_id: user.id,
    };

    try {
      let opError: any = null;
      const isUpdate = !!companyData?.id;

      if (isUpdate) {
        const { error } = await supabase
          .from('companies')
          .update(companyPayload)
          .eq('owner_id', user.id);
        opError = error;
      } else {
        const { error } = await supabase
          .from('companies')
          .insert([companyPayload]);
        opError = error;
      }

      if (opError) {
        toast({
          title: "Fehler",
          description: `Firma konnte nicht ${isUpdate ? 'aktualisiert' : 'erstellt'} werden: ` + opError.message,
          variant: "destructive",
        });
        return false;
      }

      // Warten auf Daten-Propagation für neue Firmen
      if (!isUpdate) {
        const confirmed = await waitForCompany();
        if (!confirmed) {
          toast({
            title: "Hinweis",
            description: "Firmendaten werden verarbeitet, bitte einen Moment...",
          });
          return false;
        }
      }

      await refreshCompanyData();
      
      toast({
        title: "Erfolgreich",
        description: `Ihre Firmendaten wurden erfolgreich ${isUpdate ? 'aktualisiert' : 'erstellt'}!`,
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive",
      });
      return false;
    }
  };

  const hasCompany = !!companyData?.name;

  return (
    <CompanyContext.Provider value={{
      companyData,
      hasCompany,
      loading,
      saveCompany,
      refreshCompanyData,
    }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompanyData() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompanyData must be used within a CompanyProvider');
  }
  return context;
}