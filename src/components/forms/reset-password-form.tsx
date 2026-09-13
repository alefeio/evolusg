"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { AUTH_MESSAGES, mapAuthError } from "@/lib/auth/messages";
import { Alert, Button, Field, Input } from "@/components/ui";
import { resetPasswordSchema } from "@/lib/validation/identity";

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setError(null);
    const parsed = resetPasswordSchema.safeParse({
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? AUTH_MESSAGES.generic);
      return;
    }

    setPending(true);
    const { error: authError } = await authClient.resetPassword({
      newPassword: parsed.data.password,
      token,
    });
    setPending(false);

    if (authError) {
      setError(mapAuthError(authError));
      return;
    }

    router.push(`/entrar?redefinida=1`);
  }

  return (
    <form action={onSubmit} className="space-y-4">
      {error ? <Alert>{error}</Alert> : null}
      <Field htmlFor="password" label="Nova senha">
        <Input autoComplete="new-password" id="password" minLength={8} name="password" required type="password" />
      </Field>
      <Field htmlFor="confirmPassword" label="Confirmar nova senha">
        <Input
          autoComplete="new-password"
          id="confirmPassword"
          minLength={8}
          name="confirmPassword"
          required
          type="password"
        />
      </Field>
      <Button className="w-full" pending={pending} type="submit">
        {pending ? "Salvando..." : "Redefinir senha"}
      </Button>
    </form>
  );
}
