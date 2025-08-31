"use client";

import AuthForm from "@/components/AuthForm";
import { BlurFade } from "@/components/magicui/blur-fade";
import { useEffect, useState } from "react";
import { getCurrentSession } from "@/lib/appwrite/client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";

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
      <div className="mt-[68px]">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="flex flex-col gap-8 items-center min-h-[calc(100vh-68px)] px-10 pt-[25vh]">
        <BlurFade direction="up">
          <div className="text-center space-y-3 max-w-[30rem]">
            <h2 className="heading-2">
              Take private notes with end-to-end encryption*
            </h2>
            <p className="text-muted-foreground">
              *That means no one else can read them (not even us).
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
