import { AuthLink, AuthShell } from "@/components/auth-shell";
import { ResendVerificationButton } from "@/components/forms/resend-verification-button";
import { Alert } from "@/components/ui";
import { AUTH_MESSAGES } from "@/lib/auth/messages";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; enviado?: string }>;
}) {
  const params = await searchParams;
  const error = params.error?.toLowerCase() ?? "";

  let message: { tone: "success" | "error" | "info"; text: string } = {
    tone: "info",
    text: "Enviamos uma mensagem para o endereço informado. Acesse seu e-mail e siga as instruções para confirmar sua conta.",
  };

  if (params.enviado) {
    message = { tone: "success", text: AUTH_MESSAGES.verificationSent };
  } else if (error.includes("expired")) {
    message = { tone: "error", text: AUTH_MESSAGES.expiredToken };
  } else if (error.includes("invalid") || error.includes("token")) {
    message = { tone: "error", text: AUTH_MESSAGES.invalidToken };
  } else if (!error && params.error === undefined) {
    message = {
      tone: "info",
      text: "Enviamos uma mensagem para o endereço informado. Acesse seu e-mail e siga as instruções para confirmar sua conta.",
    };
  }

  return (
    <AuthShell
      description="Confirme seu e-mail para concluir o acesso à sua conta."
      footer={
        <p>
          Já confirmou? <AuthLink href="/entrar">Entrar</AuthLink>
        </p>
      }
      title="Confirme seu e-mail"
    >
      <div className="space-y-4">
        <Alert tone={message.tone}>{message.text}</Alert>
        <ResendVerificationButton />
      </div>
    </AuthShell>
  );
}
