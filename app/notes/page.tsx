"use client";

import { Button } from "@/components/ui/button";
import { getCurrentSession, logout } from "@/lib/appwrite/client";
import { LogOut, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotesPage() {
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    setUser(null);
    router.push("/");
  };

  useEffect(() => {
    const handleGetCurrentUser = async () => {
      try {
        const session = await getCurrentSession();
        setUser(session.userId);
      } catch (error) {
        // Only redirect if we're sure there's no valid session
        router.replace("/");
      } finally {
        setIsLoading(false);
      }
    };

    handleGetCurrentUser();
  }, [router]);

  // Show loading state while checking session
  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4">
        <LoaderCircle className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Only show content if user is authenticated
  if (!user) {
    return null; // This will trigger the redirect in useEffect
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4">
      <p>{user}</p>
      <Button variant="outline" size="sm" onClick={handleLogout}>
        <LogOut className="size-4" />
        Logout
      </Button>
    </div>
  );
}
