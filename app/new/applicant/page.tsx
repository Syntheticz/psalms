"use client";

import { useState } from "react";
import { WelcomeScreen } from "@/components/welcome-screen";
import { UserProfileForm } from "@/components/user-profile-form";

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      {!showForm ? (
        <WelcomeScreen onContinue={() => setShowForm(true)} />
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-8 text-center">User Profile</h1>
          <UserProfileForm />
        </>
      )}
    </main>
  );
}
