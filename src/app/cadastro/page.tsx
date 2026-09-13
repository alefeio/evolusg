import { redirect } from "next/navigation";
import { AuthLink, AuthShell } from "@/components/auth-shell";
import { SignUpForm } from "@/components/forms/sign-up-form";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  const session = await getSession();

  if (session) {
    redirect("/app");
  }

  return (
    <AuthShell
      description="Preencha seus dados para acessar o evolUSG."
      footer={
        <p>
          Já tem conta? <AuthLink href="/entrar">Entrar</AuthLink>
        </p>
      }
      title="Crie sua conta"
    >
      <SignUpForm />
    </AuthShell>
  );
}
