"use client";

import { useActionState } from "react";
import {
  createEpisodeAction,
  type ActionState,
} from "@/lib/clinical/actions";
import { Alert, Button, Field, Input } from "@/components/ui";

const initial: ActionState = { ok: false };

export function EpisodeCreateForm({ patientId }: { patientId: string }) {
  const [state, action, pending] = useActionState(createEpisodeAction, initial);

  return (
    <form action={action} className="space-y-5">
      <input name="patientId" type="hidden" value={patientId} />
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}

      <Field htmlFor="lmp" label="DUM (informativa)">
        <Input id="lmp" name="lmp" type="date" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field htmlFor="gravidity" label="Gestações (G)">
          <Input id="gravidity" min={0} name="gravidity" type="number" />
        </Field>
        <Field htmlFor="parity" label="Partos (P)">
          <Input id="parity" min={0} name="parity" type="number" />
        </Field>
        <Field htmlFor="abortions" label="Abortos (A)">
          <Input id="abortions" min={0} name="abortions" type="number" />
        </Field>
      </div>

      <Field htmlFor="datingUltrasoundDate" label="Data da 1ª ultrassonografia">
        <Input
          id="datingUltrasoundDate"
          name="datingUltrasoundDate"
          type="date"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field htmlFor="datingUltrasoundGaWeeks" label="IG na 1ª USG (semanas)">
          <Input
            id="datingUltrasoundGaWeeks"
            min={0}
            name="datingUltrasoundGaWeeks"
            type="number"
          />
        </Field>
        <Field htmlFor="datingUltrasoundGaDays" label="IG na 1ª USG (dias)">
          <Input
            id="datingUltrasoundGaDays"
            max={6}
            min={0}
            name="datingUltrasoundGaDays"
            type="number"
          />
        </Field>
      </div>

      <Button pending={pending} type="submit">
        Salvar contexto gestacional
      </Button>
    </form>
  );
}
