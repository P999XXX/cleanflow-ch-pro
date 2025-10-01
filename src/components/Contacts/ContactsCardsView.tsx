import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContactCard } from "./ContactCard";
import { Search, Building2, Users } from "lucide-react";

interface ContactsCardsViewProps {
  companies: any[];
  persons: any[];
  showSections?: boolean;
  isSearching: boolean;
  hasNoResults: boolean;
  onClearSearch: () => void;
  onCardClick: (item: any, type: 'company' | 'person') => void;
}

export function ContactsCardsView({
  companies,
  persons,
  showSections = false,
  isSearching,
  hasNoResults,
  onClearSearch,
  onCardClick,
}: ContactsCardsViewProps) {
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

      {/* Companies Section */}
      {companies.length > 0 && (
        <div className="space-y-4">
          {showSections && (
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Unternehmen
              <Badge variant="secondary" className="ml-2 rounded-full bg-primary/10 text-primary border-0 px-2 py-0.5 text-xs font-medium">
                {companies.length}
              </Badge>
            </h3>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {companies.map((company) => (
              <ContactCard 
                key={`company-${company.id}`} 
                item={company} 
                type="company"
                onCardClick={onCardClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Persons Section */}
      {persons.length > 0 && (
        <div className="space-y-4">
          {showSections && (
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Personen
              <Badge variant="secondary" className="ml-2 rounded-full bg-primary/10 text-primary border-0 px-2 py-0.5 text-xs font-medium">
                {persons.length}
              </Badge>
            </h3>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {persons.map((person) => (
              <ContactCard 
                key={`person-${person.id}`} 
                item={person} 
                type="person"
                onCardClick={onCardClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
