"use client";

import { BlurFade } from "@/components/magicui/blur-fade";
import { ThemeSelector } from "@/components/ThemeSelector";
import { ShieldCheck } from "lucide-react";
import PassphraseForm from "@/components/PassphraseForm";
import DekPlayground from "@/components/DekPlayground";
import { DekProvider } from "@/components/DekProvider";

export default function PassphrasePage() {
  return (
    <div>
      <header className="flex gap-8 items-center justify-between w-full px-10 py-4">
        <div className="flex gap-2 items-center">
          <ShieldCheck className="size-5 text-primary" />
          <h1 className="text-lg font-bold">E2EE Notes</h1>
        </div>
        <ThemeSelector />
      </header>
      <main className="flex flex-col gap-8 items-center min-h-[calc(100vh-68px)] px-10 pt-[25vh]">
        <BlurFade direction="up">
          <div className="text-center space-y-2 max-w-md">
            <h2 className="heading-3">Create a strong passphrase</h2>
            <p className="text-muted-foreground">
              This passphrase will be used to encrypt your notes. If you forget
              it, you will not be able to access your notes.
            </p>
          </div>
        </BlurFade>

        <BlurFade
          direction="up"
          delay={0.2}
          className="w-full flex justify-center"
        >
          <PassphraseForm />
        </BlurFade>
        <DekProvider>
          <DekPlayground />
        </DekProvider>
      </main>
    </div>
  );
}
