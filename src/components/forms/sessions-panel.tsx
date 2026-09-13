"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { AUTH_MESSAGES, mapAuthError } from "@/lib/auth/messages";
import { Alert, Button } from "@/components/ui";

type SessionItem = {
  id: string;
  token: string;
  createdAt: Date | string;
  userAgent?: string | null;
  ipAddress?: string | null;
};

export function SessionsPanel({
  sessions,
  currentToken,
}: {
  sessions: SessionItem[];
  currentToken: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function revokeOther() {
    setError(null);
    setMessage(null);
    setPending(true);
    const { error: authError } = await authClient.revokeOtherSessions();
    setPending(false);

    if (authError) {
      setError(mapAuthError(authError));
      return;
    }

    setMessage(AUTH_MESSAGES.sessionsRevoked);
    router.refresh();
  }

  async function revokeOne(token: string) {
    setError(null);
    setMessage(null);
    setPending(true);
    const { error: authError } = await authClient.revokeSession({ token });
    setPending(false);

    if (authError) {
      setError(mapAuthError(authError));
      return;
    }

    setMessage(AUTH_MESSAGES.sessionRevoked);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {error ? <Alert>{error}</Alert> : null}
      {message ? <Alert tone="success">{message}</Alert> : null}
      <ul className="space-y-3">
        {sessions.map((session) => {
          const current = session.token === currentToken;
          const createdAt = new Date(session.createdAt).toLocaleString("pt-BR");
          return (
            <li
              className="flex flex-col gap-2 rounded-[var(--radius-control)] border border-border bg-surface-soft/60 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
              key={session.id}
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-primary">
                  {current ? "Sessão atual" : "Outro dispositivo"}
                </p>
                <p className="text-xs text-text-secondary">{createdAt}</p>
                {session.userAgent ? (
                  <p className="mt-1 max-w-md truncate text-xs text-text-secondary">
                    {session.userAgent}
                  </p>
                ) : null}
              </div>
              {current ? null : (
                <Button
                  onClick={() => void revokeOne(session.token)}
                  pending={pending}
                  type="button"
                  variant="secondary"
                >
                  Encerrar
                </Button>
              )}
            </li>
          );
        })}
      </ul>
      {sessions.length > 1 ? (
        <Button onClick={() => void revokeOther()} pending={pending} type="button" variant="secondary">
          Encerrar outras sessões
        </Button>
      ) : null}
    </div>
  );
}
