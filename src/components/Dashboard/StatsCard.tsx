import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: "primary" | "secondary" | "success" | "warning" | "destructive";
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon: Icon,
  iconColor = "primary"
}: StatsCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-success";
      case "negative":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getIconBackground = () => {
    switch (iconColor) {
      case "primary":
        return "bg-primary/10 text-primary";
      case "secondary":
        return "bg-secondary/10 text-secondary";
      case "success":
        return "bg-success/10 text-success";
      case "warning":
        return "bg-warning/10 text-warning";
      case "destructive":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-clean-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <p className="text-2xl font-bold text-foreground">
              {value}
            </p>
            {change && (
              <p className={cn("text-xs font-medium", getChangeColor())}>
                {change}
              </p>
            )}
          </div>
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            getIconBackground()
          )}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}