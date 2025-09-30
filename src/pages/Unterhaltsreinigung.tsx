import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const Unterhaltsreinigung = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Unterhaltsreinigung</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Unterhaltsreinigung</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Hier verwalten Sie alle Unterhaltsreinigungsdienste und -aufträge.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unterhaltsreinigung;
