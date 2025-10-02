import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Mail, Phone, Smartphone, MapPin, Building2, MessageSquare, ChevronRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { StatusBadge } from "@/components/ui/status-badges";
import { useIsMobile } from "@/hooks/use-mobile";

interface ContactCardProps {
  item: any;
  type: 'company' | 'person';
  onCardClick: (item: any, type: 'company' | 'person') => void;
}

export function ContactCard({ item, type, onCardClick }: ContactCardProps) {
  const isMobile = useIsMobile();

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
      className="cursor-pointer hover:shadow-md transition-all duration-200 animate-fade-in hover:scale-[1.02] active:scale-[0.98] h-full flex flex-col relative"
      onClick={() => onCardClick(item, type)}
    >
      <CardHeader className="pb-3 relative">
        {/* Badges positioned at top-right */}
        <div className="absolute top-3 right-12 flex items-start gap-1 flex-wrap justify-end max-w-[50%]">
          {type === 'company' ? (
            <>
              {item.contact_type && (
                <Badge 
                  variant="secondary" 
                  className={`${
                    item.contact_type.toLowerCase().includes('kunde') 
                      ? 'bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400' 
                      : 'bg-primary/10 text-primary border-primary/20'
                  } font-medium text-[10px] px-1.5 py-0.5`}
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
                <Badge variant="secondary" className="bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400 font-medium text-[10px] px-1.5 py-0.5">
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
        {isMobile ? (
          <TooltipProvider>
            <div className="flex gap-2 justify-start pt-2">
              {(type === 'company' ? (item.street || item.city || item.postal_code) : item.customer_companies?.name) && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-muted hover:bg-muted/80"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (type === 'company' && (item.street || item.city)) {
                          const address = [item.street, item.postal_code, item.city].filter(Boolean).join(' ');
                          window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
                        }
                      }}
                    >
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{type === 'company' ? 'In Karten öffnen' : 'Unternehmen'}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {item.email && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-muted hover:bg-muted/80"
                      asChild
                    >
                      <a
                        href={`mailto:${item.email}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>E-Mail senden</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {item.phone && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-muted hover:bg-muted/80"
                      asChild
                    >
                      <a
                        href={`tel:${item.phone}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Anrufen</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {item.mobile && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-muted hover:bg-muted/80"
                      asChild
                    >
                      <a
                        href={`tel:${item.mobile}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Smartphone className="h-4 w-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Handy anrufen</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {type === 'person' && item.mobile && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-muted hover:bg-muted/80"
                      asChild
                    >
                      <a
                        href={`https://wa.me/${item.mobile.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <WhatsAppIcon className="h-4 w-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>WhatsApp senden</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {type === 'person' && item.mobile && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-muted hover:bg-muted/80"
                      asChild
                    >
                      <a
                        href={`sms:${item.mobile}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>SMS senden</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {/* Arrow button in mobile view aligned with icons */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-muted hover:bg-muted/80 ml-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCardClick(item, type);
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Details öffnen</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        ) : (
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
        )}
      </CardContent>
      
      {/* Arrow button - mobile: top right aligned with badges, desktop: bottom right */}
      {isMobile ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 h-8 w-8 rounded-full bg-muted/50 hover:bg-muted z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  onCardClick(item, type);
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Details öffnen</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-muted/50 hover:bg-muted"
          onClick={(e) => {
            e.stopPropagation();
            onCardClick(item, type);
          }}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </Card>
  );
}
