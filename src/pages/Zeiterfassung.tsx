import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

const Zeiterfassung = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Zeiterfassung</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Zeiterfassung verwalten</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Hier erfassen Sie Arbeitszeiten.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Zeiterfassung;