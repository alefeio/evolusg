import { AuthLink, AuthShell } from "@/components/auth-shell";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      description="Informe o e-mail da conta. Se ele existir, enviaremos um link seguro para redefinir a senha."
      footer={
        <p>
          Lembrou a senha? <AuthLink href="/entrar">Entrar</AuthLink>
        </p>
      }
      title="Esqueci minha senha"
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
