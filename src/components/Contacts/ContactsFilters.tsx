import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, X, Filter, Building2, Users, Plus, Grid3X3, List, UserCheck, User, Briefcase } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ContactsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeTab: string;
  onTabChange: (value: string) => void;
  showCustomersOnly: boolean;
  onCustomerFilterToggle: () => void;
  counts: {
    all: number;
    companies: number;
    persons: number;
    employees: number;
  };
  viewMode: "table" | "cards";
  onViewModeChange: (mode: "table" | "cards") => void;
  onAddClick: () => void;
  onClearSearch: () => void;
}

export function ContactsFilters({
  searchTerm,
  onSearchChange,
  activeTab,
  onTabChange,
  showCustomersOnly,
  onCustomerFilterToggle,
  counts,
  viewMode,
  onViewModeChange,
  onAddClick,
  onClearSearch,
}: ContactsFiltersProps) {
  const isMobile = useIsMobile();
  const isTablet = !isMobile && window.innerWidth < 1024;
  const isDesktop = window.innerWidth >= 1024;

  return (
    <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-4 border-b">
      <div className="flex flex-col space-y-4">
        {/* Mobile/Tablet Layout */}
        {(isMobile || isTablet) && (
          <>
            {/* Title Row */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Kontakte</h1>
              {isTablet && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewModeChange(viewMode === "table" ? "cards" : "table")}
                  className="flex items-center gap-2"
                >
                  {viewMode === "table" ? <Grid3X3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
                </Button>
              )}
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Kontakte durchsuchen..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-9 bg-background/50 backdrop-blur-sm border-border/50 focus-visible:border-primary/50 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={onClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Suche löschen"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button
                variant={showCustomersOnly ? "default" : "outline"}
                size="sm"
                onClick={onCustomerFilterToggle}
                className="gap-2 whitespace-nowrap"
              >
                <Filter className="h-4 w-4" />
                Kunden
              </Button>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-4 h-10 bg-muted/30">
                <TabsTrigger value="alle" className="gap-1 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <Users className="h-4 w-4" />
                  <Badge variant="secondary" className="ml-1 bg-primary/10 text-primary text-xs px-1.5 py-0">
                    {counts.all}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="unternehmen" className="gap-1 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <Building2 className="h-4 w-4" />
                  <Badge variant="secondary" className="ml-1 bg-primary/10 text-primary text-xs px-1.5 py-0">
                    {counts.companies}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="personen" className="gap-1 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <User className="h-4 w-4" />
                  <Badge variant="secondary" className="ml-1 bg-primary/10 text-primary text-xs px-1.5 py-0">
                    {counts.persons}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="mitarbeiter" className="gap-1 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <Briefcase className="h-4 w-4" />
                  <Badge variant="secondary" className="ml-1 bg-primary/10 text-primary text-xs px-1.5 py-0">
                    {counts.employees}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Add Button */}
            <Button onClick={onAddClick} size="sm" className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Hinzufügen
            </Button>
          </>
        )}

        {/* Desktop Layout */}
        {isDesktop && (
          <>
            {/* Title Row */}
            <div className="flex items-center justify-between px-6">
              <h1 className="text-2xl font-bold">Kontakte</h1>
            </div>

            {/* Tabs - Above Search */}
            <Tabs value={activeTab} onValueChange={onTabChange} className="w-full px-6">
              <TabsList className="grid w-full grid-cols-4 h-10 bg-muted/30">
                <TabsTrigger value="alle" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Alle</span>
                  <Badge variant="secondary" className="ml-1 bg-primary/10 text-primary text-xs px-1.5 py-0">
                    {counts.all}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="unternehmen" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <Building2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Unternehmen</span>
                  <Badge variant="secondary" className="ml-1 bg-primary/10 text-primary text-xs px-1.5 py-0">
                    {counts.companies}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="personen" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Personen</span>
                  <Badge variant="secondary" className="ml-1 bg-primary/10 text-primary text-xs px-1.5 py-0">
                    {counts.persons}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="mitarbeiter" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <Briefcase className="h-4 w-4" />
                  <span className="hidden sm:inline">Mitarbeiter</span>
                  <Badge variant="secondary" className="ml-1 bg-primary/10 text-primary text-xs px-1.5 py-0">
                    {counts.employees}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Search and Actions */}
            <div className="flex items-center gap-4 px-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Kontakte durchsuchen..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-9 h-10 bg-background/50 backdrop-blur-sm border-border/50 focus-visible:border-primary/50 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={onClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Suche löschen"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button
                variant={showCustomersOnly ? "default" : "outline"}
                size="sm"
                onClick={onCustomerFilterToggle}
                className="gap-2 whitespace-nowrap"
              >
                <Filter className="h-4 w-4" />
                Nur Kunden
              </Button>
              <div className="ml-auto flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewModeChange(viewMode === "table" ? "cards" : "table")}
                  className="gap-2"
                >
                  {viewMode === "table" ? (
                    <>
                      <Grid3X3 className="h-4 w-4" />
                      Karten
                    </>
                  ) : (
                    <>
                      <List className="h-4 w-4" />
                      Tabelle
                    </>
                  )}
                </Button>
                <Button onClick={onAddClick} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Hinzufügen
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
