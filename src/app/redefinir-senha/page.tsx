import { AuthLink, AuthShell } from "@/components/auth-shell";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";
import { Alert } from "@/components/ui";
import { AUTH_MESSAGES } from "@/lib/auth/messages";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const params = await searchParams;
  const token = params.token?.trim() ?? "";
  const error = params.error?.toLowerCase() ?? "";

  if (!token) {
    const text = error.includes("expired")
      ? AUTH_MESSAGES.expiredToken
      : AUTH_MESSAGES.invalidToken;

    return (
      <AuthShell
        footer={
          <p>
            <AuthLink href="/esqueci-senha">Solicitar novo link</AuthLink>
          </p>
        }
        title="Redefinir senha"
      >
        <Alert>{text}</Alert>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      description="Escolha uma nova senha. Depois será necessário entrar novamente."
      footer={
        <p>
          <AuthLink href="/entrar">Voltar ao login</AuthLink>
        </p>
      }
      title="Redefinir senha"
    >
      <ResetPasswordForm token={token} />
    </AuthShell>
  );
}
