"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { AUTH_MESSAGES, mapAuthError } from "@/lib/auth/messages";
import { Alert, Button, Field, Input } from "@/components/ui";
import { emailSchema } from "@/lib/validation/identity";

export function ResendVerificationButton() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);
    const parsed = emailSchema.safeParse(formData.get("email"));

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? AUTH_MESSAGES.generic);
      return;
    }

    setPending(true);
    const { error: authError } = await authClient.sendVerificationEmail({
      email: parsed.data,
      callbackURL: "/verificar-email",
    });
    setPending(false);

    if (authError) {
      setError(mapAuthError(authError));
      return;
    }

    setSuccess(true);
  }

  return (
    <form action={onSubmit} className="space-y-3">
      {error ? <Alert>{error}</Alert> : null}
      {success ? <Alert tone="success">{AUTH_MESSAGES.verificationSent}</Alert> : null}
      <Field htmlFor="email" label="E-mail">
        <Input autoComplete="email" id="email" name="email" required type="email" />
      </Field>
      <Button disabled={pending} type="submit" variant="secondary">
        {pending ? "Reenviando..." : "Reenviar e-mail de verificação"}
      </Button>
    </form>
  );
}
