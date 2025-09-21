import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Benachrichtigungen = () => {
  const notifications = [
    {
      id: 1,
      type: "success",
      title: "Auftrag abgeschlossen",
      message: "Büroreinigung bei Credit Suisse wurde erfolgreich abgeschlossen",
      time: "vor 15 Minuten",
      unread: true
    },
    {
      id: 2,
      type: "warning",
      title: "Rechnung überfällig",
      message: "Rechnung #RF-2024-0156 ist seit 5 Tagen überfällig",
      time: "vor 2 Stunden",
      unread: true
    },
    {
      id: 3,
      type: "info",
      title: "Neuer Mitarbeiter",
      message: "Anna Schmidt wurde erfolgreich zum Team hinzugefügt",
      time: "vor 1 Tag",
      unread: false
    },
    {
      id: 4,
      type: "success",
      title: "Zahlung erhalten",
      message: "Zahlung von CHF 2,850 für Auftrag #RF-2024-0154 erhalten",
      time: "vor 2 Tagen",
      unread: false
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "info":
        return <Info className="h-5 w-5 text-primary" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Benachrichtigungen</h1>
        <Badge className="ml-2 bg-destructive text-destructive-foreground">
          {notifications.filter(n => n.unread).length}
        </Badge>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <p className="text-muted-foreground">
          Aktuelle Benachrichtigungen und Updates
        </p>
        <Button variant="outline" size="sm">
          Alle als gelesen markieren
        </Button>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className={`${notification.unread ? 'border-primary/50 bg-primary/5' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{notification.title}</h3>
                    {notification.unread && (
                      <Badge variant="secondary" className="text-xs px-2 py-0">
                        Neu
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {notification.message}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {notification.time}
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="text-xs">
                  Als gelesen markieren
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Benachrichtigungen;