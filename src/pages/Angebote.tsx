import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const Angebote = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Angebote</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Angebote verwalten</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Hier erstellen und verwalten Sie Ihre Angebote.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Angebote;