import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const Einsatzplan = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Einsatzplan</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Einsatzplan verwalten</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Hier planen Sie alle Einsätze und Termine.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Einsatzplan;