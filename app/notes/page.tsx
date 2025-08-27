"use client";

import { Button } from "@/components/ui/button";
import { getCurrentSession, logout } from "@/lib/appwrite/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotesPage() {
  const [user, setUser] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    const handleGetCurrentUser = async () => {
      const user = await getCurrentSession();
      setUser(user.userId);
    };
    handleGetCurrentUser();
  }, []);

  if (!user) {
    router.push("/");
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4">
      <p>NotesPage</p>
      <Button variant="outline" size="sm" onClick={handleLogout}>
        <LogOut className="size-4" />
        Logout
      </Button>
    </div>
  );
}
