import {
  BarChart3,
  Calendar,
  Clock,
  FileText,
  ShoppingCart,
  Receipt,
  Package,
  Users,
  UserCheck,
  Building2,
  CalendarDays,
  Car,
  MessageSquare,
  CheckSquare,
  UserX,
  GraduationCap,
  Smartphone,
  AlertTriangle,
  Briefcase,
  Home,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface NavigationItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

export const NAVIGATION_GROUPS: NavigationGroup[] = [
  {
    title: "CRM",
    items: [
      { title: "Kontakte", url: "/kontakte", icon: Users },
      { title: "Terminkalender", url: "/terminkalender", icon: CalendarDays },
    ]
  },
  {
    title: "Objekte",
    items: [
      { title: "Objekte", url: "/objekte", icon: Building2 },
      { title: "Offerten", url: "/offerten", icon: FileText },
      { title: "Aufträge", url: "/auftraege", icon: ShoppingCart },
      { title: "Reklamationen", url: "/reklamationen", icon: AlertTriangle },
      { title: "Materialschrank", url: "/materialschrank", icon: Briefcase },
      { title: "Rechnungen", url: "/rechnungen", icon: Receipt },
    ]
  },
  {
    title: "Controlling",
    items: [
      { title: "Einsatzplan", url: "/einsatzplan", icon: Calendar },
      { title: "Fahrzeuge", url: "/fahrzeuge", icon: Car },
      { title: "Materialschrank", url: "/materialschrank", icon: Briefcase },
      { title: "QS Kontrollen", url: "/qs-kontrollen", icon: CheckSquare },
    ]
  },
  {
    title: "Personal",
    items: [
      { title: "Mitarbeiter", url: "/mitarbeiter", icon: UserCheck },
      { title: "Zeiterfassung", url: "/zeiterfassung", icon: Clock },
      { title: "Stundenkontrolle", url: "/stundenkontrolle", icon: BarChart3 },
      { title: "Abwesenheiten", url: "/abwesenheiten", icon: UserX },
      { title: "Schulungen", url: "/schulungen", icon: GraduationCap },
      { title: "Mitarbeiter Chat", url: "/mitarbeiter-chat", icon: MessageSquare },
      { title: "Mitarbeiter App", url: "/mitarbeiter-app", icon: Smartphone },
    ]
  }
];

export const DASHBOARD_ITEM: NavigationItem = {
  title: "Dashboard",
  url: "/",
  icon: Home,
};
