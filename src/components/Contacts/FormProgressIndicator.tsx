import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import React from "react";

interface FormProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export const FormProgressIndicator = ({ 
  currentStep, 
  totalSteps, 
  stepLabels 
}: FormProgressIndicatorProps) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="w-full py-3 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          Schritt {currentStep} von {totalSteps}
        </span>
        <span className="text-muted-foreground font-medium">
          {stepLabels[currentStep - 1]}
        </span>
      </div>
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-in-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
