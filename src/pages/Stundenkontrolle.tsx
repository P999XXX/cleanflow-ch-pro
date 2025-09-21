import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

const Stundenkontrolle = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Stundenkontrolle</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Stundenkontrolle verwalten</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Hier kontrollieren Sie alle Arbeitsstunden.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Stundenkontrolle;