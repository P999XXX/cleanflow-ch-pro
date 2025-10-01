import { Building2, User, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export type ContactType = 'company' | 'person' | 'employee';
interface ContactTypeSelectorProps {
  onSelect: (type: ContactType) => void;
  onClose: () => void;
}
export const ContactTypeSelector = ({
  onSelect,
  onClose
}: ContactTypeSelectorProps) => {
  return <div className="space-y-8 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Kontakt hinzufügen</h2>
        <p className="text-sm text-muted-foreground">Wählen Sie die Art des Kontakts aus</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <Card className="cursor-pointer transition-all hover:shadow-xl hover:scale-105 border-2 hover:border-primary group" onClick={() => onSelect('company')}>
          <CardHeader className="text-center p-8">
            <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-all">
              <Building2 className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-xl mb-2">Unternehmen</CardTitle>
            <CardDescription className="text-base">
              Firma oder Organisation hinzufügen
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer transition-all hover:shadow-xl hover:scale-105 border-2 hover:border-primary group" onClick={() => onSelect('person')}>
          <CardHeader className="text-center p-8">
            <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-all">
              <User className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-xl mb-2">Person</CardTitle>
            <CardDescription className="text-base">
              Kontaktperson hinzufügen
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      {/* Footer mit Abbrechen Button */}
      <div className="flex justify-center pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose} className="min-w-[120px]">
          Abbrechen
        </Button>
      </div>
    </div>;
};