import * as React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

const calculatePasswordStrength = (password: string): { 
  score: number; 
  text: string; 
  color: string; 
} => {
  let score = 0;
  
  if (password.length >= 8) score += 25;
  if (/[a-z]/.test(password)) score += 25;
  if (/[A-Z]/.test(password)) score += 25;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 10;

  let text = "";
  let color = "";

  if (score === 0) {
    text = "";
    color = "bg-transparent";
  } else if (score <= 33) {
    text = "Schwach";
    color = "bg-destructive";
  } else if (score <= 66) {
    text = "Mittel";
    color = "bg-warning";
  } else {
    text = "Stark";
    color = "bg-success";
  }

  return { score: Math.min(score, 100), text, color };
};

export const PasswordStrength = React.forwardRef<HTMLDivElement, PasswordStrengthProps>(
  ({ password, className }, ref) => {
    const strength = calculatePasswordStrength(password);

    if (!password) return null;

    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Passwort-Stärke:</span>
          <span
            className={cn("text-sm font-medium", {
              "text-destructive": strength.score > 0 && strength.score <= 33,
              "text-warning": strength.score > 33 && strength.score <= 66,
              "text-success": strength.score > 66,
            })}
          >
            {strength.text}
          </span>
        </div>
        <Progress
          value={strength.score}
          className={cn(
            "h-2 bg-muted",
            {
              "[&>div]:bg-transparent": strength.score === 0,
              "[&>div]:!bg-destructive": strength.score > 0 && strength.score <= 33,
              "[&>div]:!bg-warning": strength.score > 33 && strength.score <= 66,
              "[&>div]:!bg-success": strength.score > 66,
            }
          )}
        />
        <p className="text-xs text-muted-foreground">Min: 8 Zeichen, a–z, A–Z, 0–9</p>
      </div>
    );
  }
);
PasswordStrength.displayName = "PasswordStrength";