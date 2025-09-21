import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

const Auftraege = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <ClipboardList className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Aufträge</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Aufträge verwalten</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Hier verwalten Sie alle laufenden Aufträge.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auftraege;