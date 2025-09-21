import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Trash2, AlertTriangle, Building } from "lucide-react";
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
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import CompanyForm from "@/components/CompanyForm";

const Einstellungen = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasCompany, setHasCompany] = useState<boolean | null>(null);
  const [companyLoading, setCompanyLoading] = useState(true);

  useEffect(() => {
    const checkCompanyData = async () => {
      if (!user) {
        setCompanyLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('companies')
          .select('id')
          .eq('owner_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking company data:', error);
        }

        setHasCompany(!!data);
      } catch (error) {
        console.error('Error checking company data:', error);
        setHasCompany(false);
      } finally {
        setCompanyLoading(false);
      }
    };

    checkCompanyData();
  }, [user]);

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

  const handleCompanySuccess = () => {
    setHasCompany(true);
  };

  if (companyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Einstellungen</h1>
      </div>
      
      <div className="grid gap-6">
        {/* Firmendaten - Priorisiert angezeigt */}
        {!hasCompany ? (
          <div className="space-y-4">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Building className="h-5 w-5" />
                  Firmendaten erforderlich
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Bitte vervollständigen Sie Ihre Firmendaten, um CleanFlow.ai nutzen zu können.
                </p>
              </CardContent>
            </Card>
            <CompanyForm isProfile={true} onSuccess={handleCompanySuccess} />
          </div>
        ) : (
          <>
            <CompanyForm isProfile={true} onSuccess={handleCompanySuccess} />
            
            <Card>
              <CardHeader>
                <CardTitle>Allgemeine Einstellungen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Hier können Sie die allgemeinen Einstellungen der Anwendung verwalten.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Benachrichtigungen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Verwalten Sie Ihre Benachrichtigungseinstellungen.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sicherheit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sicherheitseinstellungen und Passwort ändern.
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {/* Account Deletion Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
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

export default Einstellungen;