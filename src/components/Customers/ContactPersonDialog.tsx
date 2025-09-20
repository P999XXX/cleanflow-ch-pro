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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContactPerson {
  id: string;
  customer_company_id?: string;
  first_name: string;
  last_name: string;
  title?: string;
  department?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  notes?: string;
  is_primary_contact: boolean;
}

interface CustomerCompany {
  id: string;
  name: string;
}

interface ContactPersonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
  contactPerson: ContactPerson | null;
  userCompanyId: string | null;
}

export function ContactPersonDialog({
  open,
  onOpenChange,
  onSaved,
  contactPerson,
  userCompanyId,
}: ContactPersonDialogProps) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    title: "",
    department: "",
    phone: "",
    mobile: "",
    email: "",
    notes: "",
    is_primary_contact: false,
    customer_company_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [customerCompanies, setCustomerCompanies] = useState<CustomerCompany[]>([]);

  useEffect(() => {
    if (open && userCompanyId) {
      fetchCustomerCompanies();
    }
  }, [open, userCompanyId]);

  useEffect(() => {
    if (contactPerson) {
      setFormData({
        first_name: contactPerson.first_name || "",
        last_name: contactPerson.last_name || "",
        title: contactPerson.title || "",
        department: contactPerson.department || "",
        phone: contactPerson.phone || "",
        mobile: contactPerson.mobile || "",
        email: contactPerson.email || "",
        notes: contactPerson.notes || "",
        is_primary_contact: contactPerson.is_primary_contact || false,
        customer_company_id: contactPerson.customer_company_id || "",
      });
    } else {
      // Reset form for new contact
      setFormData({
        first_name: "",
        last_name: "",
        title: "",
        department: "",
        phone: "",
        mobile: "",
        email: "",
        notes: "",
        is_primary_contact: false,
        customer_company_id: "",
      });
    }
  }, [contactPerson, open]);

  const fetchCustomerCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_companies')
        .select('id, name')
        .eq('company_id', userCompanyId)
        .order('name', { ascending: true });

      if (error) throw error;
      setCustomerCompanies(data || []);
    } catch (error) {
      console.error('Error fetching customer companies:', error);
      toast.error('Fehler beim Laden der Kundenunternehmen');
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userCompanyId) {
      toast.error('Fehler: Firmen-ID nicht verfügbar');
      return;
    }

    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      toast.error('Vor- und Nachname sind erforderlich');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        company_id: userCompanyId,
        customer_company_id: formData.customer_company_id || null,
      };

      if (contactPerson) {
        // Update existing contact
        const { error } = await supabase
          .from('contact_persons')
          .update(payload)
          .eq('id', contactPerson.id);

        if (error) throw error;
        toast.success('Kontaktperson erfolgreich aktualisiert');
      } else {
        // Create new contact
        const { error } = await supabase
          .from('contact_persons')
          .insert(payload);

        if (error) throw error;
        toast.success('Kontaktperson erfolgreich erstellt');
      }

      onSaved();
    } catch (error) {
      console.error('Error saving contact person:', error);
      toast.error('Fehler beim Speichern der Kontaktperson');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!contactPerson) return;

    if (!confirm('Möchten Sie diese Kontaktperson wirklich löschen?')) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('contact_persons')
        .delete()
        .eq('id', contactPerson.id);

      if (error) throw error;
      toast.success('Kontaktperson erfolgreich gelöscht');
      onSaved();
    } catch (error) {
      console.error('Error deleting contact person:', error);
      toast.error('Fehler beim Löschen der Kontaktperson');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {contactPerson ? 'Kontaktperson bearbeiten' : 'Neue Kontaktperson'}
          </DialogTitle>
          <DialogDescription>
            {contactPerson
              ? 'Bearbeiten Sie die Informationen der Kontaktperson.'
              : 'Erfassen Sie eine neue Kontaktperson.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">Vorname *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleInputChange("first_name", e.target.value)}
                placeholder="Vorname"
                required
              />
            </div>

            <div>
              <Label htmlFor="last_name">Nachname *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleInputChange("last_name", e.target.value)}
                placeholder="Nachname"
                required
              />
            </div>

            <div>
              <Label htmlFor="title">Titel</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Dr., Prof., etc."
              />
            </div>

            <div>
              <Label htmlFor="department">Abteilung</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleInputChange("department", e.target.value)}
                placeholder="Abteilung/Bereich"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="customer_company_id">Zugehöriges Unternehmen</Label>
              <Select 
                value={formData.customer_company_id} 
                onValueChange={(value) => handleInputChange("customer_company_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unternehmen auswählen (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Kein Unternehmen</SelectItem>
                  {customerCompanies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
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
              <Label htmlFor="mobile">Mobile</Label>
              <Input
                id="mobile"
                type="tel"
                value={formData.mobile}
                onChange={(e) => handleInputChange("mobile", e.target.value)}
                placeholder="+41 79 123 45 67"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="kontakt@beispiel.ch"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_primary_contact"
                  checked={formData.is_primary_contact}
                  onCheckedChange={(checked) => handleInputChange("is_primary_contact", checked === true)}
                />
                <Label htmlFor="is_primary_contact">Hauptkontakt</Label>
              </div>
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
              {contactPerson && (
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