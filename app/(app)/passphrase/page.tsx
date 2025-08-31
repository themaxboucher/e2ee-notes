"use client";

import { BlurFade } from "@/components/magicui/blur-fade";
import PassphraseForm from "@/components/PassphraseForm";
import { getUser } from "@/lib/appwrite/client";
import { useEffect, useState } from "react";

export default function PassphrasePage() {
  const [userPrefs, setUserPrefs] = useState<UserPrefs | undefined>(undefined);

  useEffect(() => {
    async function fetchUserPrefs() {
      const fetchedUserPrefs = await getUser();
      if (
        fetchedUserPrefs.wrappedDek &&
        fetchedUserPrefs.iv &&
        fetchedUserPrefs.kdfSalt &&
        fetchedUserPrefs.kdfIterations
      )
        setUserPrefs(fetchedUserPrefs as unknown as UserPrefs);
    }
    fetchUserPrefs();
  }, []);

  return (
    <main className="flex flex-col gap-8 items-center min-h-[calc(100vh-68px)] px-10 pt-[25vh]">
      <BlurFade direction="up">
        <div className="text-center space-y-2 max-w-md">
          <h2 className="heading-3">
            {userPrefs ? "Enter your passphrase" : "Create a strong passphrase"}
          </h2>
          <p className="text-muted-foreground">
            {userPrefs
              ? "Enter your passphrase to decrypt your notes."
              : "This passphrase will be used to decrypt your notes. If you forget it, you will not be able to access your notes."}
          </p>
        </div>
      </BlurFade>

      <BlurFade
        direction="up"
        delay={0.2}
        className="w-full flex justify-center"
      >
        <PassphraseForm userPrefs={userPrefs} />
      </BlurFade>
    </main>
  );
}
