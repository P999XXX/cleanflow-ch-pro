import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

const MitarbeiterChat = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Mitarbeiter Chat</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Mitarbeiter Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Hier kommunizieren Sie mit Ihren Mitarbeitern.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MitarbeiterChat;