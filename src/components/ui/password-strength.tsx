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
  requirements: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    numbers: boolean;
    symbols: boolean;
  };
} => {
  const requirements = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /[0-9]/.test(password),
    symbols: /[^A-Za-z0-9]/.test(password),
  };

  let score = 0;
  
  if (requirements.length) score += 20;
  if (requirements.lowercase) score += 20;
  if (requirements.uppercase) score += 20;
  if (requirements.numbers) score += 20;
  if (requirements.symbols) score += 20;

  let text = "";
  let color = "";

  if (score === 0) {
    text = "";
    color = "bg-transparent";
  } else if (score < 80) {
    text = "Schwach";
    color = "bg-destructive";
  } else if (score < 100) {
    text = "Mittel";
    color = "bg-warning";
  } else {
    text = "Stark";
    color = "bg-success";
  }

  return { score, text, color, requirements };
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
              "text-destructive": strength.score > 0 && strength.score < 80,
              "text-warning": strength.score >= 80 && strength.score < 100,
              "text-success": strength.score === 100,
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
              "[&>div]:!bg-destructive": strength.score > 0 && strength.score < 80,
              "[&>div]:!bg-warning": strength.score >= 80 && strength.score < 100,
              "[&>div]:!bg-success": strength.score === 100,
            }
          )}
        />
        
        {/* Anforderungen-Liste */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <div className={cn("w-1.5 h-1.5 rounded-full", 
              strength.requirements.length ? "bg-success" : "bg-muted"
            )} />
            <span className={cn(
              strength.requirements.length ? "text-success" : "text-muted-foreground"
            )}>
              Mindestens 8 Zeichen
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className={cn("w-1.5 h-1.5 rounded-full", 
              strength.requirements.lowercase ? "bg-success" : "bg-muted"
            )} />
            <span className={cn(
              strength.requirements.lowercase ? "text-success" : "text-muted-foreground"
            )}>
              Kleinbuchstaben (a-z)
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className={cn("w-1.5 h-1.5 rounded-full", 
              strength.requirements.uppercase ? "bg-success" : "bg-muted"
            )} />
            <span className={cn(
              strength.requirements.uppercase ? "text-success" : "text-muted-foreground"
            )}>
              Großbuchstaben (A-Z)
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className={cn("w-1.5 h-1.5 rounded-full", 
              strength.requirements.numbers ? "bg-success" : "bg-muted"
            )} />
            <span className={cn(
              strength.requirements.numbers ? "text-success" : "text-muted-foreground"
            )}>
              Zahlen (0-9)
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className={cn("w-1.5 h-1.5 rounded-full", 
              strength.requirements.symbols ? "bg-success" : "bg-muted"
            )} />
            <span className={cn(
              strength.requirements.symbols ? "text-success" : "text-muted-foreground"
            )}>
              Sonderzeichen (!@#$%^&*)
            </span>
          </div>
        </div>
      </div>
    );
  }
);
PasswordStrength.displayName = "PasswordStrength";