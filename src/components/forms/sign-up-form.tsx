"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { AUTH_MESSAGES, mapAuthError } from "@/lib/auth/messages";
import { Alert, Button, Field, Input } from "@/components/ui";
import { signUpSchema } from "@/lib/validation/identity";

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setError(null);
    const parsed = signUpSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? AUTH_MESSAGES.generic);
      return;
    }

    setPending(true);
    const { error: authError } = await authClient.signUp.email({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
      callbackURL: "/verificar-email",
    });
    setPending(false);

    if (authError) {
      setError(mapAuthError(authError));
      return;
    }

    router.push("/verificar-email?enviado=1");
  }

  return (
    <form action={onSubmit} className="space-y-4">
      {error ? <Alert>{error}</Alert> : null}
      <Field htmlFor="name" label="Nome">
        <Input autoComplete="name" id="name" name="name" required />
      </Field>
      <Field htmlFor="email" label="E-mail">
        <Input autoComplete="email" id="email" name="email" required type="email" />
      </Field>
      <Field htmlFor="password" label="Senha">
        <Input autoComplete="new-password" id="password" minLength={8} name="password" required type="password" />
      </Field>
      <Field htmlFor="confirmPassword" label="Confirmar senha">
        <Input
          autoComplete="new-password"
          id="confirmPassword"
          minLength={8}
          name="confirmPassword"
          required
          type="password"
        />
      </Field>
      <Button className="w-full" disabled={pending} type="submit">
        {pending ? "Criando conta..." : "Criar conta"}
      </Button>
    </form>
  );
}
