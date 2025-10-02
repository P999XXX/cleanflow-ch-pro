import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, X, Filter, Contact, Building, Users, Plus, Grid3X3, List, UserCheck } from "lucide-react";
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
  businessCustomersCount?: number;
  privateCustomersCount?: number;
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
  businessCustomersCount = 0,
  privateCustomersCount = 0,
  viewMode,
  onViewModeToggle,
  onAddClick,
  isMobile,
  availableContactTypes,
}: ContactsFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDesktopFilterOpen, setIsDesktopFilterOpen] = useState(false);

  // Generate filter options based on active tab - tab-specific filtering
  const filterOptions = useMemo(() => {
    let filteredTypes = availableContactTypes;
    
    // Filter options based on active tab
    if (activeTab === 'persons') {
      // For persons tab: show only person-related types (exclude company types)
      filteredTypes = availableContactTypes.filter(type => 
        type !== 'Unternehmen' && type !== 'Geschäftskunde'
      );
    } else if (activeTab === 'companies') {
      // For companies tab: show only company types (Unternehmen and Geschäftskunde)
      filteredTypes = availableContactTypes.filter(type => 
        type === 'Unternehmen' || type === 'Geschäftskunde'
      );
    }
    
    // Return only specific contact types - no "Alle Kontaktarten" option
    return filteredTypes.map(type => ({
      value: type,
      label: type.charAt(0).toUpperCase() + type.slice(1)
    }));
  }, [availableContactTypes, activeTab]);

  // Sync selectedFilters with contactTypeFilter prop
  useEffect(() => {
    if (contactTypeFilter === 'all') {
      setSelectedFilters([]);
    } else {
      setSelectedFilters(contactTypeFilter.split(',').filter(Boolean));
    }
  }, [contactTypeFilter]);

  // Simplified filter toggle - only specific contact types
  const handleFilterToggle = (value: string) => {
    const newFilters = selectedFilters.includes(value)
      ? selectedFilters.filter(f => f !== value)
      : [...selectedFilters, value];
    setSelectedFilters(newFilters);
    
    // Update parent: "all" if no filters selected, otherwise join filters
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
          {/* Top Row - Desktop: Search/Filter + Tabs + Buttons on same line */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-4">
            {/* Search and Filter - Mobile/Tablet/Desktop */}
            <div className="flex items-center gap-2 flex-1 lg:max-w-md">
              {/* Search with integrated filter for Mobile/Tablet only */}
              <div className="relative flex-1">
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
                        Filter
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

            {/* Filter Badges - Mobile/Tablet only, directly after search */}
            {selectedFilters.length > 0 && (
              <div className="lg:hidden flex flex-wrap gap-2">
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
                <TabsList className="grid grid-cols-3 w-auto">
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
                  </TabsList>
                </div>
              </Tabs>
            </div>
          </div>

          {/* Filter Badges - Desktop only, on new line below search/tabs */}
          {selectedFilters.length > 0 && (
            <div className="hidden lg:flex flex-wrap gap-2">
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
