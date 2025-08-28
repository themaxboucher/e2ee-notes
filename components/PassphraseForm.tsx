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

const formSchema = z.object({
  passphrase: z
    .string()
    .min(8, { message: "Passphrase must be at least 8 characters" }),
});

export default function AuthForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      passphrase: "",
    },
  });

  async function onSubmitHandler(data: z.infer<typeof formSchema>) {
    console.log(data);
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
          {!loading && "Create passphrase"}
        </Button>
        {error && <FormAlert message={error} type="error" />}
      </form>
    </Form>
  );
}
