import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

const Schulungen = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <GraduationCap className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Schulungen</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Schulungen verwalten</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Hier verwalten Sie alle Mitarbeiterschulungen.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Schulungen;