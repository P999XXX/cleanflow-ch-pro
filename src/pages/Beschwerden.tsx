import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const Beschwerden = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Beschwerden</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Beschwerden verwalten</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Hier verwalten Sie alle Kundenbeschwerden.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Beschwerden;