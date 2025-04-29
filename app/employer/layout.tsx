import EmployerLayout from "@/components/layouts/employer-layout";
import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <EmployerLayout>{children}</EmployerLayout>;
}
