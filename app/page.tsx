"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLE } from "@prisma/client";
import {
  ArrowRight,
  Briefcase,
  CheckCircle,
  LogOut,
  User,
  Users,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const session = useSession();
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">JobMatcher</span>
          </div>
          {session.data === null && (
            <div className="flex items-center space-x-4">
              <Link href={"/auth/login"}>
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href={"/auth/signup?role=APPLICANT"}>
                <Button>Sign up</Button>
              </Link>
            </div>
          )}
          {session.data && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" className="relative rounded-full">
                  <Avatar>
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="User"
                    />
                    <AvatarFallback>
                      {session.data.user.name[0].toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/applicant/profile" className="flex w-full">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem>
                    <Link href="/applicant/settings" className="flex w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    signOut();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Find Your Perfect Career Match
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Using advanced fuzzy logic algorithms to connect candidates with
            their ideal positions based on skills, experience, and preferences.
          </p>
          {session.data === null && (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/auth/signup?role=APPLICANT">
                <Button size="lg" className="w-full sm:w-auto">
                  I'm looking for a job
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/signup?role=EMPLOYER">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  I'm hiring
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
          {session.data && (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => {
                  const role = session.data?.user.role as ROLE;
                  if (role === "APPLICANT") {
                    router.push("/applicant/dashboard");
                  } else {
                    router.push("/employer/dashbard");
                  }
                }}
              >
                Go to dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">For Job Seekers</h3>
              <p className="text-muted-foreground mb-4">
                Create your profile, upload your resume, and let our AI match
                you with the perfect job opportunities.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Personalized job recommendations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Match score for each position</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Track application status</span>
                </li>
              </ul>
            </div>

            <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">For Employers</h3>
              <p className="text-muted-foreground mb-4">
                Post jobs and let our system find the most qualified candidates
                using advanced matching algorithms.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>AI-powered candidate screening</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Ranked candidate shortlists</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Detailed match analysis</span>
                </li>
              </ul>
            </div>

            <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                  <path d="M7 7h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Fuzzy Logic Matching
              </h3>
              <p className="text-muted-foreground mb-4">
                Our proprietary algorithm uses fuzzy logic to evaluate the
                semantic similarity between qualifications and requirements.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Beyond keyword matching</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Contextual understanding</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Weighted criteria evaluation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Join thousands of job seekers and employers already using JobMatcher
            to connect talent with opportunity.
          </p>
          {session.data === null && (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/auth/signup?role=APPLICANT">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  Create an Account
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white w-full sm:w-auto"
                >
                  Log In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card text-muted-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Briefcase className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-white">JobMatcher</span>
              </div>
              <p className="text-sm text-gray-400">
                Connecting talent with opportunity through advanced matching
                algorithms.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">
                For Job Seekers
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Browse Jobs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Career Resources
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Resume Tips
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">
                For Employers
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Post a Job
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Talent Solutions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center text-gray-400">
            &copy; {new Date().getFullYear()} JobMatcher. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
