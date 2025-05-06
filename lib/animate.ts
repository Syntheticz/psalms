import { animate, createSpring, createScope } from "animejs";

let scope: ReturnType<typeof createScope>;

export const initAnimations = (root: React.RefObject<HTMLElement>) => {
  if (!root.current) return;

  // Initialize and store the scoped animations
  scope = createScope({ root });

  scope.add(() => {
    // Define reusable animations
    scope.methods = {
      animateAddElement: (selector: string) =>
        animate(selector, {
          opacity: [0, 1],
          translateY: [20, 0],
          scale: [0.9, 1],
          duration: 400,
          ease: "out(3)",
        }),

      animateRemoveElement: (selector: string, onComplete: () => void) =>
        animate(selector, {
          opacity: [1, 0],
          translateY: [0, -20],
          scale: [1, 0.9],
          duration: 300,
          ease: "in(3)",
          onComplete,
        }),

      animateFormSubmission: (selector: string) =>
        animate(selector, {
          translateY: [0, -10, 0],
          duration: 600,
          ease: "inOut(2.5)",
        }),

      animateErrorShake: (selector: string) =>
        animate(selector, {
          translateX: [0, -10, 10, -10, 10, 0],
          duration: 500,
          ease: "inOut(2.5)",
        }),

      animateSuccess: (selector: string) =>
        animate(selector, {
          backgroundColor: [
            { to: "rgba(34, 197, 94, 0.2)", duration: 300 },
            { to: "rgba(255, 255, 255, 0)", duration: 800 },
          ],
          ease: "out(2)",
        }),

      animateCardEntrance: (selector: string, delay = 0) =>
        animate(selector, {
          opacity: [0, 1],
          translateY: [50, 0],
          delay: delay,
          duration: 800,
          ease: "out(4.5)",
        }),
    };
  });
};

// Utility to clean up the animations when the component unmounts
export const cleanupAnimations = () => {
  if (scope) scope.revert();
};
