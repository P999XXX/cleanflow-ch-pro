import { Building2, User, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export type ContactType = 'company' | 'person' | 'employee';

interface ContactTypeSelectorProps {
  onSelect: (type: ContactType) => void;
  onClose: () => void;
}

export const ContactTypeSelector = ({ onSelect, onClose }: ContactTypeSelectorProps) => {
  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card 
        className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 hover:border-primary"
        onClick={() => onSelect('company')}
      >
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Unternehmen</CardTitle>
          <CardDescription>
            Firma oder Organisation hinzufügen
          </CardDescription>
        </CardHeader>
      </Card>

      <Card 
        className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 hover:border-primary"
        onClick={() => onSelect('person')}
      >
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Person</CardTitle>
          <CardDescription>
            Externe Kontaktperson hinzufügen
          </CardDescription>
        </CardHeader>
      </Card>

      <Card 
        className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 hover:border-primary"
        onClick={() => onSelect('employee')}
      >
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <UserCheck className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Mitarbeiter</CardTitle>
          <CardDescription>
            Neuen Mitarbeiter erfassen
          </CardDescription>
        </CardHeader>
      </Card>
      </div>
      
      {/* Footer mit Abbrechen Button */}
      <div className="flex justify-end pt-4 border-t">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
        >
          Abbrechen
        </Button>
      </div>
    </div>
  );
};
