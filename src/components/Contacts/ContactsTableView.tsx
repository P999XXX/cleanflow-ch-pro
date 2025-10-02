import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Smartphone, Search, Building2, Users, ChevronRight } from "lucide-react";

interface ContactsTableViewProps {
  companies: any[];
  persons: any[];
  employees?: any[];
  showSections?: boolean;
  isSearching: boolean;
  hasNoResults: boolean;
  onClearSearch: () => void;
  onCardClick: (item: any, type: 'company' | 'person') => void;
  getStatusBadge: (status: string) => JSX.Element;
}

export function ContactsTableView({
  companies,
  persons,
  showSections = false,
  isSearching,
  hasNoResults,
  onClearSearch,
  onCardClick,
  getStatusBadge,
}: ContactsTableViewProps) {
  const getStatusBorderClass = (status?: string) => {
    switch (status) {
      case 'aktiv':
        return 'border-l-4 border-l-green-500';
      case 'inaktiv':
        return 'border-l-4 border-l-orange-500';
      default:
        return 'border-l-4 border-l-gray-300';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* No results message */}
      {isSearching && hasNoResults && (
        <div className="text-center py-12 text-muted-foreground animate-fade-in">
          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-lg font-medium mb-2">Keine Ergebnisse gefunden</p>
          <p className="text-sm">Versuchen Sie einen anderen Suchbegriff</p>
          <Button variant="outline" className="mt-4" onClick={onClearSearch}>
            Suche zurücksetzen
          </Button>
        </div>
      )}

      {/* Companies Table */}
      {companies.length > 0 && (
        <div className="space-y-3">
          {showSections && (
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Unternehmen
              <Badge variant="secondary" className="ml-2 rounded-full bg-primary/10 text-primary border-0 px-2 py-0.5 text-xs font-medium">
                {companies.length}
              </Badge>
            </h3>
          )}
          <Card>
            <Table className="lg:table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="lg:w-1/4">Name</TableHead>
                  <TableHead className="lg:w-1/4">E-Mail</TableHead>
                  <TableHead className="lg:w-1/4">Telefon</TableHead>
                  <TableHead className="text-right lg:w-1/4"></TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow 
                    key={company.id}
                    className={`cursor-pointer hover:bg-muted/50 transition-colors ${getStatusBorderClass(company.status)}`}
                    onClick={() => onCardClick(company, 'company')}
                  >
                    <TableCell className="font-medium lg:w-1/4">
                      <div>
                        <div>{company.name}</div>
                        {(company.city || company.postal_code) && (
                          <div className="text-sm text-muted-foreground font-light">
                            {company.city && company.postal_code ? `${company.postal_code} ${company.city}` : company.city || company.postal_code}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="lg:w-1/4 lg:whitespace-nowrap">
                      {company.email ? (
                        <a 
                          href={`mailto:${company.email}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground/70 hover:text-foreground transition-colors" 
                          onClick={(e) => e.stopPropagation()}
                        >
                          {company.email}
                        </a>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="lg:w-1/4 lg:whitespace-nowrap">
                      {company.phone ? (
                        <a 
                          href={`tel:${company.phone}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground/70 hover:text-foreground transition-colors" 
                          onClick={(e) => e.stopPropagation()}
                        >
                          {company.phone}
                        </a>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="text-right lg:w-1/4 lg:whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        {company.contact_type && (
                          <Badge 
                            variant="secondary" 
                            className={`${
                              company.contact_type.toLowerCase().includes('kunde') 
                                ? 'bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400' 
                                : 'bg-primary/10 text-primary border-primary/20'
                            } font-medium`}
                          >
                            {company.contact_type}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="w-12">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCardClick(company, 'company');
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {/* Persons Table */}
      {persons.length > 0 && (
        <div className="space-y-3">
          {showSections && (
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Personen
              <Badge variant="secondary" className="ml-2 rounded-full bg-primary/10 text-primary border-0 px-2 py-0.5 text-xs font-medium">
                {persons.length}
              </Badge>
            </h3>
          )}
          <Card>
            <Table className="lg:table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="lg:w-1/4">Name</TableHead>
                  <TableHead className="lg:w-1/4">E-Mail</TableHead>
                  <TableHead className="lg:w-1/4">Telefon</TableHead>
                  <TableHead className="text-right lg:w-1/4"></TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {persons.map((person) => (
                  <TableRow 
                    key={person.id}
                    className={`cursor-pointer hover:bg-muted/50 transition-colors ${getStatusBorderClass(person.status)}`}
                    onClick={() => onCardClick(person, 'person')}
                  >
                    <TableCell className="font-medium lg:w-1/4">
                      <div>
                        <div>{person.name}</div>
                        {person.position && <div className="text-sm text-muted-foreground font-light">{person.position}</div>}
                      </div>
                    </TableCell>
                    <TableCell className="lg:w-1/4 lg:whitespace-nowrap">
                      {person.email ? (
                        <a 
                          href={`mailto:${person.email}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground/70 hover:text-foreground transition-colors" 
                          onClick={(e) => e.stopPropagation()}
                        >
                          {person.email}
                        </a>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="lg:w-1/4 lg:whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {person.phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            <a 
                              href={`tel:${person.phone}`} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-foreground/70 hover:text-foreground transition-colors" 
                              onClick={(e) => e.stopPropagation()}
                            >
                              {person.phone}
                            </a>
                          </div>
                        )}
                        {person.mobile && (
                          <div className="flex items-center gap-1 text-sm">
                            <Smartphone className="h-3 w-3" />
                            <a 
                              href={`tel:${person.mobile}`} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-foreground/70 hover:text-foreground transition-colors" 
                              onClick={(e) => e.stopPropagation()}
                            >
                              {person.mobile}
                            </a>
                          </div>
                        )}
                        {!person.phone && !person.mobile && '-'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right lg:w-1/4 lg:whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        {person.is_employee && (
                          <Badge variant="secondary" className="bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400 font-medium">
                            Mitarbeiter
                          </Badge>
                        )}
                        {person.is_private_customer && (
                          <Badge variant="secondary" className="bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400 font-medium">
                            Privatkunde
                          </Badge>
                        )}
                        {person.is_primary_contact && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-medium">
                            Primär
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="w-12">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCardClick(person, 'person');
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}
    </div>
  );
}
