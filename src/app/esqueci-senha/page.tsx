import { AuthLink, AuthShell } from "@/components/auth-shell";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      description="Informe seu e-mail para receber as instruções de redefinição de senha."
      footer={
        <p>
          Lembrou a senha? <AuthLink href="/entrar">Entrar</AuthLink>
        </p>
      }
      title="Recupere o acesso à sua conta"
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
