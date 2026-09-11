"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui";

export function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    await authClient.signOut();
    router.push("/entrar");
    router.refresh();
  }

  return (
    <Button
      className="border-white/20 bg-white/10 text-white hover:bg-white/20"
      onClick={() => void signOut()}
      type="button"
      variant="secondary"
    >
      Sair
    </Button>
  );
}
