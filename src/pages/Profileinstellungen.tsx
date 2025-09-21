import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";


const Profileinstellungen = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    setProfile(data);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Profileinstellungen</h1>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Persönliche Informationen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Vorname</label>
                <p className="text-muted-foreground">{profile?.first_name || user?.user_metadata?.first_name || 'Nicht angegeben'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Nachname</label>
                <p className="text-muted-foreground">{profile?.last_name || user?.user_metadata?.last_name || 'Nicht angegeben'}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">E-Mail</label>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profileinstellungen;