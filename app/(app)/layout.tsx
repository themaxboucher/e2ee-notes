"use client";

import { DekProvider } from "@/components/DekProvider";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import { getUser } from "@/lib/appwrite/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getUser();
        if (!fetchedUser) {
          router.replace("/");
        } else {
          setEmail(fetchedUser.email);
        }
      } catch (error) {
        console.error("Session check error:", error);
        router.replace("/");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <DekProvider>
      <div>
        <Navbar email={email ? email : undefined} className="border-b" />
        {children}
      </div>
    </DekProvider>
  );
}
