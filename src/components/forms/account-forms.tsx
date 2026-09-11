"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { AUTH_MESSAGES, mapAuthError } from "@/lib/auth/messages";
import { Alert, Button, Field, Input } from "@/components/ui";
import { changePasswordSchema, emailSchema, nameSchema } from "@/lib/validation/identity";

export function UpdateNameForm({ currentName }: { currentName: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);
    const parsed = nameSchema.safeParse(formData.get("name"));

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? AUTH_MESSAGES.generic);
      return;
    }

    setPending(true);
    const { error: authError } = await authClient.updateUser({ name: parsed.data });
    setPending(false);

    if (authError) {
      setError(mapAuthError(authError));
      return;
    }

    setSuccess(true);
    router.refresh();
  }

  return (
    <form action={onSubmit} className="space-y-4">
      {error ? <Alert>{error}</Alert> : null}
      {success ? <Alert tone="success">{AUTH_MESSAGES.nameChanged}</Alert> : null}
      <Field htmlFor="name" label="Nome">
        <Input autoComplete="name" defaultValue={currentName} id="name" name="name" required />
      </Field>
      <Button disabled={pending} type="submit">
        {pending ? "Salvando..." : "Salvar nome"}
      </Button>
    </form>
  );
}

export function UpdateEmailForm({ currentEmail }: { currentEmail: string }) {
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

    if (parsed.data === currentEmail) {
      setError("Informe um e-mail diferente do atual.");
      return;
    }

    setPending(true);
    const { error: authError } = await authClient.changeEmail({
      newEmail: parsed.data,
      callbackURL: "/app/conta",
    });
    setPending(false);

    if (authError) {
      setError(mapAuthError(authError));
      return;
    }

    setSuccess(true);
  }

  return (
    <form action={onSubmit} className="space-y-4">
      {error ? <Alert>{error}</Alert> : null}
      {success ? <Alert tone="info">{AUTH_MESSAGES.emailChangeStarted}</Alert> : null}
      <Field htmlFor="email" label="Novo e-mail">
        <Input autoComplete="email" defaultValue={currentEmail} id="email" name="email" required type="email" />
      </Field>
      <Button disabled={pending} type="submit">
        {pending ? "Enviando confirmação..." : "Solicitar troca de e-mail"}
      </Button>
    </form>
  );
}

export function UpdatePasswordForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);
    const parsed = changePasswordSchema.safeParse({
      currentPassword: formData.get("currentPassword"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? AUTH_MESSAGES.generic);
      return;
    }

    setPending(true);
    const { error: authError } = await authClient.changePassword({
      currentPassword: parsed.data.currentPassword,
      newPassword: parsed.data.password,
      revokeOtherSessions: true,
    });
    setPending(false);

    if (authError) {
      setError(mapAuthError(authError));
      return;
    }

    setSuccess(true);
    router.refresh();
  }

  return (
    <form action={onSubmit} className="space-y-4">
      {error ? <Alert>{error}</Alert> : null}
      {success ? <Alert tone="success">{AUTH_MESSAGES.passwordChanged}</Alert> : null}
      <Field htmlFor="currentPassword" label="Senha atual">
        <Input autoComplete="current-password" id="currentPassword" name="currentPassword" required type="password" />
      </Field>
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
      <Button disabled={pending} type="submit">
        {pending ? "Alterando..." : "Alterar senha"}
      </Button>
    </form>
  );
}
