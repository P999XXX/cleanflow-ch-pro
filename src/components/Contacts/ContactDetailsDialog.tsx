import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, Users, Mail, Phone, Globe, MapPin, Edit, Trash2, X,
  Contact, Building, AlertTriangle, FileText, MessageCircle, MessageSquare, ChevronRight 
} from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import GoogleMap from "@/components/ui/google-map";
import { designTokens } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

interface ContactDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: any;
  itemType: 'company' | 'person';
  navigationStack: Array<{item: any, type: 'company' | 'person'}>;
  onEdit: () => void;
  onDelete: () => void;
  onGoBack: () => void;
  onNavigateToCompany: (companyId: string) => void;
  onNavigateToPerson: (person: any) => void;
  getStatusBadge: (status: string) => JSX.Element;
  getCompanyTypeAbbreviation: (type: string) => string;
}

export function ContactDetailsDialog({
  isOpen,
  onClose,
  selectedItem,
  itemType,
  navigationStack,
  onEdit,
  onDelete,
  onGoBack,
  onNavigateToCompany,
  onNavigateToPerson,
  getStatusBadge,
  getCompanyTypeAbbreviation,
}: ContactDetailsDialogProps) {
  if (!selectedItem) return null;

  const isCustomer = itemType === 'company' && selectedItem.contact_type?.toLowerCase() === 'kunde';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby="contact-dialog-desc" className={cn(
        designTokens.containers.dialog.lg,
        designTokens.dialogs.content,
        "h-[90vh] overflow-hidden flex flex-col p-0"
      )}>
        <VisuallyHidden>
          <DialogTitle>
            {itemType === 'company' ? selectedItem.name : `${selectedItem.first_name} ${selectedItem.last_name}`}
          </DialogTitle>
          <p id="contact-dialog-desc">Details zur Kontaktansicht</p>
        </VisuallyHidden>
        <div className="w-full overflow-y-auto overflow-x-hidden flex-1">
          {/* Map Header */}
          {itemType === 'company' && (selectedItem.address || selectedItem.city) && (
            <div className="relative h-64 sm:h-80 mb-0">
              <GoogleMap
                address={selectedItem.address}
                postal_code={selectedItem.postal_code}
                city={selectedItem.city}
                country={selectedItem.country}
                className="w-full h-full rounded-none"
              />
              
              {/* Action Buttons on Map */}
              <div className="absolute top-2 right-2 flex items-center gap-2 z-20">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full h-7 w-7 bg-white/95 hover:bg-white dark:bg-primary/20 dark:hover:bg-primary/30 border border-gray-200 dark:border-primary/30 shadow-lg backdrop-blur-sm"
                  onClick={onEdit}
                >
                  <Edit className="h-3 w-3 text-gray-700 dark:text-primary-foreground" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full h-7 w-7 bg-white/95 hover:bg-white dark:bg-primary/20 dark:hover:bg-primary/30 border border-gray-200 dark:border-primary/30 shadow-lg backdrop-blur-sm"
                  onClick={onDelete}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full h-7 w-7 bg-white/95 hover:bg-white dark:bg-primary/20 dark:hover:bg-primary/30 border border-gray-200 dark:border-primary/30 shadow-lg backdrop-blur-sm"
                  onClick={navigationStack.length > 0 ? onGoBack : onClose}
                >
                  <X className="h-3 w-3 text-gray-700 dark:text-primary-foreground" />
                </Button>
              </div>
            </div>
          )}

          {/* Title and Badges Section */}
          <div className={cn(designTokens.dialogs.header, "px-6 relative")}>
            {itemType === 'person' ? (
              /* Person Layout: Buttons absolutely positioned, then name, then badge */
              <>
                {/* Action Buttons - Sticky positioned */}
                <div className="sticky top-0 right-2 flex items-center gap-2 z-20 justify-end pt-2 pr-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full h-7 w-7 bg-white/95 hover:bg-white dark:bg-primary/20 dark:hover:bg-primary/30 border border-gray-200 dark:border-primary/30 shadow-lg backdrop-blur-sm"
                    onClick={onEdit}
                  >
                    <Edit className="h-3 w-3 text-gray-700 dark:text-primary-foreground" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full h-7 w-7 bg-white/95 hover:bg-white dark:bg-primary/20 dark:hover:bg-primary/30 border border-gray-200 dark:border-primary/30 shadow-lg backdrop-blur-sm"
                    onClick={onDelete}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full h-7 w-7 bg-white/95 hover:bg-white dark:bg-primary/20 dark:hover:bg-primary/30 border border-gray-200 dark:border-primary/30 shadow-lg backdrop-blur-sm"
                    onClick={navigationStack.length > 0 ? onGoBack : onClose}
                  >
                    <X className="h-3 w-3 text-gray-700 dark:text-primary-foreground" />
                  </Button>
                </div>

                <div className="flex flex-col gap-2 pt-6">
                  {/* Name */}
                  <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-primary flex-shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <h2 className="text-xl sm:text-2xl font-semibold">
                        {`${selectedItem.first_name} ${selectedItem.last_name}`}
                      </h2>
                      {selectedItem.position && (
                        <span className="text-sm font-normal text-muted-foreground mt-1">
                          {selectedItem.position}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Badge */}
                  {selectedItem.is_primary_contact && (
                    <div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-medium">
                        Primärkontakt
                      </Badge>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Company Layout: Keep existing structure */
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Title */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Building2 className="h-6 w-6 text-primary flex-shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <h2 className="text-xl sm:text-2xl font-semibold truncate">{selectedItem.name}</h2>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
                  {getStatusBadge(selectedItem.status)}
                  {selectedItem.company_type && (
                    <Badge 
                      variant="outline" 
                      className="bg-muted text-muted-foreground border-muted font-medium"
                    >
                      {getCompanyTypeAbbreviation(selectedItem.company_type)}
                    </Badge>
                  )}
                  {selectedItem.industry_category && (
                    <Badge 
                      variant="outline" 
                      className="bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400 font-medium"
                    >
                      {selectedItem.industry_category}
                    </Badge>
                  )}
                  {selectedItem.contact_type && (
                    <Badge 
                      variant="outline" 
                      className="bg-orange-500/10 text-orange-700 border-orange-500/20 dark:text-orange-400 font-medium"
                    >
                      {selectedItem.contact_type}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Quick Action Icons */}
            <div className="flex items-center gap-3 mt-4">
              {selectedItem.website && (
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10"
                  onClick={() => window.open(selectedItem.website.startsWith('http') ? selectedItem.website : `https://${selectedItem.website}`, '_blank')}
                >
                  <Globe className="h-4 w-4" />
                </Button>
              )}
              {selectedItem.phone && (
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10"
                  onClick={() => window.open(`tel:${selectedItem.phone}`, '_self')}
                >
                  <Phone className="h-4 w-4" />
                </Button>
              )}
              {itemType === 'person' && selectedItem.mobile && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-10 w-10 bg-green-50 dark:bg-green-950 hover:bg-green-100 dark:hover:bg-green-900 border-green-200 dark:border-green-800"
                    onClick={() => {
                      const phone = selectedItem.mobile.replace(/[^\d]/g, '').replace(/^0/, '41');
                      window.open(`https://wa.me/${phone}`, '_blank');
                    }}
                  >
                    <MessageCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-10 w-10"
                    onClick={() => window.open(`sms:${selectedItem.mobile}`, '_self')}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </>
              )}
              {itemType === 'company' && selectedItem.mobile && (
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10 bg-green-50 dark:bg-green-950 hover:bg-green-100 dark:hover:bg-green-900 border-green-200 dark:border-green-800"
                  onClick={() => {
                    const phone = selectedItem.mobile.replace(/[^\d]/g, '').replace(/^0/, '41');
                    window.open(`https://wa.me/${phone}`, '_blank');
                  }}
                >
                  <MessageCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </Button>
              )}
              {selectedItem.email && (
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10"
                  onClick={() => window.open(`mailto:${selectedItem.email}`, '_self')}
                >
                  <Mail className="h-4 w-4" />
                </Button>
              )}
              {(selectedItem.address || selectedItem.city) && (
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10"
                  onClick={() => {
                    const address = `${selectedItem.address || ''} ${selectedItem.postal_code || ''} ${selectedItem.city || ''}`.trim();
                    window.open(`https://maps.google.com/maps?q=${encodeURIComponent(address)}`, '_blank');
                  }}
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Tabs for Customers */}
            {isCustomer && (
              <div className="mt-4 md:mt-6">
                <Tabs defaultValue="kontakt" className="w-full">
                  {/* Scrollable Tab Container - Full Width without margins */}
                  <div className="overflow-x-auto overflow-y-hidden no-scrollbar -mx-6 pl-2 pr-6 md:px-6 mb-2 md:mb-0">
                    <TabsList className="inline-flex min-w-full bg-background md:bg-muted p-1 rounded-md h-auto">
                      <TabsTrigger 
                        value="kontakt" 
                        className="flex items-center gap-2 flex-shrink-0 px-2.5 py-1.5 md:px-3 md:py-2.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground md:data-[state=active]:bg-background md:data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                      >
                        <Contact className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        <span>Kontakt</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="objekte" 
                        className="flex items-center gap-2 flex-shrink-0 px-2.5 py-1.5 md:px-3 md:py-2.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground md:data-[state=active]:bg-background md:data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                      >
                        <Building className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        <span>Objekte</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="reklamationen" 
                        className="flex items-center gap-2 flex-shrink-0 px-2.5 py-1.5 md:px-3 md:py-2.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground md:data-[state=active]:bg-background md:data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                      >
                        <AlertTriangle className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        <span>Reklamationen</span>
                        <Badge variant="destructive" className="ml-1 px-1.5 py-0.5 text-xs">2</Badge>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="dokumente" 
                        className="flex items-center gap-2 flex-shrink-0 px-2.5 py-1.5 md:px-3 md:py-2.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground md:data-[state=active]:bg-background md:data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                      >
                        <FileText className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        <span>Dokumente</span>
                      </TabsTrigger>
                  </TabsList>
                  </div>

                  <TabsContent value="kontakt" className="mt-2 md:mt-4 -mx-6 p-0">
                    <div className="bg-muted/1">
                      <div className="px-6 pt-4 md:pt-6 pb-6">
                        <ContactInformationSection 
                          selectedItem={selectedItem} 
                          itemType={itemType}
                          onNavigateToPerson={onNavigateToPerson}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="objekte" className="mt-2 md:mt-4 -mx-6 p-0">
                    <div className="bg-muted/1">
                      <div className="px-6 pt-4 md:pt-6 pb-6">
                        <EmptyState icon={Building} text="Objekte werden hier angezeigt" />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="reklamationen" className="mt-2 md:mt-4 -mx-6 p-0">
                    <div className="bg-muted/1">
                      <div className="px-6 pt-4 md:pt-6 pb-6">
                        <EmptyState icon={AlertTriangle} text="Reklamationen werden hier angezeigt" />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="dokumente" className="mt-2 md:mt-4 -mx-6 p-0">
                    <div className="bg-muted/1">
                      <div className="px-6 pt-4 md:pt-6 pb-6">
                        <EmptyState icon={FileText} text="Dokumente werden hier angezeigt" />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>

          {/* Non-customer and Person content */}
          {!isCustomer && (
            <div className="px-6 pb-6 space-y-6 bg-muted/1">
              <ContactInformationSection 
                selectedItem={selectedItem} 
                itemType={itemType}
                onNavigateToPerson={onNavigateToPerson}
                onNavigateToCompany={onNavigateToCompany}
              />
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper Components
function ContactInformationSection({ 
  selectedItem, 
  itemType,
  onNavigateToPerson,
  onNavigateToCompany 
}: any) {
  return (
    <div className="space-y-6 mt-2">
      {/* Contact Information Cards */}
      <div className="space-y-4">
        <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
          Kontaktinformationen
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {selectedItem.email && (
            <Button
              variant="outline"
              className="h-auto p-4 flex items-center gap-3 justify-between hover:bg-muted/20 w-full group"
              onClick={() => window.open(`mailto:${selectedItem.email}`, '_self')}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="text-left min-w-0">
                  <p className="text-xs text-muted-foreground">E-Mail</p>
                  <p className="text-sm font-medium truncate">{selectedItem.email}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform group-hover:translate-x-1" />
            </Button>
          )}
          {selectedItem.phone && (
            <Button
              variant="outline"
              className="h-auto p-4 flex items-center gap-3 justify-between hover:bg-muted/20 w-full group"
              onClick={() => window.open(`tel:${selectedItem.phone}`, '_self')}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="text-left min-w-0">
                  <p className="text-xs text-muted-foreground">Telefon</p>
                  <p className="text-sm font-medium truncate">{selectedItem.phone}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform group-hover:translate-x-1" />
            </Button>
          )}
          {selectedItem.mobile && (
            <Button
              variant="outline"
              className="h-auto p-4 flex items-center gap-3 justify-between hover:bg-muted/20 w-full group"
              onClick={() => window.open(`tel:${selectedItem.mobile}`, '_self')}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="text-left min-w-0">
                  <p className="text-xs text-muted-foreground">Mobile Nummer</p>
                  <p className="text-sm font-medium truncate">{selectedItem.mobile}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform group-hover:translate-x-1" />
            </Button>
          )}
          {selectedItem.website && (
            <Button
              variant="outline"
              className="h-auto p-4 flex items-center gap-3 justify-between hover:bg-muted/20 w-full group"
              onClick={() => window.open(selectedItem.website.startsWith('http') ? selectedItem.website : `https://${selectedItem.website}`, '_blank')}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Globe className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="text-left min-w-0">
                  <p className="text-xs text-muted-foreground">Website</p>
                  <p className="text-sm font-medium truncate">{selectedItem.website}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform group-hover:translate-x-1" />
            </Button>
          )}
        </div>
      </div>

      {/* Contact Persons (for companies) */}
      {itemType === 'company' && selectedItem.contact_persons && selectedItem.contact_persons.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Kontaktpersonen
              <Badge variant="secondary" className="ml-2 rounded-full bg-primary/10 text-primary border-0 px-2 py-0.5 text-xs font-medium">
                {selectedItem.contact_persons.length}
              </Badge>
            </h4>
          </div>
          <div className="grid gap-3">
            {selectedItem.contact_persons.map((contact: any) => (
              <Button
                key={contact.id}
                variant="outline"
                className="h-auto p-4 flex items-start justify-between hover:bg-muted/20 group"
                onClick={() => onNavigateToPerson(contact)}
              >
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-foreground">
                      {contact.first_name} {contact.last_name}
                    </span>
                    {contact.is_primary_contact && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-medium text-xs ml-2">
                        Primär
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-1 mt-1 text-xs text-muted-foreground">
                    {contact.position && <span>{contact.position}</span>}
                  </div>
                  {contact.notes && (
                    <div className="mt-2 pt-2 border-t border-border/50">
                      <p className="text-xs text-muted-foreground line-clamp-2">{contact.notes}</p>
                    </div>
                  )}
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Address (for companies) */}
      {itemType === 'company' && (selectedItem.address || selectedItem.city || selectedItem.postal_code) && (
        <div className="space-y-4">
          <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
            Adresse
          </h4>
          <Button
            variant="outline"
            className="h-auto p-4 flex items-center gap-3 justify-between hover:bg-muted/20 w-full group"
            onClick={() => {
              const address = `${selectedItem.address || ''} ${selectedItem.postal_code || ''} ${selectedItem.city || ''}`.trim();
              window.open(`https://maps.google.com/maps?q=${encodeURIComponent(address)}`, '_blank');
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="text-left min-w-0">
                {selectedItem.address && <div className="text-sm font-medium">{selectedItem.address}</div>}
                <div className="text-sm font-medium">
                  {selectedItem.postal_code && selectedItem.city 
                    ? `${selectedItem.postal_code} ${selectedItem.city}` 
                    : selectedItem.postal_code || selectedItem.city}
                </div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      )}

      {/* Additional Info (for companies) */}
      {itemType === 'company' && (selectedItem.vat_number || selectedItem.tax_number) && (
        <div className="space-y-4">
          <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
            Zusätzliche Informationen
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedItem.vat_number && (
              <div className="p-4 bg-muted/1 rounded-lg">
                <p className="text-xs text-muted-foreground">USt-IdNr.</p>
                <p className="text-sm font-medium">{selectedItem.vat_number}</p>
              </div>
            )}
            {selectedItem.tax_number && (
              <div className="p-4 bg-muted/1 rounded-lg">
                <p className="text-xs text-muted-foreground">Steuernummer</p>
                <p className="text-sm font-medium">{selectedItem.tax_number}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Company Information (for persons) */}
      {itemType === 'person' && selectedItem.customer_company_id && selectedItem.customer_companies && (
        <div className="space-y-4">
          <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
            Unternehmen
          </h4>
          <Button
            variant="outline"
            className="h-auto p-4 flex items-center gap-3 justify-between hover:bg-muted/20 w-full group"
            onClick={() => onNavigateToCompany(selectedItem.customer_company_id)}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Building2 className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="text-left min-w-0">
                <p className="text-sm font-medium truncate">{selectedItem.customer_companies.name}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      )}

      {/* Notes (for persons) */}
      {itemType === 'person' && selectedItem.notes && (
        <div className="space-y-4">
          <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
            Notizen
          </h4>
          <div className="p-4 bg-muted/1 rounded-lg">
            <p className="text-sm">{selectedItem.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <Icon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
      <p>{text}</p>
    </div>
  );
}
