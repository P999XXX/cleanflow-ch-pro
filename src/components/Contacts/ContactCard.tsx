import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Smartphone, MapPin, Building2 } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badges";

interface ContactCardProps {
  item: any;
  type: 'company' | 'person';
  onCardClick: (item: any, type: 'company' | 'person') => void;
}

export function ContactCard({ item, type, onCardClick }: ContactCardProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline'; className: string }> = {
      aktiv: { 
        label: 'Aktiv', 
        variant: 'default',
        className: 'bg-success/10 text-success border-success/20'
      },
      inaktiv: { 
        label: 'Inaktiv', 
        variant: 'secondary',
        className: 'bg-muted text-muted-foreground border-muted'
      },
      potentiell: { 
        label: 'Potentiell', 
        variant: 'outline',
        className: 'bg-primary/10 text-primary border-primary/20'
      },
    };
    const config = statusConfig[status] || statusConfig.aktiv;
    return (
      <Badge 
        variant={config.variant} 
        className={`${config.className} font-medium border`}
      >
        {config.label}
      </Badge>
    );
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-all duration-200 animate-fade-in hover:scale-[1.02] active:scale-[0.98] h-full flex flex-col"
      onClick={() => onCardClick(item, type)}
    >
      <CardHeader className="pb-3 relative">
        {/* Badges positioned at top-right */}
        <div className="absolute top-3 right-3 flex items-start gap-1 flex-wrap justify-end max-w-[60%]">
          {type === 'company' ? (
            <>
              <Badge 
                variant={getStatusBadge(item.status).props.variant}
                className={`${getStatusBadge(item.status).props.className} font-medium text-[10px] px-1.5 py-0.5`}
              >
                {getStatusBadge(item.status).props.children}
              </Badge>
              {item.industry_category && (
                <Badge 
                  variant="outline" 
                  className="bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400 font-medium text-[10px] px-1.5 py-0.5"
                >
                  {item.industry_category}
                </Badge>
              )}
              {item.contact_type && (
                <Badge 
                  variant="outline" 
                  className="bg-orange-500/10 text-orange-700 border-orange-500/20 dark:text-orange-400 font-medium text-[10px] px-1.5 py-0.5"
                >
                  {item.contact_type}
                </Badge>
              )}
            </>
          ) : (
            <>
              {item.is_employee && (
                <Badge variant="secondary" className="bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400 font-medium text-[10px] px-1.5 py-0.5">
                  Mitarbeiter
                </Badge>
              )}
              {item.is_private_customer && (
                <Badge variant="secondary" className="bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400 font-medium text-[10px] px-1.5 py-0.5">
                  Privatkunde
                </Badge>
              )}
              {item.is_primary_contact && (
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-medium text-[10px] px-1.5 py-0.5">
                  Primär
                </Badge>
              )}
            </>
          )}
        </div>

        {/* Title and info below badges */}
        <div className="pr-2">
          <h3 className="font-semibold text-lg truncate pr-20">
            {type === 'company' ? item.name : `${item.first_name} ${item.last_name}`}
          </h3>
          {type === 'company' ? (
            <div className="space-y-1 mt-1">
              {item.company_type && (
                <p className="text-sm font-normal text-muted-foreground">{item.company_type}</p>
              )}
              {(item.city || item.postal_code) && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">
                    {item.city && item.postal_code ? `${item.postal_code} ${item.city}` : item.city || item.postal_code}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1 mt-1">
              {item.position && (
                <p className="text-sm text-muted-foreground truncate">{item.position}</p>
              )}
              {item.customer_companies?.name && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Building2 className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{item.customer_companies.name}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0 flex-1 flex flex-col justify-end">
        <div className="flex flex-col gap-2 text-sm">
          {item.email && (
            <div className="flex items-center gap-2 min-w-0">
              <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <a 
                href={`mailto:${item.email}`} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-foreground transition-colors truncate"
                onClick={(e) => e.stopPropagation()}
                title={item.email}
              >
                {item.email}
              </a>
            </div>
          )}
          {item.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <a 
                href={`tel:${item.phone}`} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-foreground transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {item.phone}
              </a>
            </div>
          )}
          {item.mobile && (
            <div className="flex items-center gap-2">
              <Smartphone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <a 
                href={`tel:${item.mobile}`} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-foreground transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {item.mobile}
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
