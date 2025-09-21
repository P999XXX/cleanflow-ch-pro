import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

const Terminkalender = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <CalendarDays className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Terminkalender</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Terminkalender</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Hier verwalten Sie alle Termine und Einsätze.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Terminkalender;