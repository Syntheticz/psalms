// app/auth/signup/page.tsx (server component)
import SignupPage from "@/components/auth/signup";
import { Suspense } from "react";

export default function SignupPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupPage />
    </Suspense>
  );
}
