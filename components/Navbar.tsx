import AccountMenu from "./AccountMenu";
import { ShieldCheck } from "lucide-react";
import { ThemeSelector } from "./ThemeSelector";

export default function Navbar({ email }: { email?: string }) {
  return (
    <div>
      <header className="flex gap-8 items-center justify-between w-full px-10 py-4">
        <div className="flex gap-2 items-center">
          <ShieldCheck className="size-5 text-primary" />
          <h1 className="text-lg font-bold">E2EE Notes</h1>
        </div>
        <div>{email ? <AccountMenu email={email} /> : <ThemeSelector />}</div>
      </header>
    </div>
  );
}
