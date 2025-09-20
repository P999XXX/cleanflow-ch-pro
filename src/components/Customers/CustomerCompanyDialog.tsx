import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomerCompany {
  id: string;
  name: string;
  address?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  vat_number?: string;
  notes?: string;
  status: 'aktiv' | 'inaktiv' | 'potenziell';
}

interface CustomerCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
  customerCompany: CustomerCompany | null;
  userCompanyId: string | null;
}

export function CustomerCompanyDialog({
  open,
  onOpenChange,
  onSaved,
  customerCompany,
  userCompanyId,
}: CustomerCompanyDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    postal_code: "",
    city: "",
    country: "Schweiz",
    phone: "",
    email: "",
    website: "",
    vat_number: "",
    notes: "",
    status: "aktiv" as 'aktiv' | 'inaktiv' | 'potenziell',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customerCompany) {
      setFormData({
        name: customerCompany.name || "",
        address: customerCompany.address || "",
        postal_code: customerCompany.postal_code || "",
        city: customerCompany.city || "",
        country: customerCompany.country || "Schweiz",
        phone: customerCompany.phone || "",
        email: customerCompany.email || "",
        website: customerCompany.website || "",
        vat_number: customerCompany.vat_number || "",
        notes: customerCompany.notes || "",
        status: customerCompany.status,
      });
    } else {
      // Reset form for new company
      setFormData({
        name: "",
        address: "",
        postal_code: "",
        city: "",
        country: "Schweiz",
        phone: "",
        email: "",
        website: "",
        vat_number: "",
        notes: "",
        status: "aktiv" as 'aktiv' | 'inaktiv' | 'potenziell',
      });
    }
  }, [customerCompany, open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userCompanyId) {
      toast.error('Fehler: Firmen-ID nicht verfügbar');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Firmenname ist erforderlich');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        company_id: userCompanyId,
      };

      if (customerCompany) {
        // Update existing company
        const { error } = await supabase
          .from('customer_companies')
          .update(payload)
          .eq('id', customerCompany.id);

        if (error) throw error;
        toast.success('Kundenunternehmen erfolgreich aktualisiert');
      } else {
        // Create new company
        const { error } = await supabase
          .from('customer_companies')
          .insert(payload);

        if (error) throw error;
        toast.success('Kundenunternehmen erfolgreich erstellt');
      }

      onSaved();
    } catch (error) {
      console.error('Error saving customer company:', error);
      toast.error('Fehler beim Speichern des Kundenunternehmens');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!customerCompany) return;

    if (!confirm('Möchten Sie dieses Kundenunternehmen wirklich löschen?')) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('customer_companies')
        .delete()
        .eq('id', customerCompany.id);

      if (error) throw error;
      toast.success('Kundenunternehmen erfolgreich gelöscht');
      onSaved();
    } catch (error) {
      console.error('Error deleting customer company:', error);
      toast.error('Fehler beim Löschen des Kundenunternehmens');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {customerCompany ? 'Kundenunternehmen bearbeiten' : 'Neues Kundenunternehmen'}
          </DialogTitle>
          <DialogDescription>
            {customerCompany
              ? 'Bearbeiten Sie die Informationen des Kundenunternehmens.'
              : 'Erfassen Sie ein neues Kundenunternehmen.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="name">Firmenname *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Name des Unternehmens"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Strasse und Hausnummer"
              />
            </div>

            <div>
              <Label htmlFor="postal_code">PLZ</Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => handleInputChange("postal_code", e.target.value)}
                placeholder="Postleitzahl"
              />
            </div>

            <div>
              <Label htmlFor="city">Ort</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Stadt/Ort"
              />
            </div>

            <div>
              <Label htmlFor="country">Land</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                placeholder="Land"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aktiv">Aktiv</SelectItem>
                  <SelectItem value="inaktiv">Inaktiv</SelectItem>
                  <SelectItem value="potenziell">Potenziell</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+41 44 123 45 67"
              />
            </div>

            <div>
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="info@unternehmen.ch"
              />
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="https://www.unternehmen.ch"
              />
            </div>

            <div>
              <Label htmlFor="vat_number">UID-Nummer</Label>
              <Input
                id="vat_number"
                value={formData.vat_number}
                onChange={(e) => handleInputChange("vat_number", e.target.value)}
                placeholder="CHE-123.456.789"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="notes">Notizen</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Zusätzliche Informationen..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <div>
              {customerCompany && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Löschen
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Abbrechen
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Speichern...' : 'Speichern'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}