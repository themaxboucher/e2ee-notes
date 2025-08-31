"use client";

import { DekProvider } from "@/components/DekProvider";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import { getCurrentSession } from "@/lib/appwrite/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleGetCurrentSession = async () => {
      try {
        const session = await getCurrentSession();
        if (!session) {
          router.replace("/");
        }
      } catch (error) {
        console.error("Session check error:", error);
        router.replace("/");
      } finally {
        setIsLoading(false);
      }
    };
    handleGetCurrentSession();
  }, [router]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <DekProvider>
      <div>
        <Navbar />
        {children}
      </div>
    </DekProvider>
  );
}
