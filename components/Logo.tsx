import { BookLock } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <BookLock className="size-5 text-primary" />
      <h1 className="text-lg font-bold">E2EE Notes</h1>
    </div>
  );
}
