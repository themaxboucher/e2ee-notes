import { LoaderCircle } from "lucide-react";

export default function Loading({ message }: { message?: string }) {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4">
      <LoaderCircle className="size-8 animate-spin text-primary" />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}
