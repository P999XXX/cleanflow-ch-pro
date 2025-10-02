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
  return (
    <div className="w-full py-3">
      <div className="flex items-center w-full">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <React.Fragment key={stepNumber}>
              {/* Step Circle and Label */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                    isCompleted && "bg-primary text-primary-foreground",
                    isCurrent && "bg-primary text-primary-foreground",
                    !isCompleted && !isCurrent && "bg-muted/50 text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <span
                  className={cn(
                    "text-[11px] font-normal text-center max-w-[70px]",
                    isCurrent ? "text-foreground" : "text-muted-foreground/70"
                  )}
                >
                  {label}
                </span>
              </div>

              {/* Connector Line */}
              {stepNumber < totalSteps && (
                <div className="flex-1 px-1.5 pb-6">
                  <div
                    className={cn(
                      "w-full h-px transition-colors",
                      stepNumber < currentStep ? "bg-primary/60" : "bg-muted/40"
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
