import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Archive } from "lucide-react";

const Materialschrank = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Archive className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Materialschrank</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Materialschrank verwalten</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Hier verwalten Sie das Materiallager.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Materialschrank;