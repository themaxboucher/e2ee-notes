import { ThemeSelector } from "./ThemeSelector";
import { ShieldCheck } from "lucide-react";

export default function Navbar() {
  return (
    <div>
      <header className="flex gap-8 items-center justify-between w-full px-10 py-4">
        <div className="flex gap-2 items-center">
          <ShieldCheck className="size-5 text-primary" />
          <h1 className="text-lg font-bold">E2EE Notes</h1>
        </div>
        <ThemeSelector />
      </header>
    </div>
  );
}
