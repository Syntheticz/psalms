"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Briefcase, User, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { ROLE } from "@prisma/client";
import { toast } from "sonner";
import { createUser } from "@/lib/queries/user";
import { signIn } from "next-auth/react";
// Define the signup form schema
const SignupFormSchema = z.object({
  name: z.string().min(2, { message: "Please enter your full name" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["APPLICANT", "EMPLOYER"]),
  companyName: z.string().optional(),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type SignupFormValues = z.infer<typeof SignupFormSchema>;

export default function SignupPage() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Start with a default role
  const [initialRole, setInitialRole] = useState<"APPLICANT" | "EMPLOYER">(
    roleParam as ROLE
  );

  // Update the role based on URL params after component mounts
  useEffect(() => {
    if (
      roleParam === "" ||
      (roleParam !== "APPLICANT" && roleParam !== "EMPLOYER") ||
      !roleParam
    ) {
      router.push("/");
    }
    if (roleParam === "EMPLOYER" || roleParam === "APPLICANT") {
      setInitialRole(roleParam);
      form.setValue("role", roleParam);
    }
  }, []);
  // Initialize react-hook-form with zod resolver
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: roleParam as ROLE, // Use a fixed default value here
      terms: false,
    },
  });

  // Watch the role field to update the UI
  const role = form.watch("role");

  // Handle form submission
  const onSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await createUser(data);
      //   console.log(data);

      toast.success("Account creation successful!", { duration: 3000 });
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      // The server action will handle redirection on success
      setIsSubmitting(false);
      if (data.role === "APPLICANT") {
        router.push("/applicant/dashboard");
      } else {
        router.push("/employer/dashboard");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again."
      );

      console.log(err);

      toast.error(
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-6 sm:p-6 md:p-8">
      <Link
        href="/"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-1 md:mr-2 h-4 w-4" />
        <span className="hidden sm:inline">Back to home</span>
        <span className="sm:hidden">Back</span>
      </Link>

      <div className="flex items-center mb-6 md:mb-8">
        <Briefcase className="h-5 w-5 md:h-6 md:w-6 text-primary mr-2" />
        <span className="text-xl md:text-2xl font-bold">JobMatcher</span>
      </div>

      <Card className="w-full max-w-sm md:max-w-md bg-card text-card-foreground">
        <CardHeader className="space-y-1 p-4 sm:p-6">
          <CardTitle className="text-xl md:text-2xl font-bold text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center text-sm">
            Choose your account type and enter your details
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="m-0">
            <CardContent className="space-y-4 p-4 sm:p-6">
              {error && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

              <Tabs
                defaultValue={initialRole as string}
                onValueChange={(value) =>
                  form.setValue("role", value as "APPLICANT" | "EMPLOYER")
                }
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="APPLICANT"
                    className="flex items-center justify-center text-xs sm:text-sm"
                    onClick={() => {
                      form.reset();
                      form.setValue("role", "APPLICANT");
                      router.push("/auth/signup?role=APPLICANT");
                    }}
                  >
                    <User className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Job Seeker</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="EMPLOYER"
                    className="flex items-center justify-center text-xs sm:text-sm"
                    onClick={() => {
                      form.reset();
                      form.setValue("role", "EMPLOYER");
                      router.push("/auth/signup?role=EMPLOYER");
                    }}
                  >
                    <Building className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Employer</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="APPLICANT"
                  className="space-y-3 sm:space-y-4 pt-3 sm:pt-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-1 sm:space-y-2">
                        <FormLabel className="text-sm">Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="text-sm md:text-base" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1 sm:space-y-2">
                        <FormLabel className="text-sm">Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="name@example.com"
                            className="text-sm md:text-base"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-1 sm:space-y-2">
                        <FormLabel className="text-sm">Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            className="text-sm md:text-base"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent
                  value="EMPLOYER"
                  className="space-y-3 sm:space-y-4 pt-3 sm:pt-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-1 sm:space-y-2">
                        <FormLabel className="text-sm">Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="text-sm md:text-base" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1 sm:space-y-2">
                        <FormLabel className="text-sm">Work Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="name@company.com"
                            className="text-sm md:text-base"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-1 sm:space-y-2">
                        <FormLabel className="text-sm">Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            className="text-sm md:text-base"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-2 space-y-0 pt-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1 sm:mt-0"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-xs sm:text-sm font-medium leading-tight sm:leading-none">
                        I agree to the{" "}
                        <a href="#" className="text-primary hover:underline">
                          terms of service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-primary hover:underline">
                          privacy policy
                        </a>
                      </FormLabel>
                      <FormMessage className="text-xs" />
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 p-4 sm:p-6">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Create account"}
              </Button>
              <div className="text-center text-xs sm:text-sm">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary hover:underline"
                >
                  Log in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
