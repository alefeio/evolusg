"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { AUTH_MESSAGES, mapAuthError } from "@/lib/auth/messages";
import { Alert, Button, Field, Input } from "@/components/ui";
import { requestPasswordResetSchema } from "@/lib/validation/identity";

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setError(null);
    const parsed = requestPasswordResetSchema.safeParse({
      email: formData.get("email"),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? AUTH_MESSAGES.generic);
      return;
    }

    setPending(true);
    const { error: authError } = await authClient.requestPasswordReset({
      email: parsed.data.email,
      redirectTo: "/redefinir-senha",
    });
    setPending(false);

    if (authError) {
      setError(mapAuthError(authError));
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return <Alert tone="success">{AUTH_MESSAGES.resetRequested}</Alert>;
  }

  return (
    <form action={onSubmit} className="space-y-4">
      {error ? <Alert>{error}</Alert> : null}
      <Field htmlFor="email" label="E-mail">
        <Input autoComplete="email" id="email" name="email" required type="email" />
      </Field>
      <Button className="w-full" disabled={pending} type="submit">
        {pending ? "Enviando..." : "Enviar instruções"}
      </Button>
    </form>
  );
}
