import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

const Materialbestellungen = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Package className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Materialbestellungen</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Materialbestellungen verwalten</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Hier verwalten Sie alle Materialbestellungen.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Materialbestellungen;