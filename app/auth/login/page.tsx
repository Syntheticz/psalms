"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Briefcase, ArrowLeft } from "lucide-react";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { fetchUserRoleByEmail } from "@/lib/queries/user";

// Define the login form schema
export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type LoginFormValues = z.infer<typeof LoginFormSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize react-hook-form with zod resolver
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res.error) {
        toast.error("Wrong email or password!");
        return;
      }

      toast.success("Logged in successfully!");
      const role = await fetchUserRoleByEmail(data.email);
      if (role === "EMPLOYER") {
        router.push("/employer/dashboard");
      } else {
        router.push("/applicant/dashboard");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8">
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

      <Card className="w-full max-w-sm md:max-w-md bg-card text-card-foreground p-0">
        <CardHeader className="space-y-1 p-4 sm:p-6">
          <CardTitle className="text-xl md:text-2xl font-bold text-center">
            Log in to your account
          </CardTitle>
          <CardDescription className="text-center text-sm">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 p-4 sm:p-6 ">
              {error && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
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
                  <FormItem className="space-y-2">
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm">Password</FormLabel>
                      {/* <Link
                        href="/auth/forgot-password"
                        className="text-xs md:text-sm text-primary hover:underline"
                      >
                        Forgot password?
                      </Link> */}
                    </div>
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
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 p-4 sm:p-6">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Log in"}
              </Button>
              <div className="text-center text-xs md:text-sm">
                Don't have an account?{" "}
                <Link
                  href="/auth/signup?role=APPLICANT"
                  className="text-primary hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
