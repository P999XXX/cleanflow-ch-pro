import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Smartphone, Search, Building2, Users, UserCheck } from "lucide-react";

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
  employees = [],
  showSections = false,
  isSearching,
  hasNoResults,
  onClearSearch,
  onCardClick,
  getStatusBadge,
}: ContactsTableViewProps) {
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
                  <TableHead className="lg:w-1/4">Ort</TableHead>
                  <TableHead className="lg:w-1/4">Kontakt</TableHead>
                  <TableHead className="text-right lg:w-1/4"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow 
                    key={company.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => onCardClick(company, 'company')}
                  >
                    <TableCell className="font-medium lg:w-1/4 lg:whitespace-nowrap">{company.name}</TableCell>
                    <TableCell className="lg:w-1/4 lg:whitespace-nowrap">
                      {company.city && company.postal_code ? `${company.postal_code} ${company.city}` : company.city || company.postal_code || '-'}
                    </TableCell>
                    <TableCell className="lg:w-1/4 lg:whitespace-nowrap">
                      <div className="flex flex-wrap lg:flex-nowrap items-center gap-3">
                        {company.email && (
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            <a 
                              href={`mailto:${company.email}`} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-foreground/70 hover:text-foreground transition-colors" 
                              onClick={(e) => e.stopPropagation()}
                            >
                              {company.email}
                            </a>
                          </div>
                        )}
                        {company.phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            <a 
                              href={`tel:${company.phone}`} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-foreground/70 hover:text-foreground transition-colors" 
                              onClick={(e) => e.stopPropagation()}
                            >
                              {company.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right lg:w-1/4 lg:whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        {getStatusBadge(company.status)}
                        {company.industry_category && (
                          <Badge 
                            variant="outline" 
                            className="bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400 font-medium"
                          >
                            {company.industry_category}
                          </Badge>
                        )}
                        {company.contact_type && (
                          <Badge 
                            variant="outline" 
                            className="bg-orange-500/10 text-orange-700 border-orange-500/20 dark:text-orange-400 font-medium"
                          >
                            {company.contact_type}
                          </Badge>
                        )}
                      </div>
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
                  <TableHead className="lg:w-1/4">Unternehmen</TableHead>
                  <TableHead className="lg:w-1/4">Kontakt</TableHead>
                  <TableHead className="text-right lg:w-1/4"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {persons.map((person) => (
                  <TableRow 
                    key={person.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => onCardClick(person, 'person')}
                  >
                    <TableCell className="font-medium lg:w-1/4 lg:whitespace-nowrap">
                      <div>
                        <div>{`${person.first_name} ${person.last_name}`}</div>
                        {person.position && <div className="text-sm text-muted-foreground">{person.position}</div>}
                      </div>
                    </TableCell>
                    <TableCell className="lg:w-1/4 lg:whitespace-nowrap">{person.customer_companies?.name || '-'}</TableCell>
                    <TableCell className="lg:w-1/4 lg:whitespace-nowrap">
                      <div className="flex flex-wrap lg:flex-nowrap items-center gap-3">
                        {person.email && (
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            <a 
                              href={`mailto:${person.email}`} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-foreground/70 hover:text-foreground transition-colors" 
                              onClick={(e) => e.stopPropagation()}
                            >
                              {person.email}
                            </a>
                          </div>
                        )}
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
                      </div>
                    </TableCell>
                    <TableCell className="text-right lg:w-1/4 lg:whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        {person.is_private_customer && (
                          <Badge variant="secondary" className="bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400 font-medium">
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {/* Employees Table */}
      {employees.length > 0 && (
        <div className="space-y-3">
          {showSections && (
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Mitarbeiter
              <Badge variant="secondary" className="ml-2 rounded-full bg-primary/10 text-primary border-0 px-2 py-0.5 text-xs font-medium">
                {employees.length}
              </Badge>
            </h3>
          )}
          <Card>
            <Table className="lg:table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="lg:w-1/4">Name</TableHead>
                  <TableHead className="lg:w-1/4">Position</TableHead>
                  <TableHead className="lg:w-1/4">Kontakt</TableHead>
                  <TableHead className="text-right lg:w-1/4"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow 
                    key={employee.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => onCardClick(employee, 'person')}
                  >
                    <TableCell className="font-medium lg:w-1/4 lg:whitespace-nowrap">
                      {`${employee.first_name} ${employee.last_name}`}
                    </TableCell>
                    <TableCell className="lg:w-1/4 lg:whitespace-nowrap">{employee.position || '-'}</TableCell>
                    <TableCell className="lg:w-1/4 lg:whitespace-nowrap">
                      <div className="flex flex-wrap lg:flex-nowrap items-center gap-3">
                        {employee.email && (
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            <a 
                              href={`mailto:${employee.email}`} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-foreground/70 hover:text-foreground transition-colors" 
                              onClick={(e) => e.stopPropagation()}
                            >
                              {employee.email}
                            </a>
                          </div>
                        )}
                        {employee.phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            <a 
                              href={`tel:${employee.phone}`} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-foreground/70 hover:text-foreground transition-colors" 
                              onClick={(e) => e.stopPropagation()}
                            >
                              {employee.phone}
                            </a>
                          </div>
                        )}
                        {employee.mobile && (
                          <div className="flex items-center gap-1 text-sm">
                            <Smartphone className="h-3 w-3" />
                            <a 
                              href={`tel:${employee.mobile}`} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-foreground/70 hover:text-foreground transition-colors" 
                              onClick={(e) => e.stopPropagation()}
                            >
                              {employee.mobile}
                            </a>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right lg:w-1/4 lg:whitespace-nowrap">
                      <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400 font-medium">
                        Mitarbeiter
                      </Badge>
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
