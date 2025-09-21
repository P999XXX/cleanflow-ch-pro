import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck } from "lucide-react";

const Mitarbeiter = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <UserCheck className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Mitarbeiter</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Mitarbeiter verwalten</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Hier verwalten Sie alle Mitarbeiter.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Mitarbeiter;