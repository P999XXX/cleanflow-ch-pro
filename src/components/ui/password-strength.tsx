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
  criteria: { label: string; met: boolean }[] 
} => {
  let score = 0;
  
  const criteria = [
    { label: "Mindestens 8 Zeichen", met: password.length >= 8 },
    { label: "Kleinbuchstaben (a-z)", met: /[a-z]/.test(password) },
    { label: "Großbuchstaben (A-Z)", met: /[A-Z]/.test(password) },
    { label: "Zahlen (0-9)", met: /[0-9]/.test(password) },
    { label: "Sonderzeichen (!@#$...)", met: /[^A-Za-z0-9]/.test(password) }
  ];

  criteria.forEach((criterion, index) => {
    if (criterion.met) {
      if (index === 4) { // Sonderzeichen geben Bonus
        score += 10;
      } else {
        score += 25;
      }
    }
  });

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

  return { score: Math.min(score, 100), text, color, criteria };
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
        <div className="space-y-1">
          {strength.criteria.map((criterion, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <div className={cn("w-2 h-2 rounded-full", 
                criterion.met ? "bg-success" : "bg-muted"
              )} />
              <span className={criterion.met ? "text-success" : "text-muted-foreground"}>
                {criterion.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
);
PasswordStrength.displayName = "PasswordStrength";