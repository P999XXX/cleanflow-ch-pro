import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { EmployeeDetailsInput } from "@/hooks/useEmployeeDetails";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AddressAutocomplete } from "@/components/ui/address-autocomplete";

interface EmployeeFormStep2Props {
  employeeData: Partial<EmployeeDetailsInput>;
  onChange: (data: Partial<EmployeeDetailsInput>) => void;
  companyId: string;
}

export const EmployeeFormStep2 = ({ employeeData, onChange, companyId }: EmployeeFormStep2Props) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Ungültiger Dateityp',
        description: 'Bitte laden Sie eine PDF, JPG oder PNG Datei hoch',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5242880) {
      toast({
        title: 'Datei zu gross',
        description: 'Die Datei darf maximal 5MB gross sein',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${companyId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('employee-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('employee-documents')
        .getPublicUrl(fileName);

      onChange({ ...employeeData, permit_document_url: publicUrl });
      
      toast({
        title: 'Erfolg',
        description: 'Dokument wurde hochgeladen',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Fehler',
        description: 'Fehler beim Hochladen des Dokuments',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">HR-Details</h3>
        
        {/* Geburtsdatum */}
        <div className="space-y-2">
          <Label>Geburtsdatum</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !employeeData.birth_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {employeeData.birth_date ? format(new Date(employeeData.birth_date), "dd.MM.yyyy") : "Datum wählen"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={employeeData.birth_date ? new Date(employeeData.birth_date) : undefined}
                onSelect={(date) => onChange({ ...employeeData, birth_date: date?.toISOString().split('T')[0] })}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Geburtsort */}
        <div className="space-y-2">
          <Label htmlFor="birth_place">Geburtsort</Label>
          <Input
            id="birth_place"
            value={employeeData.birth_place || ''}
            onChange={(e) => onChange({ ...employeeData, birth_place: e.target.value })}
            placeholder="Geburtsort"
          />
        </div>

        {/* Aktueller Wohnort */}
        <div className="space-y-2">
          <Label htmlFor="current_address">Aktueller Wohnort</Label>
          <AddressAutocomplete
            value={employeeData.current_address || ''}
            onChange={(value) => onChange({ ...employeeData, current_address: value })}
            onAddressSelect={(address) => {
              onChange({ 
                ...employeeData, 
                current_address: `${address.street}, ${address.postalCode} ${address.city}, ${address.country}`
              });
            }}
            placeholder="Strasse, PLZ, Ort eingeben..."
          />
        </div>

        {/* Wohnort seit */}
        <div className="space-y-2">
          <Label>Wohnort seit</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !employeeData.address_since && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {employeeData.address_since ? format(new Date(employeeData.address_since), "dd.MM.yyyy") : "Datum wählen"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={employeeData.address_since ? new Date(employeeData.address_since) : undefined}
                onSelect={(date) => onChange({ ...employeeData, address_since: date?.toISOString().split('T')[0] })}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Herkunft */}
        <div className="space-y-2">
          <Label htmlFor="origin_country">Herkunft</Label>
          <Input
            id="origin_country"
            value={employeeData.origin_country || 'Schweiz'}
            onChange={(e) => onChange({ ...employeeData, origin_country: e.target.value })}
            placeholder="Herkunft"
          />
        </div>

        {/* Ausweis Typ */}
        <div className="space-y-2">
          <Label>Ausweis-Typ</Label>
          <Select
            value={employeeData.permit_type || ''}
            onValueChange={(value) => onChange({ ...employeeData, permit_type: value as any })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ausweis wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CH">Schweizer Pass/ID</SelectItem>
              <SelectItem value="B">Ausweis B (Aufenthaltsbewilligung)</SelectItem>
              <SelectItem value="C">Ausweis C (Niederlassungsbewilligung)</SelectItem>
              <SelectItem value="F">Ausweis F (Vorläufig aufgenommen)</SelectItem>
              <SelectItem value="L">Ausweis L (Kurzaufenthaltsbewilligung)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Ausweis Upload */}
        <div className="space-y-2">
          <Label>Ausweis hochladen</Label>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              disabled={uploading}
              className="flex-1"
            />
            {uploading && <span className="text-sm text-muted-foreground">Lädt...</span>}
          </div>
          {employeeData.permit_document_url && (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Dokument hochgeladen
            </p>
          )}
        </div>

        {/* AHV Nummer */}
        <div className="space-y-2">
          <Label htmlFor="ahv_number">AHV-Nummer</Label>
          <Input
            id="ahv_number"
            value={employeeData.ahv_number || ''}
            onChange={(e) => onChange({ ...employeeData, ahv_number: e.target.value })}
            placeholder="756.XXXX.XXXX.XX"
          />
        </div>

        {/* Zivilstand */}
        <div className="space-y-2">
          <Label>Zivilstand</Label>
          <Select
            value={employeeData.marital_status || ''}
            onValueChange={(value) => onChange({ ...employeeData, marital_status: value as any })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Zivilstand wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ledig">Ledig</SelectItem>
              <SelectItem value="verheiratet">Verheiratet</SelectItem>
              <SelectItem value="geschieden">Geschieden</SelectItem>
              <SelectItem value="verwitwet">Verwitwet</SelectItem>
              <SelectItem value="in_partnerschaft">In eingetragener Partnerschaft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quellensteuerpflichtig */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="tax_residence"
            checked={employeeData.tax_residence || false}
            onCheckedChange={(checked) => onChange({ ...employeeData, tax_residence: checked as boolean })}
          />
          <Label htmlFor="tax_residence" className="cursor-pointer">
            Quellensteuerpflichtig
          </Label>
        </div>

        {/* Notfallkontakt */}
        <div className="space-y-2">
          <Label htmlFor="emergency_contact_name">Notfallkontakt (Vor- und Nachname)</Label>
          <Input
            id="emergency_contact_name"
            value={employeeData.emergency_contact_name || ''}
            onChange={(e) => onChange({ ...employeeData, emergency_contact_name: e.target.value })}
            placeholder="Vor- und Nachname"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergency_contact_phone">Notfallkontakt Telefonnummer</Label>
          <Input
            id="emergency_contact_phone"
            type="tel"
            value={employeeData.emergency_contact_phone || ''}
            onChange={(e) => onChange({ ...employeeData, emergency_contact_phone: e.target.value })}
            placeholder="+41 XX XXX XX XX"
          />
        </div>

        {/* Anstellungsdatum */}
        <div className="space-y-2">
          <Label>Anstellungsdatum</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !employeeData.employment_start_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {employeeData.employment_start_date ? format(new Date(employeeData.employment_start_date), "dd.MM.yyyy") : "Datum wählen"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={employeeData.employment_start_date ? new Date(employeeData.employment_start_date) : undefined}
                onSelect={(date) => onChange({ ...employeeData, employment_start_date: date?.toISOString().split('T')[0] })}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};
