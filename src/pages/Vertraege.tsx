import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck } from "lucide-react";

const Vertraege = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileCheck className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Verträge</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Verträge verwalten</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Hier verwalten Sie alle Reinigungsverträge.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Vertraege;