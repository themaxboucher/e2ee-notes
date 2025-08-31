import { ShieldCheck } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2 hover:cursor-default">
      <div className="flex items-center justify-center bg-blue-500/10 rounded-lg p-1.5">
        <ShieldCheck className="size-4 text-primary" />
      </div>
      <h1 className="text-lg font-bold tracking-tight">E2EE Notes</h1>
    </div>
  );
}
