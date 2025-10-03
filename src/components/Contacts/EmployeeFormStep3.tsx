import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

interface Child {
  first_name: string;
  last_name: string;
  birth_date: string;
}

interface EmployeeFormStep3Props {
  employeeData: {
    hourly_rate?: number;
    iban?: string;
    employment_rate?: number;
  };
  children: Child[];
  onChange: (field: string, value: any) => void;
  onChildrenChange: (children: Child[]) => void;
  systemAccess?: boolean;
  onSystemAccessChange?: (value: boolean) => void;
}

export const EmployeeFormStep3 = ({ 
  employeeData, 
  children, 
  onChange, 
  onChildrenChange,
  systemAccess = false,
  onSystemAccessChange
}: EmployeeFormStep3Props) => {
  const [newChild, setNewChild] = useState<Child>({
    first_name: '',
    last_name: '',
    birth_date: ''
  });

  const handleAddChild = () => {
    if (newChild.first_name && newChild.last_name && newChild.birth_date) {
      onChildrenChange([...children, newChild]);
      setNewChild({ first_name: '', last_name: '', birth_date: '' });
    }
  };

  const handleRemoveChild = (index: number) => {
    onChildrenChange(children.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Lohn- und Finanzdaten */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Lohn- und Finanzdaten</h3>
        
        {/* Stundenlohn */}
        <div className="space-y-2">
          <Label htmlFor="hourly_rate">
            Stundenlohn (CHF) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="hourly_rate"
            type="number"
            step="0.01"
            min="0"
            placeholder="z.B. 25.50"
            value={employeeData.hourly_rate || ''}
            onChange={(e) => onChange('hourly_rate', parseFloat(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">
            Bruttostundenlohn in Schweizer Franken
          </p>
        </div>

        {/* Beschäftigungsgrad */}
        <div className="space-y-2">
          <Label htmlFor="employment_rate">
            Beschäftigungsgrad (%) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="employment_rate"
            type="number"
            min="1"
            max="100"
            placeholder="100"
            value={employeeData.employment_rate || 100}
            onChange={(e) => onChange('employment_rate', parseFloat(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">
            Arbeitspensum in Prozent (1-100%)
          </p>
        </div>

        {/* IBAN */}
        <div className="space-y-2">
          <Label htmlFor="iban">
            IBAN <span className="text-destructive">*</span>
          </Label>
          <Input
            id="iban"
            type="text"
            placeholder="CH93 0076 2011 6238 5295 7"
            value={employeeData.iban || ''}
            onChange={(e) => onChange('iban', e.target.value)}
            maxLength={26}
          />
          <p className="text-xs text-muted-foreground">
            Schweizer IBAN für Lohnzahlungen (Format: CH93 0076 2011 6238 5295 7)
          </p>
        </div>
      </div>

      {/* Kinder-Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Kinder (für Lohnabrechnung)</h3>
        
        {/* Bestehende Kinder */}
        {children.length > 0 && (
          <div className="space-y-2">
            {children.map((child, index) => (
              <Card key={index}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">
                      {child.first_name} {child.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Geboren: {format(new Date(child.birth_date), 'dd.MM.yyyy', { locale: de })}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveChild(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Neues Kind hinzufügen */}
        <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
          <Label>Neues Kind hinzufügen</Label>
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Vorname"
              value={newChild.first_name}
              onChange={(e) => setNewChild({ ...newChild, first_name: e.target.value })}
            />
            <Input
              placeholder="Nachname"
              value={newChild.last_name}
              onChange={(e) => setNewChild({ ...newChild, last_name: e.target.value })}
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !newChild.birth_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {newChild.birth_date 
                  ? format(new Date(newChild.birth_date), 'dd.MM.yyyy', { locale: de })
                  : "Geburtsdatum wählen"
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={newChild.birth_date ? new Date(newChild.birth_date) : undefined}
                onSelect={(date) => 
                  setNewChild({ 
                    ...newChild, 
                    birth_date: date ? format(date, 'yyyy-MM-dd') : '' 
                  })
                }
                disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleAddChild}
            disabled={!newChild.first_name || !newChild.last_name || !newChild.birth_date}
          >
            <Plus className="mr-2 h-4 w-4" />
            Kind hinzufügen
          </Button>
        </div>
      </div>

      {/* System-Zugang */}
      <div className="space-y-4 p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="system_access">System-Zugang erlauben</Label>
            <p className="text-sm text-muted-foreground">
              Mitarbeiter kann sich im System anmelden und Daten erfassen
            </p>
          </div>
          <Switch
            id="system_access"
            checked={systemAccess}
            onCheckedChange={onSystemAccessChange}
          />
        </div>
        
        {systemAccess && (
          <div className="space-y-2 pt-2 border-t">
            <Label htmlFor="user_email">E-Mail für System-Zugang</Label>
            <Input
              id="user_email"
              type="email"
              placeholder="mitarbeiter@firma.ch"
              disabled
            />
            <p className="text-xs text-muted-foreground">
              Eine Einladungs-E-Mail wird nach dem Speichern versendet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
