import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

const Kontakte = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Kontakte</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Kontakte verwalten</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Hier verwalten Sie alle Kunden und Kontaktpersonen.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Kontakte;