import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const Reklamationen = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Reklamationen</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Reklamationen verwalten</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Hier verwalten Sie alle Kundenreklamationen und Beschwerden.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reklamationen;
