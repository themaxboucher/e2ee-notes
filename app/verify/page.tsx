"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { loginWithMagicLink } from "@/lib/appwrite/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Loading from "@/components/Loading";

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

        // Add a small delay to ensure the session is properly established
        // This prevents flashing of the homepage during redirect
        setTimeout(() => {
          router.push("/notes");
        }, 300);
      } catch (err) {
        setStatus("error");
        setError("An unknown error occurred. Please try again.");
      }
    };

    handleVerification();
  }, [searchParams, router]);

  return (
    <>
      {status === "loading" && <Loading message="Verifying your login..." />}

      {status === "success" && (
        <Loading message="Login successful! Redirecting..." />
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
    </>
  );
}

// Main component that wraps VerifyContent in Suspense boundary
// This is required in Next.js 15 when using useSearchParams() to prevent build errors
export default function VerifyPage() {
  return (
    <Suspense fallback={<Loading />}>
      <VerifyContent />
    </Suspense>
  );
}
