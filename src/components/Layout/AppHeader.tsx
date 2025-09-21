import { Bell, Search, Settings, User, LogOut, Moon, Sun, Home, CalendarDays, Users, FileText, Building, UserCheck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export function AppHeader() {
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="h-16 border-b border-border bg-background backdrop-blur-sm px-4 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-2 md:gap-4">
        <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground transition-colors" />
        
        {/* Main Navigation - Hidden on mobile */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <NavLink 
                  to="/" 
                  className={({ isActive }) => cn(
                    "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </NavLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <FileText className="mr-2 h-4 w-4" />
                Auftragswesen
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <NavLink
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        to="/angebote"
                      >
                        <FileText className="h-6 w-6" />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Angebote
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Kostenvoranschläge erstellen und verwalten
                        </p>
                      </NavLink>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <NavLink
                        to="/vertraege"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Verträge</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Reinigungsverträge verwalten
                        </p>
                      </NavLink>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <NavLink
                        to="/auftraege"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Aufträge</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Laufende Aufträge verwalten
                        </p>
                      </NavLink>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <NavLink
                        to="/rechnungen"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Rechnungen</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Rechnungsstellung und Zahlungen
                        </p>
                      </NavLink>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <Building className="mr-2 h-4 w-4" />
                Controlling
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <li>
                    <NavigationMenuLink asChild>
                      <NavLink
                        to="/objekte"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Objekte</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Reinigungsobjekte verwalten
                        </p>
                      </NavLink>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <NavLink
                        to="/einsatzplan"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Einsatzplan</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Einsätze und Termine planen
                        </p>
                      </NavLink>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <NavLink
                        to="/fahrzeuge"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Fahrzeuge</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Firmenfahrzeuge verwalten
                        </p>
                      </NavLink>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <NavLink
                        to="/materialschrank"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Materialschrank</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Materiallager verwalten
                        </p>
                      </NavLink>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <UserCheck className="mr-2 h-4 w-4" />
                Personal
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <li>
                    <NavigationMenuLink asChild>
                      <NavLink
                        to="/mitarbeiter"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Mitarbeiter</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Personalverwaltung
                        </p>
                      </NavLink>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <NavLink
                        to="/zeiterfassung"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Zeiterfassung</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Arbeitszeiten erfassen
                        </p>
                      </NavLink>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <NavLink
                        to="/stundenkontrolle"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Stundenkontrolle</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Arbeitsstunden kontrollieren
                        </p>
                      </NavLink>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <NavLink
                        to="/schulungen"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Schulungen</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Mitarbeiterschulungen verwalten
                        </p>
                      </NavLink>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <NavLink 
                  to="/kontakte" 
                  className={({ isActive }) => cn(
                    "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Kontakte
                </NavLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="relative max-w-md hidden sm:block lg:ml-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Suchen in CleanFlow..." 
            className="pl-10 bg-muted/50 border-0 focus:bg-background transition-colors"
          />
        </div>
        
        {/* Mobile Search Button */}
        <Button variant="ghost" size="sm" className="sm:hidden">
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 md:gap-3">
        {/* Chat */}
        <Button variant="ghost" size="sm" asChild>
          <NavLink to="/chat">
            <MessageCircle className="w-4 h-4" />
          </NavLink>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-destructive border-0" />
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback className="bg-gradient-primary text-white">
                  MW
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-background border shadow-lg" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">Max Weber</p>
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  max.weber@reinigungsfirma.ch
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <NavLink to="/profileinstellungen" className="flex w-full">
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <NavLink to="/einstellungen" className="flex w-full">
                <Settings className="mr-2 h-4 w-4" />
                <span>Einstellungen</span>
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Abmelden</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}