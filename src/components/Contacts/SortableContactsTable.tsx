import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal, Mail, Phone, Trash2, Edit } from 'lucide-react';

type SortDirection = 'asc' | 'desc' | null;
type SortColumn = 'name' | 'type' | 'email' | 'phone' | 'status' | null;

interface SortableContactsTableProps {
  companies: any[];
  persons: any[];
  onCardClick: (item: any, type: 'company' | 'person') => void;
  onEdit?: (item: any, type: 'company' | 'person') => void;
  onDelete?: (item: any, type: 'company' | 'person') => void;
  getStatusBadge: (status: string) => React.ReactNode;
}

export function SortableContactsTable({
  companies,
  persons,
  onCardClick,
  onEdit,
  onDelete,
  getStatusBadge,
}: SortableContactsTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Combine and transform data
  const allItems = useMemo(() => {
    const companyItems = companies.map((c) => ({
      ...c,
      type: 'company' as const,
      displayName: c.name,
    }));
    const personItems = persons.map((p) => ({
      ...p,
      type: 'person' as const,
      displayName: `${p.first_name} ${p.last_name}`,
    }));
    return [...companyItems, ...personItems];
  }, [companies, persons]);

  // Sorted items
  const sortedItems = useMemo(() => {
    if (!sortColumn || !sortDirection) return allItems;

    return [...allItems].sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (sortColumn) {
        case 'name':
          aVal = a.displayName.toLowerCase();
          bVal = b.displayName.toLowerCase();
          break;
        case 'type':
          aVal = a.contact_type || (a.type === 'company' ? 'Unternehmen' : 'Person');
          bVal = b.contact_type || (b.type === 'company' ? 'Unternehmen' : 'Person');
          break;
        case 'email':
          aVal = a.email || '';
          bVal = b.email || '';
          break;
        case 'phone':
          aVal = a.phone || a.mobile || '';
          bVal = b.phone || b.mobile || '';
          break;
        case 'status':
          aVal = a.status || 'aktiv';
          bVal = b.status || 'aktiv';
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [allItems, sortColumn, sortDirection]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(sortedItems.map((item) => item.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const allSelected = sortedItems.length > 0 && selectedIds.size === sortedItems.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < sortedItems.length;

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedIds.size} ausgewählt
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Implement bulk delete
              console.log('Bulk delete:', Array.from(selectedIds));
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Löschen
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedIds(new Set())}
          >
            Abbrechen
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Alle auswählen"
                  className={someSelected ? 'data-[state=checked]:bg-primary/50' : ''}
                />
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 flex items-center gap-2"
                  onClick={() => handleSort('name')}
                >
                  Name
                  {getSortIcon('name')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 flex items-center gap-2"
                  onClick={() => handleSort('type')}
                >
                  Typ
                  {getSortIcon('type')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 flex items-center gap-2"
                  onClick={() => handleSort('email')}
                >
                  E-Mail
                  {getSortIcon('email')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 flex items-center gap-2"
                  onClick={() => handleSort('phone')}
                >
                  Telefon
                  {getSortIcon('phone')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 flex items-center gap-2"
                  onClick={() => handleSort('status')}
                >
                  Status
                  {getSortIcon('status')}
                </Button>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedItems.map((item) => (
              <TableRow
                key={item.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onCardClick(item, item.type)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.has(item.id)}
                    onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                    aria-label={`${item.displayName} auswählen`}
                  />
                </TableCell>
                <TableCell className="font-medium">{item.displayName}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {item.contact_type || (item.type === 'company' ? 'Unternehmen' : 'Person')}
                  </Badge>
                </TableCell>
                <TableCell>
                  {item.email && (
                    <a
                      href={`mailto:${item.email}`}
                      className="flex items-center gap-2 text-sm hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Mail className="h-3 w-3" />
                      {item.email}
                    </a>
                  )}
                </TableCell>
                <TableCell>
                  {(item.phone || item.mobile) && (
                    <a
                      href={`tel:${item.phone || item.mobile}`}
                      className="flex items-center gap-2 text-sm hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Phone className="h-3 w-3" />
                      {item.phone || item.mobile}
                    </a>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(item.status || 'aktiv')}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(item, item.type)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Bearbeiten
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem
                          onClick={() => onDelete(item, item.type)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Löschen
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {sortedItems.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Keine Kontakte vorhanden
        </div>
      )}
    </div>
  );
}
