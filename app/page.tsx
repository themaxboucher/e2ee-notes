"use client";

import AuthForm from "@/components/AuthForm";
import { BlurFade } from "@/components/magicui/blur-fade";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/appwrite/client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import { CryptoBackground } from "@/components/ui/crypto-background";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const fetchedUser = await getUser();
        if (fetchedUser) {
          router.replace("/notes");
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthentication();
  }, [router]);

  // Show loading state while checking session
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <Navbar />
      <CryptoBackground />
      <main className="flex flex-col gap-8 items-center min-h-[calc(100vh-68px)] px-10 pt-[15vh] sm:pt-[22vh] relative z-10 pointer-events-none">
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
