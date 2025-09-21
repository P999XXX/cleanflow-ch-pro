import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserX } from "lucide-react";

const Abwesenheiten = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <UserX className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Abwesenheiten</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Abwesenheiten verwalten</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Hier verwalten Sie alle Abwesenheiten.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Abwesenheiten;