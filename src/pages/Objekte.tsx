import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";

const Objekte = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Building className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Objekte</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Objekte verwalten</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Hier verwalten Sie alle Reinigungsobjekte.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Objekte;