import * as React from "react";
import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";
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
        
        {/* Anforderungen-Liste - nur unerfüllte Anforderungen anzeigen */}
        <div className="space-y-1">
          {!strength.requirements.length && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-muted" />
              <span>Mindestens 8 Zeichen</span>
            </div>
          )}
          {!strength.requirements.lowercase && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-muted" />
              <span>Kleinbuchstaben (a-z)</span>
            </div>
          )}
          {!strength.requirements.uppercase && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-muted" />
              <span>Großbuchstaben (A-Z)</span>
            </div>
          )}
          {!strength.requirements.numbers && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-muted" />
              <span>Zahlen (0-9)</span>
            </div>
          )}
          {!strength.requirements.symbols && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-muted" />
              <span>Sonderzeichen (!@#$%^&*)</span>
            </div>
          )}
          
          {/* Erfolgsmeldung wenn alle Anforderungen erfüllt sind */}
          {strength.score === 100 && (
            <div className="flex items-center gap-2 text-xs text-success">
              <Check className="w-3 h-3" />
              <span>Alle Anforderungen erfüllt!</span>
            </div>
          )}
        </div>
      </div>
    );
  }
);
PasswordStrength.displayName = "PasswordStrength";