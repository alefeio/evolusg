"use client";

import { useActionState } from "react";
import {
  createPatientAction,
  type ActionState,
} from "@/lib/clinical/actions";
import { Alert, Button, Field, Input } from "@/components/ui";

const initial: ActionState = { ok: false };

export function PatientCreateForm() {
  const [state, action, pending] = useActionState(createPatientAction, initial);

  return (
    <form action={action} className="space-y-5">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      <Field
        error={state.fieldErrors?.fullName?.[0]}
        htmlFor="fullName"
        label="Nome da paciente"
      >
        <Input
          autoComplete="off"
          id="fullName"
          invalid={Boolean(state.fieldErrors?.fullName)}
          name="fullName"
          required
        />
      </Field>
      <Field
        hint="Opcional — apenas para identificação fictícia neste piloto."
        htmlFor="birthDate"
        label="Data de nascimento"
      >
        <Input id="birthDate" name="birthDate" type="date" />
      </Field>
      <Field htmlFor="notes" label="Observações">
        <Input id="notes" name="notes" />
      </Field>
      <Button pending={pending} type="submit">
        Salvar paciente
      </Button>
    </form>
  );
}
