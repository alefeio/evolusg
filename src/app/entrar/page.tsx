import { redirect } from "next/navigation";
import { AuthLink, AuthShell } from "@/components/auth-shell";
import { SignInForm } from "@/components/forms/sign-in-form";
import { Alert } from "@/components/ui";
import { AUTH_MESSAGES } from "@/lib/auth/messages";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redefinida?: string }>;
}) {
  const session = await getSession();

  if (session) {
    redirect("/app");
  }

  const params = await searchParams;

  return (
    <AuthShell
      description="Entre com e-mail e senha. O endereço precisa estar verificado."
      footer={
        <p>
          Não tem conta? <AuthLink href="/cadastro">Criar conta</AuthLink>
          <span className="mx-2 text-border">·</span>
          <AuthLink href="/esqueci-senha">Esqueci minha senha</AuthLink>
        </p>
      }
      title="Entre na sua conta"
    >
      {params.redefinida ? <Alert tone="success">{AUTH_MESSAGES.resetDone}</Alert> : null}
      <div className={params.redefinida ? "mt-4" : undefined}>
        <SignInForm />
      </div>
    </AuthShell>
  );
}
