import { 
  BarChart3, 
  Users, 
  Briefcase, 
  Receipt, 
  TrendingUp, 
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  DollarSign
} from "lucide-react";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { ActivityCard } from "@/components/Dashboard/ActivityCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const stats = [
    {
      title: "Aktive Projekte",
      value: 24,
      change: "+12% diesen Monat",
      changeType: "positive" as const,
      icon: Briefcase,
      iconColor: "primary" as const
    },
    {
      title: "Gesamtumsatz",
      value: "CHF 48,350",
      change: "+8.2% vs. letzten Monat",
      changeType: "positive" as const,
      icon: DollarSign,
      iconColor: "success" as const
    },
    {
      title: "Mitarbeiter",
      value: 18,
      change: "+2 neue diese Woche",
      changeType: "positive" as const,
      icon: Users,
      iconColor: "secondary" as const
    },
    {
      title: "Offene Rechnungen",
      value: 7,
      change: "-3 seit gestern",
      changeType: "positive" as const,
      icon: Receipt,
      iconColor: "warning" as const
    }
  ];

  const upcomingTasks = [
    { id: 1, title: "Büroreinigung - Credit Suisse", time: "09:00", status: "in-progress" },
    { id: 2, title: "Fensterreinigung - UBS Tower", time: "14:00", status: "pending" },
    { id: 3, title: "Teppichreinigung - Hotel Baur", time: "16:30", status: "pending" },
    { id: 4, title: "Unterhaltsreinigung - Migros", time: "18:00", status: "completed" }
  ];

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Willkommen zurück! Hier ist eine Übersicht Ihrer Reinigungsfirma.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Feed */}
          <div className="lg:col-span-2">
            <ActivityCard />
          </div>

          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Heutige Termine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {task.time}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.status === "completed" && (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    )}
                    {task.status === "in-progress" && (
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        Läuft
                      </Badge>
                    )}
                    {task.status === "pending" && (
                      <AlertCircle className="w-4 h-4 text-warning" />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-success" />
                Monatsübersicht
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Projekte abgeschlossen</span>
                  <span className="font-medium">18/24</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Umsatzziel</span>
                  <span className="font-medium">CHF 48,350 / CHF 60,000</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Kundenzufriedenheit</span>
                  <span className="font-medium">4.8/5.0</span>
                </div>
                <Progress value={96} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Schnellaktionen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full p-3 text-left rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Neues Projekt erstellen</p>
                    <p className="text-xs text-muted-foreground">Projekt mit Kunde anlegen</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full p-3 text-left rounded-lg bg-secondary/5 hover:bg-secondary/10 transition-colors border border-secondary/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Receipt className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Rechnung erstellen</p>
                    <p className="text-xs text-muted-foreground">Neue Rechnung für Kunde</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full p-3 text-left rounded-lg bg-success/5 hover:bg-success/10 transition-colors border border-success/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Mitarbeiter hinzufügen</p>
                    <p className="text-xs text-muted-foreground">Neuen Mitarbeiter erfassen</p>
                  </div>
                </div>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
