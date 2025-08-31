import AccountMenu from "./AccountMenu";
import Logo from "./Logo";
import { ThemeSelector } from "./ThemeSelector";
import { cn } from "@/lib/utils";

interface NavbarProps {
  email?: string;
  className?: string;
}

export default function Navbar({ email, className }: NavbarProps) {
  return (
    <header
      className={cn(
        "flex gap-8 items-center justify-between w-full px-10 py-4 relative z-20",
        className
      )}
    >
      <Logo />
      <div>{email ? <AccountMenu email={email} /> : <ThemeSelector />}</div>
    </header>
  );
}
