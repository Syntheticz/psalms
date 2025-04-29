import ApplicantLayout from "@/components/layouts/applicant-layout";
import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ApplicantLayout>{children}</ApplicantLayout>;
}
