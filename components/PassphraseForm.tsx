"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Form } from "./ui/form";
import FormAlert from "./FormAlert";
import { Button } from "./ui/button";
import { PasswordField } from "./form-fields/PasswordField";
import {
  createDek,
  deriveKek,
  generateKdfSaltB64,
  unwrapDekWithKek,
  wrapDekWithKek,
} from "@/lib/crypto";
import { updateUser } from "@/lib/appwrite/client";
import { useRouter } from "next/navigation";
import { useDek } from "./DekProvider";

const formSchema = z.object({
  passphrase: z
    .string()
    .min(8, { message: "Passphrase must be at least 8 characters" }),
});

export default function PassphraseForm({
  userPrefs,
}: {
  userPrefs?: UserPrefs;
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { set } = useDek();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      passphrase: "",
    },
  });

  async function onSubmitHandler(data: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      // User already has a passphrase
      if (userPrefs) {
        // Derive the KEK from the passphrase
        const kek = await deriveKek(
          data.passphrase,
          userPrefs.kdfSalt,
          userPrefs.kdfIterations
        );

        // Decrypt the wrappped DEK
        const dek = await unwrapDekWithKek(
          userPrefs.wrappedDek,
          userPrefs.iv,
          kek
        );

        // Save the DEK to the DekProvider
        set(dek);
      }

      // User doesn't have a passphrase
      if (!userPrefs) {
        const kdfSalt = generateKdfSaltB64();
        const kdfIterations = 200000;

        // Derive the KEK from the passphrase
        const kek = await deriveKek(data.passphrase, kdfSalt, kdfIterations);

        // Create the DEK
        const dek = await createDek();

        // Wrap the DEK with the KEK
        const wrappedDek = await wrapDekWithKek(dek, kek);

        // Update the user with the wrapped DEK
        await updateUser({
          wrappedDek: wrappedDek.wrappedDekB64,
          iv: wrappedDek.ivB64,
          kdfSalt: kdfSalt,
          kdfIterations: kdfIterations,
        });

        // Save the DEK to the DekProvider
        set(dek);
      }

      // Redirect to the notes page
      router.push("/notes");
    } catch (error) {
      setError("Incorrect passphrase. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form
        className="grid gap-4 w-full max-w-xs"
        onSubmit={form.handleSubmit(onSubmitHandler)}
      >
        <PasswordField
          form={form}
          name="passphrase"
          placeholder="Enter your passphrase"
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
          {!loading && userPrefs ? "Go to notes" : "Create passphrase"}
        </Button>
        {error && <FormAlert message={error} type="error" />}
      </form>
    </Form>
  );
}
