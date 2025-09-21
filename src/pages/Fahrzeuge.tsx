import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";

const Fahrzeuge = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Truck className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Fahrzeuge</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Fahrzeuge verwalten</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Hier verwalten Sie alle Firmenfahrzeuge.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Fahrzeuge;