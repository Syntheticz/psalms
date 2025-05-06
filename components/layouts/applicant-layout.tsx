"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Input } from "@/components/ui/input";
import {
  Bell,
  Briefcase,
  FileText,
  Home,
  LogOut,
  Menu,
  // MessageSquare,
  // Search,
  Settings,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function ApplicantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/applicant/dashboard", icon: Home },
    { name: "Job Search", href: "/applicant/jobs", icon: Briefcase },
    { name: "Applications", href: "/applicant/applications", icon: FileText },
    // { name: "Messages", href: "/applicant/messages", icon: MessageSquare }, // hide message tab
    { name: "Profile", href: "/applicant/profile", icon: User },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-background border-r">
        <div className="flex items-center h-16 px-4 border-b">
          <Link
            href="/applicant/dashboard"
            className="flex items-center space-x-2"
          >
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">JobMatcher</span>
          </Link>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? "text-primary-foreground" : "text-gray-500"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              signOut();
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex items-center h-16 px-4 border-b">
            <Link
              href="/applicant/dashboard"
              className="flex items-center space-x-2"
            >
              <Briefcase className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">JobMatcher</span>
            </Link>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        isActive ? "text-primary-foreground" : "text-gray-500"
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                signOut();
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1 ">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 flex-shrink-0 h-16 bg-background border-b flex">
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(true)}
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
              </Sheet>
              {/* <div className="max-w-lg w-full lg:max-w-xs ml-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search for jobs..."
                    className="pl-10"
                  />
                </div>
              </div> */}
            </div>
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="ghost" className="relative rounded-full">
                    <Avatar>
                      <AvatarImage
                        src="/placeholder.svg?height=32&width=32"
                        alt="User"
                      />
                      <AvatarFallback>JD</AvatarFallback>
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
                  <DropdownMenuItem>
                    <Link href="/applicant/settings" className="flex w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="bg-background">{children}</main>
      </div>
    </div>
  );
}
