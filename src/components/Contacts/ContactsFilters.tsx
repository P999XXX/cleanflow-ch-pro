import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, X, Filter, Contact, Building, Users, Plus, Grid3X3, List } from "lucide-react";

interface ContactsFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onClearSearch: () => void;
  contactTypeFilter: string;
  onContactTypeChange: (type: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  totalCount: number;
  companiesCount: number;
  personsCount: number;
  viewMode: 'table' | 'cards';
  onViewModeToggle: () => void;
  onAddClick: () => void;
  isMobile: boolean;
}

export function ContactsFilters({
  searchTerm,
  onSearchChange,
  onClearSearch,
  contactTypeFilter,
  onContactTypeChange,
  activeTab,
  onTabChange,
  totalCount,
  companiesCount,
  personsCount,
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
            {viewMode === 'table' ? <Grid3X3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
          </Button>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search and Filter Row */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:flex-1">
            {/* Search */}
            <div className="relative flex-1 lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Suchen nach Name, E-Mail, Telefon..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 pr-9 w-full"
              />
              {searchTerm && (
                <button
                  onClick={onClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Contact Type Filter */}
            <div className="flex items-center gap-2 sm:min-w-[200px]">
              <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Select value={contactTypeFilter} onValueChange={onContactTypeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Kontaktart" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Kontaktarten</SelectItem>
                  <SelectItem value="kunde">Kunde</SelectItem>
                  <SelectItem value="interessent">Interessent</SelectItem>
                  <SelectItem value="lieferant">Lieferant</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

          {/* Tabs and Actions - Desktop */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
            <Tabs value={activeTab} onValueChange={onTabChange} className="w-full lg:w-auto">
              <TabsList className="grid grid-cols-3 lg:w-auto">
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
                    <span className="sm:hidden">Firma</span>
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
              </TabsList>
            </Tabs>

            {/* Desktop Controls */}
            <div className="hidden lg:flex flex-row gap-3 ml-auto">
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
        </div>
      </div>
    </div>
  );
}
