"use client";

import { ThemeSelector } from "@/components/ThemeSelector";
import { ShieldCheck, LoaderCircle } from "lucide-react";
import AuthForm from "@/components/AuthForm";
import { BlurFade } from "@/components/magicui/blur-fade";
import { useEffect, useState } from "react";
import { getCurrentSession } from "@/lib/appwrite/client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleGetCurrentSession = async () => {
      try {
        const session = await getCurrentSession();
        if (session) {
          router.replace("/notes");
        }
      } catch (error) {
        console.error("Session check error:", error);
        // User is not authenticated, stay on homepage
      } finally {
        setIsLoading(false);
      }
    };
    handleGetCurrentSession();
  }, [router]);

  // Show loading state while checking session
  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <LoaderCircle className="size-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <header className="flex gap-8 items-center justify-between w-full px-10 py-4">
        <div className="flex gap-2 items-center">
          <ShieldCheck className="size-5 text-primary" />
          <h1 className="text-lg font-bold">E2EE Notes</h1>
        </div>
        <ThemeSelector />
      </header>
      <main className="flex flex-col gap-8 items-center min-h-[calc(100vh-68px)] px-10 pt-[25vh]">
        <BlurFade direction="up">
          <div className="text-center space-y-2 max-w-md">
            <h2 className="heading-3">Privacy for your ideas.</h2>
            <p className="text-muted-foreground">
              Take notes secured with end-to-end encryption. That means no one
              else can read them (not even us).
            </p>
          </div>
        </BlurFade>

        <BlurFade
          direction="up"
          delay={0.2}
          className="w-full flex justify-center"
        >
          <AuthForm />
        </BlurFade>
      </main>
    </div>
  );
}
