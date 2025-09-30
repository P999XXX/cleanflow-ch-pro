import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Child {
  first_name: string;
  last_name: string;
  birth_date: string;
}

interface EmployeeFormStep3Props {
  children: Child[];
  onChange: (children: Child[]) => void;
}

export const EmployeeFormStep3 = ({ children, onChange }: EmployeeFormStep3Props) => {
  const [newChild, setNewChild] = useState<Child>({
    first_name: '',
    last_name: '',
    birth_date: '',
  });

  const handleAddChild = () => {
    if (newChild.first_name && newChild.last_name && newChild.birth_date) {
      onChange([...children, newChild]);
      setNewChild({ first_name: '', last_name: '', birth_date: '' });
    }
  };

  const handleRemoveChild = (index: number) => {
    onChange(children.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Kinder</h3>
        
        {/* List of existing children */}
        {children.length > 0 && (
          <div className="space-y-3">
            {children.map((child, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{child.first_name} {child.last_name}</p>
                  <p className="text-sm text-muted-foreground">
                    Geboren: {format(new Date(child.birth_date), "dd.MM.yyyy")}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveChild(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add new child form */}
        <div className="space-y-4 p-4 border rounded-lg bg-card">
          <h4 className="font-medium text-foreground">Kind hinzufügen</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="child_first_name">Vorname</Label>
              <Input
                id="child_first_name"
                value={newChild.first_name}
                onChange={(e) => setNewChild({ ...newChild, first_name: e.target.value })}
                placeholder="Vorname"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="child_last_name">Nachname</Label>
              <Input
                id="child_last_name"
                value={newChild.last_name}
                onChange={(e) => setNewChild({ ...newChild, last_name: e.target.value })}
                placeholder="Nachname"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Geburtsdatum</Label>
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
                  {newChild.birth_date ? format(new Date(newChild.birth_date), "dd.MM.yyyy") : "Datum wählen"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={newChild.birth_date ? new Date(newChild.birth_date) : undefined}
                  onSelect={(date) => setNewChild({ ...newChild, birth_date: date?.toISOString().split('T')[0] || '' })}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button
            type="button"
            onClick={handleAddChild}
            disabled={!newChild.first_name || !newChild.last_name || !newChild.birth_date}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Kind hinzufügen
          </Button>
        </div>

        {children.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Keine Kinder hinzugefügt. Sie können Kinder optional hinzufügen.
          </p>
        )}
      </div>
    </div>
  );
};
