import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt } from "lucide-react";

const Rechnungen = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Receipt className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Rechnungen</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Rechnungen verwalten</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Hier erstellen und verwalten Sie Ihre Rechnungen.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Rechnungen;