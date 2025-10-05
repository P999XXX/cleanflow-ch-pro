import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Search, X, Plus, Filter, LayoutGrid, Table as TableIcon, ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";

interface EnhancedContactsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
  viewMode: 'cards' | 'table';
  onViewModeToggle: () => void;
  onAddClick?: () => void;
  isMobile: boolean;
  availableContactTypes: string[];
  typeCounts: Record<string, number>;
}

export function EnhancedContactsFilters({
  searchTerm,
  onSearchChange,
  onClearSearch,
  selectedTypes,
  onTypesChange,
  viewMode,
  onViewModeToggle,
  onAddClick,
  isMobile,
  availableContactTypes,
  typeCounts,
}: EnhancedContactsFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleTypeToggle = (type: string) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  };

  const handleClearFilters = () => {
    onTypesChange([]);
  };

  const handleSelectAll = () => {
    onTypesChange(availableContactTypes);
  };

  const activeFilterCount = selectedTypes.length;
  const allSelected = selectedTypes.length === availableContactTypes.length;

  return (
    <div className="space-y-4">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Kontakte durchsuchen (Name, E-Mail, Telefon, Adresse)..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
              onClick={onClearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filter Dropdown */}
        <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="h-4 w-4 mr-2" />
              Filter
              {activeFilterCount > 0 && (
                <Badge 
                  variant="secondary" 
                  className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground"
                >
                  {activeFilterCount}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Kontakttypen</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Select All / Clear All */}
            <div className="flex gap-2 px-2 py-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 h-8 text-xs"
                onClick={handleSelectAll}
                disabled={allSelected}
              >
                Alle auswählen
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 h-8 text-xs"
                onClick={handleClearFilters}
                disabled={activeFilterCount === 0}
              >
                Zurücksetzen
              </Button>
            </div>

            <DropdownMenuSeparator />

            {/* Type Checkboxes with Counts */}
            {availableContactTypes.map((type) => {
              const count = typeCounts[type] || 0;
              const isChecked = selectedTypes.includes(type);
              
              return (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={isChecked}
                  onCheckedChange={() => handleTypeToggle(type)}
                  className="flex items-center justify-between"
                >
                  <span>{type}</span>
                  <Badge 
                    variant="secondary" 
                    className="ml-2 bg-muted text-muted-foreground font-normal"
                  >
                    {count}
                  </Badge>
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View Toggle (Desktop Only) */}
        {!isMobile && (
          <Button
            variant="outline"
            size="icon"
            onClick={onViewModeToggle}
            title={viewMode === 'cards' ? 'Zur Tabellenansicht wechseln' : 'Zur Kartenansicht wechseln'}
          >
            {viewMode === 'cards' ? (
              <TableIcon className="h-4 w-4" />
            ) : (
              <LayoutGrid className="h-4 w-4" />
            )}
          </Button>
        )}

        {/* Add Button */}
        {onAddClick && (
          <Button onClick={onAddClick} className="whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" />
            {!isMobile && 'Hinzufügen'}
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Aktive Filter:</span>
          {selectedTypes.map((type) => (
            <Badge
              key={type}
              variant="secondary"
              className="gap-1 pr-1 cursor-pointer hover:bg-secondary/80"
              onClick={() => handleTypeToggle(type)}
            >
              {type}
              <X className="h-3 w-3" />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={handleClearFilters}
          >
            Alle entfernen
          </Button>
        </div>
      )}
    </div>
  );
}
