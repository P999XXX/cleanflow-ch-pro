import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HardHat } from "lucide-react";

const Baureinigung = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <HardHat className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Baureinigung</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Baureinigung</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Hier verwalten Sie alle Baureinigungsprojekte und -aufträge.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Baureinigung;
