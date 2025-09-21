import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const QSKontrollen = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <CheckCircle className="h-6 w-6" />
        <h1 className="text-2xl font-bold">QS Kontrollen</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Qualitätskontrollen verwalten</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Hier verwalten Sie alle Qualitätskontrollen.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QSKontrollen;