"use client";

import { useEffect, useRef } from "react";
import { animate, createScope } from "animejs";

interface Step {
  id: string;
  title: string;
}

interface FormStepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function FormStepIndicator({
  steps,
  currentStep,
}: FormStepIndicatorProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    if (!scopeRef.current) {
      scopeRef.current = createScope({ root: rootRef });
    }

    const scope = scopeRef.current;

    scope.add(() => {
      requestAnimationFrame(() => {
        const stepCircles = rootRef.current?.querySelectorAll(".step-circle");

        if (stepCircles && currentStep < stepCircles.length) {
          const stepCircle = stepCircles[currentStep];
          if (stepCircle) {
            animate(stepCircle, {
              delay: 300,
              scale: [{ to: 1.2, ease: "inOut(3)", duration: 400 }, { to: 1 }],
              duration: 600,
            });
          }
        }

        const line = rootRef.current?.querySelector(".progress-line");

        if (currentStep === 1 && line) {
          animate(line, {
            width: `${(currentStep / (steps.length - 1)) * 100 + 5}%`,
            ease: "inOutQuad",
            duration: 600,
          });
        } else if (currentStep === 0 && line) {
          animate(line, {
            width: `2%`,
            ease: "inOutQuad",
            duration: 600,
          });
        } else if (line) {
          animate(line, {
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
            ease: "inOutQuad",
            duration: 600,
          });
        }
      });
    });

    return () => {
      scopeRef.current?.revert();
    };
  }, [currentStep, steps.length]);

  return (
    <div className="hidden md:block relative" ref={rootRef}>
      <div className="h-1 bg-muted absolute top-5 left-0 w-full">
        <div
          className="progress-line h-1 bg-primary rounded-full"
          style={{ width: "0%" }}
        />
      </div>
      <div className="flex justify-between relative">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div
              className={`step-circle w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                index <= currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {index + 1}
            </div>
            <div
              className={`mt-2 text-xs ${
                index <= currentStep ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {step.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
