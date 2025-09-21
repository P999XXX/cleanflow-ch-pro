import { Bell, Search, Settings, User, LogOut, Moon, Sun, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

export function AppHeader() {
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();
  const { getDisplayName, getEmail } = useProfile();
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
        
        <div className="relative max-w-md hidden sm:block ml-4">
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
        <Button variant="ghost" size="sm" className="relative" asChild>
          <NavLink to="/benachrichtigungen">
            <Bell className="w-4 h-4" />
            <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-destructive border-0" />
          </NavLink>
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
                <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                  {getDisplayName().split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-background border shadow-lg z-50" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{getDisplayName()}</p>
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {getEmail()}
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