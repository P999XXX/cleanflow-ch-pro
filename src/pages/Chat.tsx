import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Chat = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Chat</h1>
      </div>
      
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle>Team-Kommunikation</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {/* Chat Messages Area */}
          <div className="flex-1 bg-muted/20 rounded-lg p-4 mb-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
                  MW
                </div>
                <div className="flex-1">
                  <div className="bg-background border rounded-lg p-3">
                    <p className="text-sm font-medium mb-1">Max Weber</p>
                    <p className="text-sm text-muted-foreground">
                      Willkommen im CleanFlow Team-Chat! Hier können Sie mit Ihren Mitarbeitern kommunizieren.
                    </p>
                    <span className="text-xs text-muted-foreground">vor 2 Minuten</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground text-sm font-semibold">
                  AS
                </div>
                <div className="flex-1">
                  <div className="bg-background border rounded-lg p-3">
                    <p className="text-sm font-medium mb-1">Anna Schmidt</p>
                    <p className="text-sm text-muted-foreground">
                      Guten Morgen! Der Einsatz bei Firma XYZ ist heute erfolgreich abgeschlossen worden.
                    </p>
                    <span className="text-xs text-muted-foreground">vor 1 Minute</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Message Input */}
          <div className="flex gap-2">
            <Textarea 
              placeholder="Nachricht eingeben..." 
              className="flex-1 min-h-[40px] max-h-[120px] resize-none"
            />
            <Button size="icon" className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;