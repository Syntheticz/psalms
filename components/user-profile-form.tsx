"use client";

import { useState, useRef, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { animate, createScope } from "animejs";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PersonalInfoForm } from "@/components/form-steps/personal-info-form";
import { SkillsForm } from "@/components/form-steps/skills-form";
import { ExperienceForm } from "@/components/form-steps/experience-form";
import { EducationForm } from "@/components/form-steps/education-form";
import { CertificatesForm } from "@/components/form-steps/certificates-form";
import { TechnicalSkillsForm } from "@/components/form-steps/technical-skills-form";
import { SoftSkillsForm } from "@/components/form-steps/soft-skills-form";
import { HardSkillsForm } from "@/components/form-steps/hard-skills-form";
import { FormStepIndicator } from "@/components/form-step-indicator";
import { userProfileSchema } from "@/lib/validation/user-profile-schema";
import { toast } from "sonner";
import { ProfilePreview } from "./form-steps/profile-preview";
import { saveApplicantInformation } from "@/lib/queries/user";
import { useSession } from "next-auth/react";
import { DefaultSession } from "next-auth";
import { useRouter } from "next/navigation";

type UserProfileFormValues = z.infer<typeof userProfileSchema>;
type UserSession = {
  id: string;
  role: string;
  username: string;
  name: string;
  email: string;
  isNewUser: boolean;
} & DefaultSession;

const steps = [
  { id: "personal-info", title: "Personal Info" },
  { id: "skills", title: "Skills" },
  { id: "experience", title: "Experience" },
  { id: "education", title: "Education" },
  { id: "certificates", title: "Certificates" },
  { id: "technical-skills", title: "Technical Skills" },
  { id: "soft-skills", title: "Soft Skills" },
  { id: "hard-skills", title: "Hard Skills" },
  { id: "review", title: "Review" },
];

export function UserProfileForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const formRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);
  const session = useSession();
  const router = useRouter();

  const methods = useForm<UserProfileFormValues>({
    resolver: zodResolver(userProfileSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      bio: "",
      skills: [],
      experience: [],
      education: [],
      certificates: [],
      technicalSkills: [],
      softSkills: [],
      hardSkills: [],
    },
  });

  const { handleSubmit } = methods;

  useEffect(() => {
    if (!formRef.current) return;
    scopeRef.current = createScope({ root: formRef });

    scopeRef.current.add(() => {
      if (formRef.current) {
        animate(formRef.current, {
          opacity: [0, 1],
          translateY: [20, 0],
          easing: "out(3)",
          duration: 800,
        });
      }
    });

    return () => scopeRef.current?.revert();
  }, []);

  useEffect(() => {
    scopeRef.current?.add(() => {
      const stepContent = formRef.current?.querySelector(".step-content");
      if (stepContent) {
        animate(stepContent, {
          opacity: [0, 1],
          translateX: [10, 0],
          easing: "out(3)",
          duration: 400,
        });
      }
    });
  }, [currentStep]);

  const onSubmit = async (data: UserProfileFormValues) => {
    try {
      session.data?.user;
      await saveApplicantInformation(data);
      session.update({ isNewUser: false });
      toast.success("Profile Updated!");
      router.push("/applicant/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "There was a problem!"
      );
    }
  };

  const nextStep = async () => {
    if (currentStep >= steps.length - 1) return; // Prevent clicking "Next" at last step

    const fields = getFieldsForStep(currentStep);
    const isValid = await methods.trigger(fields as any);

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    } else {
      toast.error("Validation Error!", {
        description: "Please fix any validation errors!",
      });
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const getFieldsForStep = (step: number): string[] => {
    switch (step) {
      case 0:
        return ["name", "email", "phone", "location", "website", "bio"];
      case 1:
        return ["skills"];
      case 2:
        return ["experience"];
      case 3:
        return ["education"];
      case 4:
        return ["certificates"];
      case 5:
        return ["technicalSkills"];
      case 6:
        return ["softSkills"];
      case 7:
        return ["hardSkills"];
      default:
        return [];
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <PersonalInfoForm />;
      case 1:
        return <SkillsForm />;
      case 2:
        return <ExperienceForm />;
      case 3:
        return <EducationForm />;
      case 4:
        return <CertificatesForm />;
      case 5:
        return <TechnicalSkillsForm />;
      case 6:
        return <SoftSkillsForm />;
      case 7:
        return <HardSkillsForm />;
      case 8:
        return <ProfilePreview data={methods.getValues()} />;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="max-w-4xl mx-auto" ref={formRef}>
        <FormStepIndicator steps={steps} currentStep={currentStep} />

        <Card className="mt-6">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="step-content">
                {renderStepContent(currentStep)}
              </div>

              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>

                {currentStep === steps.length - 1 && (
                  <Button type="submit">Submit</Button>
                )}

                {currentStep !== steps.length - 1 && (
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  );
}
