import { CompanyForm } from "@/components/company-form";

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Company Profile Setup
      </h1>
      <CompanyForm />
    </main>
  );
}
