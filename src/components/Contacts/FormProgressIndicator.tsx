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
    <div className="w-full py-6 px-2">
      <div className="flex items-center justify-between w-full">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <React.Fragment key={stepNumber}>
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300",
                    isCompleted && "bg-primary text-primary-foreground shadow-lg",
                    isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/30 shadow-xl scale-110",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <span
                  className={cn(
                    "mt-3 text-xs sm:text-sm font-medium text-center whitespace-nowrap",
                    isCurrent ? "text-foreground font-bold" : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
              </div>
              {stepNumber < totalSteps && (
                <div className="flex-1 px-3 flex items-center">
                  <div
                    className={cn(
                      "w-full h-1 rounded-full transition-all duration-300",
                      stepNumber < currentStep ? "bg-primary shadow-sm" : "bg-muted"
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
