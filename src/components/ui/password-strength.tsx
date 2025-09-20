import * as React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

const calculatePasswordStrength = (password: string): { score: number; text: string; color: string } => {
  let score = 0;
  let feedback: string[] = [];

  if (password.length >= 8) score += 25;
  else feedback.push("mindestens 8 Zeichen");

  if (/[a-z]/.test(password)) score += 25;
  else feedback.push("Kleinbuchstaben");

  if (/[A-Z]/.test(password)) score += 25;
  else feedback.push("Großbuchstaben");

  if (/[0-9]/.test(password)) score += 25;
  else feedback.push("Zahlen");

  if (/[^A-Za-z0-9]/.test(password)) score += 10;

  let text = "";
  let color = "";

  if (score <= 25) {
    text = "Schwach";
    color = "bg-destructive";
  } else if (score <= 50) {
    text = "Mittel";
    color = "bg-warning";
  } else if (score <= 75) {
    text = "Gut";
    color = "bg-secondary";
  } else {
    text = "Sehr stark";
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
          <span className={cn("text-sm font-medium", {
            "text-destructive": strength.score <= 25,
            "text-warning": strength.score > 25 && strength.score <= 50,
            "text-secondary": strength.score > 50 && strength.score <= 75,
            "text-success": strength.score > 75,
          })}>
            {strength.text}
          </span>
        </div>
        <Progress 
          value={strength.score} 
          className={cn("h-2", `[&>div]:${strength.color}`)}
        />
      </div>
    );
  }
);
PasswordStrength.displayName = "PasswordStrength";