import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, Plus, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Tickets = () => {
  const tickets = [
    {
      id: "TK-001",
      title: "Reklamation - Unvollständige Reinigung",
      customer: "Hotel Baur au Lac",
      priority: "hoch",
      status: "offen",
      created: "vor 2 Stunden"
    },
    {
      id: "TK-002", 
      title: "Technisches Problem - Staubsauger defekt",
      customer: "Credit Suisse AG",
      priority: "mittel",
      status: "in-bearbeitung",
      created: "vor 1 Tag"
    },
    {
      id: "TK-003",
      title: "Anfrage - Zusätzliche Fensterreinigung",
      customer: "UBS Tower",
      priority: "niedrig",
      status: "geschlossen",
      created: "vor 3 Tagen"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "hoch":
        return "bg-destructive text-destructive-foreground";
      case "mittel":
        return "bg-warning text-warning-foreground";
      case "niedrig":
        return "bg-success text-success-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "offen":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "in-bearbeitung":
        return "bg-warning/10 text-warning border-warning/20";
      case "geschlossen":
        return "bg-success/10 text-success border-success/20";
      default:
        return "bg-secondary/10 text-secondary border-secondary/20";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Ticket className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Tickets</h1>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          Support-Tickets und Kundenanfragen verwalten
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Neues Ticket
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono">
                    {ticket.id}
                  </Badge>
                  <Badge className={getPriorityColor(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(ticket.status)}>
                    {ticket.status}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {ticket.created}
                </span>
              </div>
              
              <h3 className="font-semibold mb-2">{ticket.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Kunde: {ticket.customer}
              </p>
              
              <div className="flex justify-end">
                <Button variant="ghost" size="sm">
                  Details anzeigen
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Tickets;