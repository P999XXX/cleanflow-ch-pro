import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, User, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";


const Profileinstellungen = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

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

    // Load user role
    const { data: roleData } = await supabase
      .rpc('get_user_roles', { _user_id: user.id });
    
    if (roleData && roleData.length > 0) {
      // Get the German translation of the role
      const roleTranslations = {
        'masteradministrator': 'Masteradministrator',
        'administrator': 'Administrator', 
        'objektleiter': 'Objektleiter',
        'reinigungsmitarbeiter': 'Reinigungsmitarbeiter'
      };
      setUserRole(roleTranslations[roleData[0].role] || roleData[0].role);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    
    try {
      // Soft delete the user account by updating the profile status
      const { error } = await supabase
        .from('profiles')
        .update({ 
          account_status: 'deleted',
          deleted_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Account gelöscht",
        description: "Ihr Account wurde erfolgreich gelöscht. Sie werden automatisch abgemeldet.",
      });

      // Delete auth user via backend function and sign out
      await supabase.functions.invoke('delete-account');
      await signOut();
      navigate("/login");

    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Account konnte nicht gelöscht werden. Bitte versuchen Sie es erneut.",
      });
    } finally {
      setIsDeleting(false);
    }
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
            <div>
              <label className="text-sm font-medium">Rolle</label>
              <p className="text-muted-foreground">{userRole || 'Nicht zugewiesen'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Account Deletion Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Konto löschen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-muted-foreground mb-4">
                Wenn Sie Ihr Konto löschen, werden alle Ihre Daten unwiderruflich entfernt und 
                Sie können sich nicht mehr anmelden. Diese Aktion kann nicht rückgängig gemacht werden.
              </p>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="gap-2"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                    Account dauerhaft löschen
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Account wirklich löschen?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Diese Aktion löscht Ihr Konto und alle damit verbundenen Daten unwiderruflich. 
                      Sie verlieren den Zugang zu allen Ihren Projekten, Kunden und Mitarbeiterdaten.
                      <br /><br />
                      <strong>Diese Aktion kann nicht rückgängig gemacht werden.</strong>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Wird gelöscht..." : "Ja, Account dauerhaft löschen"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profileinstellungen;