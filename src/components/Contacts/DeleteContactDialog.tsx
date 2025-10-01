import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

/**
 * Confirmation dialog for deleting a contact
 */
export function DeleteContactDialog({
  open,
  onOpenChange,
  onConfirm,
}: DeleteContactDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Kontakt löschen?</AlertDialogTitle>
          <AlertDialogDescription>
            Diese Aktion kann nicht rückgängig gemacht werden. Der Kontakt wird permanent gelöscht und alle verknüpften Daten gehen verloren.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col items-center gap-3 pt-4">
          <Button onClick={onConfirm} variant="destructive" className="w-full">
            Löschen
          </Button>
          <button 
            type="button" 
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            Abbrechen
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
