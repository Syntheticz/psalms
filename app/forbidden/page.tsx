import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function Forbidden() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-amber-100 p-3 rounded-full">
            <ShieldAlert className="h-12 w-12 text-amber-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold">Access Forbidden</h1>

        <p className="text-muted-foreground">
          You don't have permission to access this resource.
        </p>

        <div className="pt-4">
          <Button asChild variant="outline">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
