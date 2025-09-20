import { Clock, User, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Activity {
  id: string;
  type: "project" | "invoice" | "employee" | "customer";
  title: string;
  description: string;
  time: string;
  user: string;
  status?: "completed" | "pending" | "in-progress";
}

const activities: Activity[] = [
  {
    id: "1",
    type: "project",
    title: "Büroreinigung Hotel Schweizerhof",
    description: "Projekt erfolgreich abgeschlossen",
    time: "vor 2 Stunden",
    user: "Maria Schmidt",
    status: "completed"
  },
  {
    id: "2",
    type: "invoice",
    title: "Rechnung #2024-003",
    description: "Neue Rechnung erstellt für CHF 2,850.-",
    time: "vor 4 Stunden",
    user: "Thomas Meier",
    status: "pending"
  },
  {
    id: "3",
    type: "employee",
    title: "Neuer Mitarbeiter",
    description: "Anna Müller dem Team hinzugefügt",
    time: "vor 1 Tag",
    user: "System",
    status: "completed"
  },
  {
    id: "4",
    type: "customer",
    title: "Kunde Bahnhof AG",
    description: "Neue Offerte angefordert",
    time: "vor 2 Tagen",
    user: "Lisa Weber",
    status: "in-progress"
  }
];

const getStatusColor = (status?: string) => {
  switch (status) {
    case "completed":
      return "bg-success/10 text-success border-success/20";
    case "pending":
      return "bg-warning/10 text-warning border-warning/20";
    case "in-progress":
      return "bg-primary/10 text-primary border-primary/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusText = (status?: string) => {
  switch (status) {
    case "completed":
      return "Abgeschlossen";
    case "pending":
      return "Ausstehend";
    case "in-progress":
      return "In Bearbeitung";
    default:
      return "";
  }
};

export function ActivityCard() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Letzte Aktivitäten
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {activity.user.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground truncate">
                  {activity.title}
                </p>
                {activity.status && (
                  <Badge className={getStatusColor(activity.status)} variant="outline">
                    {getStatusText(activity.status)}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {activity.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="w-3 h-3" />
                <span>{activity.user}</span>
                <span>•</span>
                <span>{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}