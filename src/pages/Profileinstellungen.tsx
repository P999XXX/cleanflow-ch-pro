import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

const Profileinstellungen = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Profileinstellungen</h1>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Persönliche Informationen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Vorname</label>
                <p className="text-muted-foreground">Max</p>
              </div>
              <div>
                <label className="text-sm font-medium">Nachname</label>
                <p className="text-muted-foreground">Weber</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">E-Mail</label>
              <p className="text-muted-foreground">max.weber@reinigungsfirma.ch</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Account-Einstellungen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Hier können Sie Ihre Account-Einstellungen verwalten.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profileinstellungen;