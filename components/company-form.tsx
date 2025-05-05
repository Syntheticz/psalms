"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { animate, createScope } from "animejs";
import { BasicInfoStep } from "./form-steps/basic-info-step";
import { ContactStep } from "./form-steps/contact-step";
import { DescriptionStep } from "./form-steps/description-step";
import { SocialMediaStep } from "./form-steps/social-media-step";
import { ContactPersonStep } from "./form-steps/contact-person-step";
import { FormProgress } from "./form-progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Benefit, Company, ContactPerson, SocialMedia } from "@prisma/client";
import { toast } from "sonner";
import { saveEmployerProfile } from "@/lib/queries/user";
import { useSession } from "next-auth/react";

export interface CompanyFormData extends Company {
  benefits?: Benefit[];
  socialMedia?: SocialMedia;
  contactPerson: ContactPerson;
}

export function CompanyForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const scope = useRef<any>(null);
  const { data: session, update } = useSession();

  const methods = useForm<CompanyFormData>({
    defaultValues: {
      id: crypto.randomUUID(),
      name: "",
      logo: "",
      industry: "",
      size: "",
      founded: undefined,
      website: "",
      location: "",
      email: "",
      phone: "",
      description: "",
      profileCompletion: 0,
      benefits: [],
      socialMedia: {
        id: crypto.randomUUID(),
        linkedin: "",
        twitter: "",
        facebook: "",
      },
      contactPerson: {
        id: crypto.randomUUID(),
        name: "",
        contactNumber: "",
        email: "",
      },
    },
    mode: "onChange",
  });

  const steps = [
    {
      id: "basic-info",
      title: "Basic Information",
      component: <BasicInfoStep />,
    },
    { id: "contact", title: "Location & Contact", component: <ContactStep /> },
    {
      id: "contact-person",
      title: "Contact Person",
      component: <ContactPersonStep />,
    },
    {
      id: "description",
      title: "Description & Benefits",
      component: <DescriptionStep />,
    },
    {
      id: "social-media",
      title: "Social Media",
      component: <SocialMediaStep />,
    },
  ];

  const totalSteps = steps.length;

  useEffect(() => {
    scope.current = createScope({ root: formContainerRef }).add(() => {
      animate(formContainerRef.current!, {
        opacity: [0, 1],
        translateY: [20, 0],
        easing: "inOut(2)",
        duration: 500,
      });
    });

    return () => {
      scope.current?.revert();
    };
  }, []);

  const animateTransition = (direction: "next" | "prev") => {
    if (!formContainerRef.current) return;

    animate(formContainerRef.current, {
      opacity: [0, 1],
      translateX: direction === "next" ? [100, 0] : [-100, 0],
      easing: "inOut(2)",
      duration: 500,
    });
  };

  const handleNext = async () => {
    const isValid = await methods.trigger(getFieldsForCurrentStep());

    if (isValid) {
      if (currentStep < totalSteps - 1) {
        animateTransition("next");
        setCurrentStep((prev) => prev + 1);
      } else {
        methods.handleSubmit(onSubmit)();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      animateTransition("prev");
      setCurrentStep((prev) => prev - 1);
    }
  };

  const getFieldsForCurrentStep = (): any => {
    switch (currentStep) {
      case 0:
        return ["name", "industry", "size", "founded", "website"];
      case 1:
        return ["location", "email", "phone"];
      case 2:
        return [
          "contactPerson.name",
          "contactPerson.email",
          "contactPerson.contactNumber",
        ];
      case 3:
        return ["description", "benefits"];
      case 4:
        return [
          "socialMedia.linkedin",
          "socialMedia.twitter",
          "socialMedia.facebook",
        ];
      default:
        return [];
    }
  };

  const onSubmit = async (data: CompanyFormData) => {
    try {
      await saveEmployerProfile(data);
      await update({ isNewUser: false });
      toast.success("Profile Updated!");
      await update();

      window.location.reload();
    } catch (error) {
      toast.error("There was an error!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <FormProgress
        currentStep={currentStep}
        totalSteps={totalSteps}
        steps={steps}
      />

      <Card className="p-6 mt-8">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div ref={formContainerRef} className="min-h-[400px]">
              {steps[currentStep].component}
            </div>

            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                Previous
              </Button>

              <Button type="button" onClick={handleNext}>
                {currentStep === totalSteps - 1 ? "Submit" : "Next"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
}
