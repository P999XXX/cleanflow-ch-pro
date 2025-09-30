import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Building2, User, Users } from "lucide-react";

interface StatusBadgeProps {
  status: "active" | "inactive" | "pending" | "success" | "warning" | "error";
  children: React.ReactNode;
  className?: string;
}

/**
 * Generic Status Badge with consistent styling
 */
export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  const statusStyles = {
    active: "bg-success/10 text-success border-success/20",
    inactive: "bg-muted text-muted-foreground border-muted",
    pending: "bg-warning/10 text-warning border-warning/20",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    error: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <Badge 
      variant="outline" 
      className={cn("border", statusStyles[status], className)}
    >
      {children}
    </Badge>
  );
}

interface ContactTypeBadgeProps {
  type: "firma" | "person";
  className?: string;
}

/**
 * Contact Type Badge (Firma/Person)
 */
export function ContactTypeBadge({ type, className }: ContactTypeBadgeProps) {
  const config = {
    firma: {
      icon: Building2,
      label: "Firma",
      style: "bg-primary/10 text-primary border-primary/20",
    },
    person: {
      icon: User,
      label: "Person",
      style: "bg-secondary/10 text-secondary border-secondary/20",
    },
  };

  const { icon: Icon, label, style } = config[type];

  return (
    <Badge variant="outline" className={cn("border", style, className)}>
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </Badge>
  );
}

interface IndustryBadgeProps {
  industry: string;
  className?: string;
}

/**
 * Industry Badge with icon
 */
export function IndustryBadge({ industry, className }: IndustryBadgeProps) {
  return (
    <Badge variant="secondary" className={cn("text-xs", className)}>
      <Users className="w-3 h-3 mr-1" />
      {industry}
    </Badge>
  );
}

interface PrimaryContactBadgeProps {
  isPrimary: boolean;
  className?: string;
}

/**
 * Primary Contact Indicator Badge
 */
export function PrimaryContactBadge({ isPrimary, className }: PrimaryContactBadgeProps) {
  if (!isPrimary) return null;

  return (
    <Badge 
      variant="outline" 
      className={cn("bg-primary/10 text-primary border-primary/20", className)}
    >
      Hauptkontakt
    </Badge>
  );
}
