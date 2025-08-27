"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { loginWithMagicLink } from "@/lib/appwrite/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Separate component that uses useSearchParams() - must be wrapped in Suspense
// This is required in Next.js 15 to handle client-side rendering bailout properly
function VerifyContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams(); // This hook requires Suspense boundary
  const router = useRouter();

  useEffect(() => {
    const handleVerification = async () => {
      try {
        const userId = searchParams.get("userId");
        const secret = searchParams.get("secret");

        if (!userId || !secret) {
          setStatus("error");
          setError("Invalid login link. Please request a new one.");
          return;
        }

        await loginWithMagicLink(userId, secret);
        setStatus("success");
        router.refresh();
        router.push("/notes");
      } catch (err) {
        setStatus("error");
        setError("An unknown error occurred. Please try again.");
      }
    };

    handleVerification();
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {(status === "loading" || status === "success") && (
        <LoaderCircle className="size-8 animate-spin text-primary" />
      )}

      {status === "error" && (
        <div className="max-w-md w-full flex flex-col items-center justify-center gap-4">
          <p className="text-sm text-destructive bg-destructive/10 p-4 rounded-md">
            {error ?? "An unknown error occurred."}
          </p>
          {error && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="size-4" /> Back to login
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Main component that wraps VerifyContent in Suspense boundary
// This is required in Next.js 15 when using useSearchParams() to prevent build errors
export default function VerifyPage() {
  return (
    <main className="w-full min-h-screen flex justify-center items-center px-6 py-20">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center gap-4">
            <LoaderCircle className="size-8 animate-spin text-primary" />
          </div>
        }
      >
        <VerifyContent />
      </Suspense>
    </main>
  );
}
