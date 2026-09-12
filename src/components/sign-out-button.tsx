"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui";

export function SignOutButton({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    try {
      await authClient.signOut();
      router.push("/entrar");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      className={
        tone === "dark"
          ? "w-full border-white/20 bg-white/10 text-text-on-dark hover:bg-white/20"
          : undefined
      }
      onClick={() => void signOut()}
      pending={pending}
      type="button"
      variant={tone === "dark" ? "secondary" : "secondary"}
    >
      {pending ? "Saindo..." : "Sair"}
    </Button>
  );
}
