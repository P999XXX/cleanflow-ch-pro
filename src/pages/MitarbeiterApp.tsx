import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone } from "lucide-react";

const MitarbeiterApp = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Smartphone className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Mitarbeiter App</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Mitarbeiter App</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Hier verwalten Sie die Mobile App für Mitarbeiter.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MitarbeiterApp;