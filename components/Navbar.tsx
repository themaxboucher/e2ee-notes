import AccountMenu from "./AccountMenu";
import Logo from "./Logo";
import { ThemeSelector } from "./ThemeSelector";

export default function Navbar({ email }: { email?: string }) {
  return (
    <div>
      <header className="flex gap-8 items-center justify-between w-full px-10 py-4">
        <Logo />
        <div>{email ? <AccountMenu email={email} /> : <ThemeSelector />}</div>
      </header>
    </div>
  );
}
