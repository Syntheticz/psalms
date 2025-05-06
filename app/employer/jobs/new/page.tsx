"use client";

import { useEffect, useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, MinusCircle, ArrowRight, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { createNewJobPosting } from "@/lib/queries/jobs";
import { useQuery } from "@tanstack/react-query";
import { fetchUserCompany } from "@/lib/queries/user";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  company_name: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  company_address: z.string().min(5, {
    message: "Please enter the company address.",
  }),
  contact: z.string().min(5, {
    message: "Please enter contact information.",
  }),
  job_title: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  industry_field: z.string().min(2, {
    message: "Please select an industry field.",
  }),
  description: z.string().min(10, {
    message: "Job description must be at least 10 characters.",
  }),
  priority_categories: z.array(z.string()).min(1, {
    message: "Please add at least one priority category.",
  }),
  qualifications: z
    .array(
      z.object({
        requirement: z.string().min(2, {
          message: "Requirement must be at least 2 characters.",
        }),
        possible_credentials: z.array(z.string()),
        categories: z.array(z.string()),
        priority: z.boolean(),
      })
    )
    .min(1, {
      message: "Please add at least one qualification.",
    }),
  salaryRange: z.string({
    required_error: "Please select a salary range.",
  }),
  customMinSalary: z.string().optional(),
  customMaxSalary: z.string().optional(),
});

export type JobPostingFormValues = z.infer<typeof formSchema>;

