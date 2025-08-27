"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Form } from "./ui/form";
import FormAlert from "./FormAlert";
import { Button } from "./ui/button";
import { TextField } from "./form-fields/TextField";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
});

export default function AuthForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmitHandler(data: z.infer<typeof formSchema>) {
    console.log(data);
    setSuccess(true);
  }
  return (
    <Form {...form}>
      <form
        className="grid gap-4 w-full max-w-xs"
        onSubmit={form.handleSubmit(onSubmitHandler)}
      >
        <TextField form={form} name="email" placeholder="Enter your email" />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
          {!loading && "Get Started"}
        </Button>
        {error && <FormAlert message={error} type="error" />}
        {success && (
          <FormAlert
            message="Check your email for a login link."
            type="success"
          />
        )}
      </form>
    </Form>
  );
}
