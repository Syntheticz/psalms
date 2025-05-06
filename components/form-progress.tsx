"use client";

import { useEffect, useRef } from "react";
import { animate, createScope } from "animejs";
import { cn } from "@/lib/utils";

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: { id: string; title: string }[];
}

export function FormProgress({
  currentStep,
  totalSteps,
  steps,
}: FormProgressProps) {
  const root = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const scope = useRef<any>(null);

  useEffect(() => {
    scope.current = createScope({ root }).add(() => {
      animate(progressRef.current!, {
        width: `${((currentStep + 1) / totalSteps) * 100}%`,
        easing: "inOut(2)",
        duration: 400,
      });
    });

    return () => scope.current?.revert();
  }, [currentStep, totalSteps]);

  return (
    <div className="mb-8" ref={root}>
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-primary text-primary-foreground">
              Step {currentStep + 1} of {totalSteps}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-primary">
              {Math.round(((currentStep + 1) / totalSteps) * 100)}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary/20">
          <div
            ref={progressRef}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "text-xs font-medium text-center flex-1",
              index <= currentStep ? "text-primary" : "text-muted-foreground"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center",
                index < currentStep
                  ? "bg-primary text-primary-foreground"
                  : index === currentStep
                  ? "border-2 border-primary text-primary"
                  : "border-2 border-muted-foreground text-muted-foreground"
              )}
            >
              {index < currentStep ? "✓" : index + 1}
            </div>
            {step.title}
          </div>
        ))}
      </div>
    </div>
  );
}
