import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, X, Contact, Building, Users, Plus, Grid3X3, List, UserCheck } from "lucide-react";

interface ContactsFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onClearSearch: () => void;
  showCustomersOnly: boolean;
  onCustomerFilterToggle: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  totalCount: number;
  companiesCount: number;
  personsCount: number;
  employeesCount: number;
  viewMode: 'table' | 'cards';
  onViewModeToggle: () => void;
  onAddClick: () => void;
  isMobile: boolean;
}

export function ContactsFilters({
  searchTerm,
  onSearchChange,
  onClearSearch,
  showCustomersOnly,
  onCustomerFilterToggle,
  activeTab,
  onTabChange,
  totalCount,
  companiesCount,
  personsCount,
  employeesCount,
  viewMode,
  onViewModeToggle,
  onAddClick,
  isMobile,
}: ContactsFiltersProps) {
  return (
    <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-4 border-b">
      <div className="flex flex-col space-y-4">
        {/* Title with View Toggle for Tablet */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Kontakte</h1>
          {/* View Mode Toggle - Tablet only */}
          <Button
            variant="outline"
            size="sm"
            onClick={onViewModeToggle}
            className="hidden md:flex lg:hidden items-center gap-2"
          >
            {viewMode === 'table' ? (
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
        </div>

        <div className="flex flex-col space-y-4">
          {/* Search and Desktop Actions Container */}
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search Bar with Clear Button */}
            <div className="relative flex-1 lg:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Suchen nach Name, E-Mail, Ort..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 pr-9"
              />
              {searchTerm && (
                <button
                  onClick={onClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Customer Filter Toggle - Mobile/Tablet: below search */}
            {(activeTab === 'all' || activeTab === 'companies' || activeTab === 'persons') && (
              <div className="lg:hidden">
                <Button
                  variant={showCustomersOnly ? "default" : "outline"}
                  size="sm"
                  onClick={onCustomerFilterToggle}
                  className="flex items-center gap-2 w-full"
                >
                  <UserCheck className="h-4 w-4" />
                  {showCustomersOnly ? 'Alle anzeigen' : 'Nur Kunden'}
                </Button>
              </div>
            )}

            {/* Customer Filter Toggle - Desktop: next to search */}
            {(activeTab === 'all' || activeTab === 'companies' || activeTab === 'persons') && (
              <div className="hidden lg:block">
                <Button
                  variant={showCustomersOnly ? "default" : "outline"}
                  size="sm"
                  onClick={onCustomerFilterToggle}
                  className="flex items-center gap-2"
                >
                  <UserCheck className="h-4 w-4" />
                  {showCustomersOnly ? 'Alle anzeigen' : 'Nur Kunden'}
                </Button>
              </div>
            )}
          </div>

          {/* Add Button - Mobile/Tablet only */}
          <div className="lg:hidden">
            <Button
              onClick={onAddClick}
              size="sm"
              className="flex items-center gap-2 w-full"
            >
              <Plus className="h-4 w-4" />
              Hinzufügen
            </Button>
          </div>

          {/* Tabs and Actions - Desktop: on same line */}
          <div className="hidden lg:flex lg:items-start gap-6 flex-1">
            <Tabs value={activeTab} onValueChange={onTabChange} className="w-auto">
              <TabsList className="grid grid-cols-4 w-auto">
                <TabsTrigger value="all" className="flex items-center gap-1 px-2">
                  <Contact className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">Alle</span>
                  <Badge 
                    variant="secondary" 
                    className={`ml-0.5 rounded-full bg-primary/10 text-primary border-0 px-1.5 py-0.5 text-xs ${
                      activeTab === 'all' ? 'font-bold' : 'font-medium'
                    }`}
                  >
                    {totalCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="companies" className="flex items-center gap-1 px-2">
                  <Building className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">
                    <span className="hidden sm:inline">Unternehmen</span>
                    <span className="sm:hidden">Firmen</span>
                  </span>
                  <Badge 
                    variant="secondary" 
                    className={`ml-0.5 rounded-full bg-primary/10 text-primary border-0 px-1.5 py-0.5 text-xs ${
                      activeTab === 'companies' ? 'font-bold' : 'font-medium'
                    }`}
                  >
                    {companiesCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="persons" className="flex items-center gap-1 px-2">
                  <Users className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">Personen</span>
                  <Badge 
                    variant="secondary" 
                    className={`ml-0.5 rounded-full bg-primary/10 text-primary border-0 px-1.5 py-0.5 text-xs ${
                      activeTab === 'persons' ? 'font-bold' : 'font-medium'
                    }`}
                  >
                    {personsCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="employees" className="flex items-center gap-1 px-2">
                  <UserCheck className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">Mitarbeiter</span>
                  <Badge 
                    variant="secondary" 
                    className={`ml-0.5 rounded-full bg-primary/10 text-primary border-0 px-1.5 py-0.5 text-xs ${
                      activeTab === 'employees' ? 'font-bold' : 'font-medium'
                    }`}
                  >
                    {employeesCount}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Desktop Controls */}
            <div className="flex flex-row gap-3 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={onViewModeToggle}
                className="flex items-center gap-2"
              >
                {viewMode === 'table' ? (
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
              <Button onClick={onAddClick} size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Hinzufügen
              </Button>
            </div>
          </div>

          {/* Mobile/Tablet: Show tabs below search */}
          <div className="lg:hidden -mx-4 px-4">
            <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
              <div className="overflow-x-auto no-scrollbar">
                <TabsList className="inline-flex w-auto min-w-full">
                  <TabsTrigger value="all" className="flex items-center gap-1.5 px-3 whitespace-nowrap">
                    <Contact className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">Alle</span>
                    <Badge 
                      variant="secondary" 
                      className={`ml-0.5 rounded-full bg-primary/10 text-primary border-0 px-1.5 py-0.5 text-xs ${
                        activeTab === 'all' ? 'font-bold' : 'font-medium'
                      }`}
                    >
                      {totalCount}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="companies" className="flex items-center gap-1.5 px-3 whitespace-nowrap">
                    <Building className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">Unternehmen</span>
                    <Badge 
                      variant="secondary" 
                      className={`ml-0.5 rounded-full bg-primary/10 text-primary border-0 px-1.5 py-0.5 text-xs ${
                        activeTab === 'companies' ? 'font-bold' : 'font-medium'
                      }`}
                    >
                      {companiesCount}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="persons" className="flex items-center gap-1.5 px-3 whitespace-nowrap">
                    <Users className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">Personen</span>
                    <Badge 
                      variant="secondary" 
                      className={`ml-0.5 rounded-full bg-primary/10 text-primary border-0 px-1.5 py-0.5 text-xs ${
                        activeTab === 'persons' ? 'font-bold' : 'font-medium'
                      }`}
                    >
                      {personsCount}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="employees" className="flex items-center gap-1.5 px-3 whitespace-nowrap">
                    <UserCheck className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">Mitarbeiter</span>
                    <Badge 
                      variant="secondary" 
                      className={`ml-0.5 rounded-full bg-primary/10 text-primary border-0 px-1.5 py-0.5 text-xs ${
                        activeTab === 'employees' ? 'font-bold' : 'font-medium'
                      }`}
                    >
                      {employeesCount}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}