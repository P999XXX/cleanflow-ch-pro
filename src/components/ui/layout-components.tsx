import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { designTokens } from "@/lib/design-tokens";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "secondary";
  };
  className?: string;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  className 
}: EmptyStateProps) {
  return (
    <Card className={cn("border-dashed border-2 border-muted", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="p-4 rounded-full bg-muted/1 mb-4">
          <Icon className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
        {action && (
          <Button 
            variant={action.variant || "default"} 
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

interface StatusBadgeProps {
  status: "active" | "inactive" | "pending" | "success" | "warning" | "error";
  children: React.ReactNode;
  className?: string;
}

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

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, description, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6", className)}>
      <div>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Standard Page Container with consistent spacing
 */
export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn(designTokens.layouts.pageContainer, className)}>
      {children}
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Standard Page Header with icon and actions
 */
export function PageHeader({ title, description, icon: Icon, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4", className)}>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-6 w-6 text-primary" />}
          <h1 className={designTokens.typography.pageTitle}>{title}</h1>
        </div>
        {description && (
          <p className={designTokens.typography.muted}>{description}</p>
        )}
      </div>
      {actions && <div className="flex gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}

interface InteractiveCardProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * Interactive Card with hover effects
 */
export function InteractiveCard({ onClick, children, className }: InteractiveCardProps) {
  return (
    <Card 
      className={cn(
        designTokens.cards.interactive,
        "hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Card>
  );
}