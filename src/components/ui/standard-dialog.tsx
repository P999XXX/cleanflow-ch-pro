import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { designTokens } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

interface StandardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullMobile';
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

/**
 * Standardized Dialog Component for CleanFlow.ai
 * Provides consistent dialog structure across the application
 */
export function StandardDialog({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  children,
  footer,
  className,
}: StandardDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          designTokens.containers.dialog[size],
          designTokens.dialogs.content,
          "h-[90vh]",
          className
        )}
      >
        <DialogHeader className={designTokens.dialogs.header}>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-muted-foreground">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className={cn(designTokens.dialogs.body, "flex-1 overflow-y-auto")}>
          {children}
        </div>
        
        {footer && (
          <div className={designTokens.dialogs.footer}>
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
