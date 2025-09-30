import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, X, Filter, Contact, Building, Users, Plus, Grid3X3, List } from "lucide-react";
import { useState, useMemo, useEffect } from "react";

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
  availableContactTypes: string[];
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
  availableContactTypes,
}: ContactsFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDesktopFilterOpen, setIsDesktopFilterOpen] = useState(false);

  // Generate filter options from available contact types
  const filterOptions = useMemo(() => {
    return availableContactTypes.map(type => ({
      value: type,
      label: type.charAt(0).toUpperCase() + type.slice(1)
    }));
  }, [availableContactTypes]);

  // Sync selectedFilters with contactTypeFilter prop
  useEffect(() => {
    if (contactTypeFilter === 'all') {
      setSelectedFilters([]);
    } else {
      setSelectedFilters(contactTypeFilter.split(','));
    }
  }, [contactTypeFilter]);

  const handleFilterToggle = (value: string) => {
    const newFilters = selectedFilters.includes(value)
      ? selectedFilters.filter(f => f !== value)
      : [...selectedFilters, value];
    setSelectedFilters(newFilters);
    
    // Update parent component with "all" if no filters selected, otherwise join filters
    onContactTypeChange(newFilters.length === 0 ? "all" : newFilters.join(","));
  };

  const clearFilters = () => {
    setSelectedFilters([]);
    onContactTypeChange("all");
  };

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
        <div className="flex flex-col gap-4">
          {/* Top Row: Search, Filter, Tabs, Actions */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-4">
            {/* Search and Filter */}
            <div className="flex items-center gap-2">
              {/* Search with integrated filter for Mobile/Tablet only */}
              <div className="relative flex-1 lg:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Input
                  placeholder="Suchen nach Name, E-Mail, Telefon..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className={`pl-9 w-full ${searchTerm ? 'pr-16 lg:pr-10' : 'pr-10 lg:pr-3'}`}
                />
                {searchTerm && (
                  <button
                    onClick={onClearSearch}
                    className="absolute right-10 lg:right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                
                {/* Filter Icon in Search Field - Mobile/Tablet only */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 lg:hidden">
                  <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <PopoverTrigger asChild>
                      <button className="text-primary hover:text-primary/80 transition-colors relative bg-primary/10 hover:bg-primary/20 rounded-md p-1.5">
                        <Filter className="h-4 w-4" />
                        {selectedFilters.length > 0 && (
                          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-primary rounded-full border border-background" />
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-4 bg-background border shadow-lg" align="end">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">Kontaktart Filter</h4>
                          {selectedFilters.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={clearFilters}
                              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                            >
                              Zurücksetzen
                            </Button>
                          )}
                        </div>
                        <div className="space-y-3">
                          {filterOptions.map((option) => (
                            <div key={option.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={`mobile-${option.value}`}
                                checked={selectedFilters.includes(option.value)}
                                onCheckedChange={() => handleFilterToggle(option.value)}
                              />
                              <label
                                htmlFor={`mobile-${option.value}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Desktop Filter Button - next to search */}
              <div className="hidden lg:block">
                <Popover open={isDesktopFilterOpen} onOpenChange={setIsDesktopFilterOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 relative"
                    >
                      <Filter className="h-4 w-4" />
                      Kontaktart
                      {selectedFilters.length > 0 && (
                        <Badge variant="secondary" className="ml-1 px-1.5 py-0 h-5 min-w-5 flex items-center justify-center bg-primary text-primary-foreground">
                          {selectedFilters.length}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-4 bg-background border shadow-lg z-50" align="end">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">Kontaktart Filter</h4>
                        {selectedFilters.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                          >
                            Zurücksetzen
                          </Button>
                        )}
                      </div>
                      <div className="space-y-3">
                        {filterOptions.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`desktop-${option.value}`}
                              checked={selectedFilters.includes(option.value)}
                              onCheckedChange={() => handleFilterToggle(option.value)}
                            />
                            <label
                              htmlFor={`desktop-${option.value}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
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

            {/* Tabs and Desktop Actions */}
            <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:flex-1 lg:justify-between">
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
              <div className="hidden lg:flex flex-row gap-3">
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

          {/* Filter Badges - Separate Row */}
          {selectedFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedFilters.map((filter) => (
                <Badge
                  key={filter}
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20 pl-2 pr-1 py-1 flex items-center gap-1"
                >
                  {filterOptions.find(o => o.value === filter)?.label}
                  <button
                    onClick={() => handleFilterToggle(filter)}
                    className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
