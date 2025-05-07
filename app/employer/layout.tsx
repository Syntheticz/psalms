import EmployerLayout from "@/components/layouts/employer-layout";
import ReactQueryProvider from "@/lib/providers/react-query-provider";
import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <EmployerLayout>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </EmployerLayout>
  );
}