export default function PostJobPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const totalSteps = 3;

  const { data: company } = useQuery({
    queryKey: ["company_name"],
    queryFn: async () => await fetchUserCompany(),
  });

  const form = useForm<JobPostingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: "",
      company_address: "",
      contact: "",
      job_title: "",
      industry_field: "",
      description: "",
      priority_categories: [],
      qualifications: [
        {
          requirement: "",
          possible_credentials: [],
          categories: [],
          priority: false,
        },
      ],
      salaryRange: "",
    },
  });

  useEffect(() => {
    if (!company) return;

    form.setValue("company_name", company.name);
    form.setValue("company_address", company.location || "");
  }, [company]);

  const [newCategory, setNewCategory] = useState("");
  const [newCredential, setNewCredential] = useState("");
  const [newQualificationCategory, setNewQualificationCategory] = useState("");

  async function onSubmit(data: JobPostingFormValues) {
    await createNewJobPosting(data);

    toast("Job Posted Successfully!", {
      description: "Your job has been posted.",
    });

    router.push("/employer/jobs");
  }

  function onError(errors: FieldErrors<JobPostingFormValues>) {
    toast.error("There was an error!", {
      description: "Please fill up the required field!",
    });
  }

  function nextStep() {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  }

  function prevStep() {
    if (step > 1) {
      setStep(step - 1);
    }
  }

  function addCategory() {
    if (newCategory.trim() !== "") {
      const currentCategories = form.getValues("priority_categories");
      form.setValue("priority_categories", [
        ...currentCategories,
        newCategory.trim(),
      ]);
      setNewCategory("");
    }
  }

  function removeCategory(index: number) {
    const currentCategories = form.getValues("priority_categories");
    form.setValue(
      "priority_categories",
      currentCategories.filter((_, i) => i !== index)
    );
  }

  function addQualification() {
    const currentQualifications = form.getValues("qualifications");
    form.setValue("qualifications", [
      ...currentQualifications,
      {
        requirement: "",
        possible_credentials: [],
        categories: [],
        priority: false,
      },
    ]);
  }

  function removeQualification(index: number) {
    const currentQualifications = form.getValues("qualifications");
    form.setValue(
      "qualifications",
      currentQualifications.filter((_, i) => i !== index)
    );
  }

  function addCredential(qualificationIndex: number) {
    if (newCredential.trim() !== "") {
      const currentQualifications = form.getValues("qualifications");
      const updatedQualifications = [...currentQualifications];
      updatedQualifications[qualificationIndex].possible_credentials = [
        ...updatedQualifications[qualificationIndex].possible_credentials,
        newCredential.trim(),
      ];
      form.setValue("qualifications", updatedQualifications);
      setNewCredential("");
    }
  }
  console.log(form.formState.errors);
  function removeCredential(
    qualificationIndex: number,
    credentialIndex: number
  ) {
    const currentQualifications = form.getValues("qualifications");
    const updatedQualifications = [...currentQualifications];
    updatedQualifications[qualificationIndex].possible_credentials =
      updatedQualifications[qualificationIndex].possible_credentials.filter(
        (_, i) => i !== credentialIndex
      );
    form.setValue("qualifications", updatedQualifications);
  }

  function addQualificationCategory(qualificationIndex: number) {
    if (newQualificationCategory.trim() !== "") {
      const currentQualifications = form.getValues("qualifications");
      const updatedQualifications = [...currentQualifications];
      updatedQualifications[qualificationIndex].categories = [
        ...updatedQualifications[qualificationIndex].categories,
        newQualificationCategory.trim(),
      ];
      form.setValue("qualifications", updatedQualifications);
      setNewQualificationCategory("");
    }
  }

  function removeQualificationCategory(
    qualificationIndex: number,
    categoryIndex: number
  ) {
    const currentQualifications = form.getValues("qualifications");
    const updatedQualifications = [...currentQualifications];
    updatedQualifications[qualificationIndex].categories =
      updatedQualifications[qualificationIndex].categories.filter(
        (_, i) => i !== categoryIndex
      );
    form.setValue("qualifications", updatedQualifications);
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Post a New Job</CardTitle>
          <CardDescription>
            Step {step} of {totalSteps}:{" "}
            {step === 1
              ? "Company Information"
              : step === 2
              ? "Job Details"
              : "Qualifications"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="space-y-6"
            >
              {step === 1 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="company_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your company name"
                            {...field}
                            disabled
                          />
                        </FormControl>
                        <FormDescription>
                          This is the name that will be displayed on your job
                          posting.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="company_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your company address"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Where is your company located?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Information</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Email or phone number"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          How can applicants reach you?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="job_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Software Developer"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          What position are you hiring for?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="industry_field"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry Field</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Technology, Healthcare"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          What industry is this job in?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what the job involves..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Tell applicants about the job and what they'll be
                          doing.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-2">
                    <FormLabel>Priority Categories</FormLabel>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Add a category"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="button" onClick={addCategory} size="sm">
                        <PlusCircle className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>
                    <FormDescription>
                      Add important categories for this job.
                    </FormDescription>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form
                        .watch("priority_categories")
                        .map((category, index) => (
                          <Badge
                            key={index}
                            className="flex items-center gap-1"
                          >
                            {category}
                            <button
                              type="button"
                              onClick={() => removeCategory(index)}
                              className="ml-1 text-xs rounded-full hover:bg-primary/20"
                            >
                              ✕
                            </button>
                          </Badge>
                        ))}
                    </div>
                    {form.formState.errors.priority_categories && (
                      <p className="text-sm font-medium text-destructive">
                        {form.formState.errors.priority_categories.message}
                      </p>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="salaryRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salary Range</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            if (value === "custom") {
                              form.setValue("customMinSalary", "");
                              form.setValue("customMaxSalary", "");
                            }
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a salary range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="30k-50k">
                              ₱30,000 - ₱50,000
                            </SelectItem>
                            <SelectItem value="50k-70k">
                              ₱50,000 - ₱70,000
                            </SelectItem>
                            <SelectItem value="70k-90k">
                              ₱70,000 - ₱90,000
                            </SelectItem>
                            <SelectItem value="90k-110k">
                              ₱90,000 - ₱110,000
                            </SelectItem>
                            <SelectItem value="110k-130k">
                              ₱110,000 - ₱130,000
                            </SelectItem>
                            <SelectItem value="130k-150k">
                              ₱130,000 - ₱150,000
                            </SelectItem>
                            <SelectItem value="150k+">₱150,000+</SelectItem>
                            <SelectItem value="custom">Custom Range</SelectItem>
                            <SelectItem value="competitive">
                              Competitive
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The salary range for this position in Philippine Peso
                          (₱).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("salaryRange") === "custom" && (
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="customMinSalary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Salary (₱)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g. 25000"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="customMaxSalary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Salary (₱)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g. 35000"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-lg">Qualifications</FormLabel>
                    <Button
                      type="button"
                      onClick={addQualification}
                      variant="outline"
                      size="sm"
                    >
                      <PlusCircle className="h-4 w-4 mr-1" /> Add Qualification
                    </Button>
                  </div>
                  <FormDescription>
                    What qualifications are needed for this job?
                  </FormDescription>

                  {form.watch("qualifications").map((_, qualificationIndex) => (
                    <Card key={qualificationIndex} className="p-4 relative">
                      {form.watch("qualifications").length > 1 && (
                        <Button
                          type="button"
                          onClick={() =>
                            removeQualification(qualificationIndex)
                          }
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2"
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                      )}

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name={`qualifications.${qualificationIndex}.requirement`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Requirement</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., 2 years of experience"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-2">
                          <FormLabel>Possible Credentials</FormLabel>
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="Add a credential"
                              value={newCredential}
                              onChange={(e) => setNewCredential(e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              onClick={() => addCredential(qualificationIndex)}
                              size="sm"
                            >
                              <PlusCircle className="h-4 w-4 mr-1" /> Add
                            </Button>
                          </div>
                          <FormDescription>
                            What credentials would satisfy this requirement?
                          </FormDescription>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {form
                              .watch(
                                `qualifications.${qualificationIndex}.possible_credentials`
                              )
                              .map((credential, credentialIndex) => (
                                <Badge
                                  key={credentialIndex}
                                  className="flex items-center gap-1"
                                >
                                  {credential}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeCredential(
                                        qualificationIndex,
                                        credentialIndex
                                      )
                                    }
                                    className="ml-1 text-xs rounded-full hover:bg-primary/20"
                                  >
                                    ✕
                                  </button>
                                </Badge>
                              ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <FormLabel>Categories</FormLabel>
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="Add a category"
                              value={newQualificationCategory}
                              onChange={(e) =>
                                setNewQualificationCategory(e.target.value)
                              }
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              onClick={() =>
                                addQualificationCategory(qualificationIndex)
                              }
                              size="sm"
                            >
                              <PlusCircle className="h-4 w-4 mr-1" /> Add
                            </Button>
                          </div>
                          <FormDescription>
                            What categories does this qualification belong to?
                          </FormDescription>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {form
                              .watch(
                                `qualifications.${qualificationIndex}.categories`
                              )
                              .map((category, categoryIndex) => (
                                <Badge
                                  key={categoryIndex}
                                  className="flex items-center gap-1"
                                >
                                  {category}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeQualificationCategory(
                                        qualificationIndex,
                                        categoryIndex
                                      )
                                    }
                                    className="ml-1 text-xs rounded-full hover:bg-primary/20"
                                  >
                                    ✕
                                  </button>
                                </Badge>
                              ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {form.formState.errors.qualifications && (
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.qualifications.message}
                    </p>
                  )}
                </div>
              )}

              <CardFooter className="flex justify-between px-0 pt-4">
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  disabled={step === 1}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                {step !== totalSteps && (
                  <Button type="button" onClick={nextStep}>
                    Next <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}

                {step === totalSteps && <Button type="submit">Post Job</Button>}
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
