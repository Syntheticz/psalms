"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { animate, createScope, createSpring } from "animejs";

interface WelcomeScreenProps {
  onContinue: () => void;
}

export function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<any>(null); // Type as needed

  useEffect(() => {
    // Create scoped animation
    scopeRef.current = createScope({ root: rootRef }).add(() => {
      // Card fade-in and translate
      animate(".card", {
        opacity: [0, 1],
        translateY: [20, 0],
        ease: "out(3)",
        duration: 800,
      });

      // Text elements with stagger
      animate(".animate-text", {
        opacity: [0, 1],
        translateY: [20, 0],
        delay: 200,
        ease: "out(2)",
        duration: 800,
      });

      // Button entrance + pulse loop
      animate(".start-button", {
        opacity: [0, 1],
        translateY: [20, 0],
        ease: "out(3)",
        delay: 1000,
        duration: 800,
        complete: () => {
          animate(".start-button", {
            scale: [1, 1.05, 1],
            duration: 1500,
            loop: true,
            ease: "inOut(2)",
          });
        },
      });
    });

    return () => scopeRef.current?.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="flex items-center justify-center min-h-[70vh]"
    >
      <Card className="w-full max-w-lg card">
        <CardContent className="pt-10 pb-8 px-8">
          <div className="space-y-6 text-center mb-10">
            <h1 className="text-3xl font-bold animate-text">Almost there!</h1>
            <p className="text-xl text-muted-foreground animate-text">
              We just need a little bit of info for fuzzy matching
            </p>
            <p className="animate-text">
              Complete your profile to help us match you with the perfect
              opportunities.
            </p>
          </div>

          <div className="flex justify-center">
            <Button size="lg" className="start-button" onClick={onContinue}>
              Let&apos;s Get Started
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
