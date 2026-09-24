"use client";

import { useActionState } from "react";
import {
  createExamAction,
  type ActionState,
} from "@/lib/clinical/actions";
import { Alert, Button, Field } from "@/components/ui";

const initial: ActionState = { ok: false };

const selectClass =
  "min-h-11 w-full rounded-[var(--radius-control)] border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-brand-blue-600";

export function ExamCreateForm({
  patientId,
  episodes,
}: {
  patientId: string;
  episodes: Array<{ id: string; label: string }>;
}) {
  const [state, action, pending] = useActionState(createExamAction, initial);

  if (episodes.length === 0) {
    return (
      <Alert tone="info">
        Cadastre um contexto gestacional antes de criar o exame.
      </Alert>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <input name="patientId" type="hidden" value={patientId} />
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}

      <Field htmlFor="pregnancyEpisodeId" label="Gestação">
        <select
          className={selectClass}
          defaultValue={episodes[0]?.id}
          id="pregnancyEpisodeId"
          name="pregnancyEpisodeId"
          required
        >
          {episodes.map((episode) => (
            <option key={episode.id} value={episode.id}>
              {episode.label}
            </option>
          ))}
        </select>
      </Field>

      <p className="text-sm text-text-secondary">
        Protocolo: Ultrassonografia obstétrica com Doppler · gestação única
      </p>

      <Button pending={pending} type="submit">
        Criar rascunho do exame
      </Button>
    </form>
  );
}
