import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Mail } from "lucide-react";

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md shadow-clean-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-6 w-6 text-success" />
          </div>
          <CardTitle className="text-2xl">Vielen Dank für Ihre Registrierung!</CardTitle>
          <CardDescription>
            Ihr Konto wurde erfolgreich erstellt.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">E-Mail-Bestätigung erforderlich</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Wir haben Ihnen eine E-Mail mit einem Bestätigungslink gesendet. 
              Klicken Sie auf den Link in der E-Mail, um Ihr Konto zu aktivieren.
            </p>
            <p className="text-xs text-muted-foreground">
              Überprüfen Sie auch Ihren Spam-Ordner, falls Sie keine E-Mail erhalten haben.
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button 
              onClick={() => navigate('/login')}
              variant="outline"
              className="w-full"
            >
              Zurück zur Anmeldung
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThankYou;