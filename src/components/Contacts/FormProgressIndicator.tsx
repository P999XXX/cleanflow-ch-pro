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
    <div className="w-full py-4 px-2">
      <div className="flex items-center w-full">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <React.Fragment key={stepNumber}>
              {/* Step Circle and Label */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200",
                    isCompleted && "bg-primary text-primary-foreground",
                    isCurrent && "bg-primary text-primary-foreground",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground border-2 border-muted-foreground/20"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium text-center max-w-[80px]",
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
              </div>

              {/* Connector Line */}
              {stepNumber < totalSteps && (
                <div className="flex-1 px-2 pb-6">
                  <div
                    className={cn(
                      "w-full h-0.5 transition-all duration-200",
                      stepNumber < currentStep ? "bg-primary" : "bg-muted"
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
