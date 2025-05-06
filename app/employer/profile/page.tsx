"use client";
import EmployerProfileClient from "@/components/employer/profile";
import { fetchUserCompany } from "@/lib/queries/user";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";

export default function EmployerProfilePage() {
  const { data: company, isLoading } = useQuery({
    queryKey: ["company"],
    queryFn: async () => fetchUserCompany(),
  });

  if (!isLoading && !company) {
    notFound();
  }

  return company && <EmployerProfileClient initialData={company} />;
}
