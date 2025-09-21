import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Trash2, AlertTriangle } from "lucide-react";
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
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Einstellungen = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

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
        description: "Ihr Account wurde erfolgreich deaktiviert. Sie werden automatisch abgemeldet.",
      });

      // Sign out the user after successful soft delete
      setTimeout(async () => {
        await signOut();
        navigate("/login");
      }, 2000);

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
        <h1 className="text-2xl font-bold">Einstellungen</h1>
      </div>
      
      <div className="grid gap-6">
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

        {/* Account Deletion Section */}
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Gefahrenzone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-muted-foreground mb-4">
                Wenn Sie Ihr Konto löschen, wird es deaktiviert und Sie können sich nicht mehr anmelden. 
                Ihre Daten bleiben für administrative Zwecke erhalten.
              </p>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="gap-2"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                    Account löschen
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Account wirklich löschen?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Diese Aktion deaktiviert Ihr Konto dauerhaft. Sie können sich danach nicht mehr anmelden, 
                      aber Ihre Daten bleiben zu administrativen Zwecken erhalten.
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
                      {isDeleting ? "Wird gelöscht..." : "Ja, Account löschen"}
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