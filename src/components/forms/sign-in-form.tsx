"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { AUTH_MESSAGES, mapAuthError } from "@/lib/auth/messages";
import { Alert, Button, Field, Input } from "@/components/ui";
import { signInSchema } from "@/lib/validation/identity";

export function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setError(null);
    const parsed = signInSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? AUTH_MESSAGES.generic);
      return;
    }

    setPending(true);
    const { error: authError } = await authClient.signIn.email({
      email: parsed.data.email,
      password: parsed.data.password,
      callbackURL: "/app",
    });
    setPending(false);

    if (authError) {
      setError(mapAuthError(authError));
      return;
    }

    router.push("/app");
    router.refresh();
  }

  return (
    <form action={onSubmit} className="space-y-4">
      {error ? <Alert>{error}</Alert> : null}
      <Field htmlFor="email" label="E-mail">
        <Input autoComplete="email" id="email" name="email" required type="email" />
      </Field>
      <Field htmlFor="password" label="Senha">
        <Input autoComplete="current-password" id="password" name="password" required type="password" />
      </Field>
      <Button className="w-full" pending={pending} type="submit">
        {pending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
