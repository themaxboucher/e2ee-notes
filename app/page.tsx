import { ThemeSelector } from "@/components/ThemeSelector";
import { ShieldCheck } from "lucide-react";
import AuthForm from "@/components/AuthForm";
import { BlurFade } from "@/components/magicui/blur-fade";

export default function Home() {
  return (
    <div>
      <header className="flex gap-8 items-center justify-between w-full px-10 py-4">
        <div className="flex gap-2 items-center">
          <ShieldCheck className="size-5 text-primary" />
          <h1 className="text-lg font-bold">E2EE Notes</h1>
        </div>
        <ThemeSelector />
      </header>
      <main className="flex flex-col gap-8 items-center min-h-screen px-10 pt-[25vh]">
        <BlurFade direction="up">
          <div className="text-center space-y-2 max-w-md">
            <h2 className="heading-3">Privacy for your ideas.</h2>
            <p className="text-muted-foreground">
              Take notes secured with end-to-end encryption. That means no one
              else can read them, not even us.
            </p>
          </div>
        </BlurFade>

        <BlurFade
          direction="up"
          delay={0.2}
          className="w-full flex justify-center"
        >
          <AuthForm />
        </BlurFade>
      </main>
    </div>
  );
}
