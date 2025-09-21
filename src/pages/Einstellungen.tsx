import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

const Einstellungen = () => {
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
      </div>
    </div>
  );
};

export default Einstellungen;