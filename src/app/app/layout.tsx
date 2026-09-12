import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { requireSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await requireSession();

  return (
    <AppShell userEmail={session.user.email} userName={session.user.name}>
      {children}
    </AppShell>
  );
}
