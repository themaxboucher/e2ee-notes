import { ThemeSelector } from "@/components/ThemeSelector";
import { Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <Shield className="size-10 text-blue-500" />
      <h1 className="heading-1">E2EE Notes</h1>
      <ThemeSelector />
    </div>
  );
}
