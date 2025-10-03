import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Sparkles, ChevronDown, ChevronRight } from "lucide-react";

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
import { NAVIGATION_GROUPS, DASHBOARD_ITEM } from "@/lib/navigationConfig";

export function AppSidebar() {
  const { open, openMobile, isMobile } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = isMobile ? !openMobile : !open;
  
  // Initialize all groups as closed except CRM
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    NAVIGATION_GROUPS.reduce((acc, group) => {
      acc[group.title] = group.title === "CRM";
      return acc;
    }, {} as Record<string, boolean>)
  );

  const toggleGroup = (groupTitle: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupTitle]: !prev[groupTitle]
    }));
  };

  const getNavClass = (isActive: boolean, isKundenFilter: boolean = false) =>
    cn(
      "w-full justify-start transition-all duration-200",
      isActive 
        ? "bg-primary text-primary-foreground shadow-clean-primary font-medium" 
        : isKundenFilter
        ? "bg-primary/20 text-primary font-medium"
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
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="font-bold text-lg text-foreground">CleanFlow</h1>
                <p className="text-xs text-muted-foreground">.ai</p>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Link - Single, no collapsible */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to={DASHBOARD_ITEM.url} 
                    className={getNavClass(currentPath === DASHBOARD_ITEM.url)}
                  >
                    <DASHBOARD_ITEM.icon className={cn(
                      "transition-colors",
                      collapsed ? "w-5 h-5" : "w-4 h-4 mr-3"
                    )} />
                    {!collapsed && (
                      <span className="text-base font-medium">
                        {DASHBOARD_ITEM.title}
                      </span>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Navigation Groups */}
        {NAVIGATION_GROUPS.map((group) => (
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
                      // Check if we're on Kontakte page with kunde filter for Kunden link
                      const searchParams = new URLSearchParams(location.search);
                      const isKundenFilter = item.url === '/kunden' && 
                        currentPath === '/kontakte' && 
                        searchParams.get('type') === 'kunde';
                      
                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild>
                            <NavLink 
                              to={item.url} 
                              className={getNavClass(isActive, isKundenFilter)}
                            >
                              <item.icon className={cn(
                                "transition-colors",
                                collapsed ? "w-5 h-5" : "w-4 h-4 mr-3"
                              )} />
                              {!collapsed && (
                                <span className="text-base font-medium">
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