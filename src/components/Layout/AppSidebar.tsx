import { useState } from "react";
import {
  BarChart3,
  Briefcase,
  Calendar,
  Clock,
  FileText,
  ShoppingCart,
  Receipt,
  Package,
  Users,
  UserCheck,
  Ticket,
  Settings,
  Building2,
  DollarSign,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const navigationItems = [
  {
    title: "Hauptbereich",
    items: [
      { title: "Dashboard", url: "/", icon: BarChart3 },
    ]
  },
  {
    title: "Projektmanagement",
    items: [
      { title: "Projekte", url: "/projekte", icon: Briefcase },
      { title: "Einsatzplanung", url: "/einsatzplanung", icon: Calendar },
      { title: "Zeiterfassung", url: "/zeiterfassung", icon: Clock },
    ]
  },
  {
    title: "Geschäftsprozesse",
    items: [
      { title: "Offerten", url: "/offerten", icon: FileText },
      { title: "Aufträge", url: "/auftraege", icon: ShoppingCart },
      { title: "Rechnungen", url: "/rechnungen", icon: Receipt },
      { title: "Materialien", url: "/materialien", icon: Package },
    ]
  },
  {
    title: "Verwaltung",
    items: [
      { title: "Kunden", url: "/kunden", icon: Users },
      { title: "Mitarbeiter", url: "/mitarbeiter", icon: UserCheck },
      { title: "Tickets", url: "/tickets", icon: Ticket },
    ]
  },
  {
    title: "System",
    items: [
      { title: "Admin", url: "/admin", icon: Settings },
      { title: "Lohnabrechnung", url: "/lohnabrechnung", icon: DollarSign },
      { title: "Berichte", url: "/berichte", icon: BarChart3 },
      { title: "Einstellungen", url: "/einstellungen", icon: Settings },
    ]
  }
];

export function AppSidebar() {
  const { open, openMobile, isMobile } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = isMobile ? !openMobile : !open;
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Hauptbereich": true,
    "Projektmanagement": true,
    "Geschäftsprozesse": false,
    "Verwaltung": false,
    "System": false,
  });

  const toggleGroup = (groupTitle: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupTitle]: !prev[groupTitle]
    }));
  };

  const getNavClass = (isActive: boolean) =>
    cn(
      "w-full justify-start transition-all duration-200",
      isActive 
        ? "bg-primary text-primary-foreground shadow-clean-primary font-medium" 
        : "hover:bg-accent hover:text-accent-foreground text-foreground"
    );

  return (
    <Sidebar className={cn(
      "border-border bg-card transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <SidebarContent>
        {/* Logo Section */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="font-bold text-lg text-foreground">CleanFlow</h1>
                <p className="text-xs text-muted-foreground">.ai</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Groups */}
        {navigationItems.map((group) => (
          <SidebarGroup key={group.title}>
            <Collapsible
              open={openGroups[group.title]}
              onOpenChange={() => toggleGroup(group.title)}
            >
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className={cn(
                  "cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md px-2 py-1 transition-colors text-foreground",
                  collapsed ? "justify-center" : "justify-between"
                )}>
                  {!collapsed && (
                    <>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {group.title}
                      </span>
                      {openGroups[group.title] ? (
                        <ChevronDown className="w-3 h-3 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-muted-foreground" />
                      )}
                    </>
                  )}
                </SidebarGroupLabel>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => {
                      const isActive = currentPath === item.url;
                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild>
                            <NavLink 
                              to={item.url} 
                              className={getNavClass(isActive)}
                            >
                              <item.icon className={cn(
                                "transition-colors",
                                collapsed ? "w-5 h-5" : "w-4 h-4 mr-3"
                              )} />
                              {!collapsed && (
                                <span className="text-sm font-medium">
                                  {item.title}
                                </span>
                              )}
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}