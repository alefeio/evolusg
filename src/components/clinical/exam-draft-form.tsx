"use client";

import { useActionState, useMemo, useState } from "react";
import {
  saveExamDraftAction,
  type ActionState,
} from "@/lib/clinical/actions";
import {
  cerebroplacentalRatio,
  meanUterineArteryPi,
} from "@/lib/clinical/arithmetic";
import { applySavedSnapshot } from "@/lib/clinical/draft-baseline";
import { ductusBlockIncluded } from "@/lib/clinical/ductus-assessment";
import {
  showCephalicPoleField,
  showSpineField,
  type FetalLie,
} from "@/lib/clinical/position-rules";
import { presenceToCheckbox } from "@/lib/clinical/presence";
import { Alert, Button, Field, Input } from "@/components/ui";

const initial: ActionState = { ok: false };

const selectClass =
  "min-h-11 w-full rounded-[var(--radius-control)] border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-brand-blue-600";

type ExamDraftValues = {
  examId: string;
  comorbidities: string | null;
  continuousMedications: string | null;
  transducersUsed: string[];
  placentaLocation: string | null;
  placentaGrade: string | null;
  amnioticMethod: string | null;
  amnioticValue: number | null;
  uterineArteryRightPi: number | null;
  uterineArteryLeftPi: number | null;
  uterineArteryRightNotch: boolean | null;
  uterineArteryLeftNotch: boolean | null;
  fetus: {
    lie: string | null;
    presentation: string | null;
    spineSide: string | null;
    cephalicPoleSide: string | null;
    heartRateBpm: number | null;
    bodyMovementsPresent: boolean | null;
    swallowingPresent: boolean | null;
    biparietalDiameterMm: number | null;
    headCircumferenceMm: number | null;
    abdominalCircumferenceMm: number | null;
    femurLengthMm: number | null;
    umbilicalArteryPi: number | null;
    middleCerebralArteryPi: number | null;
    ductusVenosusAssessed: boolean | null;
    ductusVenosusPi: number | null;
  };
  episode: {
    lmp: string | null;
    gravidity: number | null;
    parity: number | null;
    abortions: number | null;
    datingUltrasoundDate: string | null;
    datingUltrasoundGaWeeks: number | null;
    datingUltrasoundGaDays: number | null;
  };
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 border-t border-border pt-6 first:border-t-0 first:pt-0">
      <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function num(value: number | null | undefined) {
  return value == null ? "" : String(value);
}

export function ExamDraftForm({ values }: { values: ExamDraftValues }) {
  const [state, action, pending] = useActionState(saveExamDraftAction, initial);
  const baseline = applySavedSnapshot(values, state.saved);
  const [lie, setLie] = useState<FetalLie | "">(
    (baseline.fetus.lie as FetalLie | null) ?? "",
  );
  const [rightPi, setRightPi] = useState(num(baseline.uterineArteryRightPi));
  const [leftPi, setLeftPi] = useState(num(baseline.uterineArteryLeftPi));
  const [umbilicalPi, setUmbilicalPi] = useState(
    num(baseline.fetus.umbilicalArteryPi),
  );
  const [mcaPi, setMcaPi] = useState(num(baseline.fetus.middleCerebralArteryPi));
  const [amnioticMethod, setAmnioticMethod] = useState(
    baseline.amnioticMethod ?? "",
  );
  const [ductusAssessed, setDuctusAssessed] = useState(() =>
    ductusBlockIncluded(
      baseline.fetus.ductusVenosusAssessed,
      baseline.fetus.ductusVenosusPi,
    ),
  );
  const [ductusPi, setDuctusPi] = useState(num(baseline.fetus.ductusVenosusPi));

  const meanPi = useMemo(
    () =>
      meanUterineArteryPi(
        rightPi === "" ? null : Number(rightPi),
        leftPi === "" ? null : Number(leftPi),
      ),
    [rightPi, leftPi],
  );

  const rcp = useMemo(
    () =>
      cerebroplacentalRatio(
        mcaPi === "" ? null : Number(mcaPi),
        umbilicalPi === "" ? null : Number(umbilicalPi),
      ),
    [mcaPi, umbilicalPi],
  );

  const lieValue = lie === "" ? null : lie;

  return (
    <form key={baseline.revision} action={action} className="space-y-8">
      <input name="examId" type="hidden" value={values.examId} />

      {state.ok ? (
        <Alert tone="success">Rascunho salvo.</Alert>
      ) : null}
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}

      <Section title="1. Dados clínicos">
        <div className="grid gap-3 rounded-[var(--radius-control)] bg-surface-soft p-4 text-sm text-text-secondary sm:grid-cols-2">
          <p>
            DUM:{" "}
            <span className="font-medium text-text-primary">
              {values.episode.lmp ?? "—"}
            </span>
          </p>
          <p>
            G/P/A:{" "}
            <span className="font-medium text-text-primary">
              {values.episode.gravidity ?? "—"}/{values.episode.parity ?? "—"}/
              {values.episode.abortions ?? "—"}
            </span>
          </p>
          <p>
            1ª USG:{" "}
            <span className="font-medium text-text-primary">
              {values.episode.datingUltrasoundDate ?? "—"}
            </span>
          </p>
          <p>
            IG na 1ª USG:{" "}
            <span className="font-medium text-text-primary">
              {values.episode.datingUltrasoundGaWeeks != null
                ? `${values.episode.datingUltrasoundGaWeeks}s ${values.episode.datingUltrasoundGaDays ?? 0}d`
                : "—"}
            </span>
          </p>
        </div>
        <Field htmlFor="comorbidities" label="Comorbidades (neste exame)">
          <Input
            defaultValue={baseline.comorbidities ?? ""}
            id="comorbidities"
            name="comorbidities"
          />
        </Field>
        <Field
          htmlFor="continuousMedications"
          label="Medicações de uso contínuo (neste exame)"
        >
          <Input
            defaultValue={baseline.continuousMedications ?? ""}
            id="continuousMedications"
            name="continuousMedications"
          />
        </Field>
      </Section>

      <Section title="2. Técnica do exame">
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-text-primary">
            Transdutores utilizados
          </legend>
          <label className="flex items-center gap-2 text-sm text-text-primary">
            <input
              defaultChecked={baseline.transducersUsed.includes(
                "CONVEX_MULTIFREQUENCY",
              )}
              name="transducersUsed"
              type="checkbox"
              value="CONVEX_MULTIFREQUENCY"
            />
            Transdutor convexo multifrequencial
          </label>
          <label className="flex items-center gap-2 text-sm text-text-primary">
            <input
              defaultChecked={baseline.transducersUsed.includes("ENDOCAVITARY")}
              name="transducersUsed"
              type="checkbox"
              value="ENDOCAVITARY"
            />
            Transdutor endocavitário
          </label>
        </fieldset>
        <p className="text-xs text-text-secondary">
          Os dois podem ser marcados no mesmo exame. O rascunho pode ser salvo
          sem seleção.
        </p>
      </Section>

      <Section title="3. Vitalidade / posição fetal">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field htmlFor="lie" label="Situação">
            <select
              className={selectClass}
              id="lie"
              name="lie"
              onChange={(event) =>
                setLie(event.target.value as FetalLie | "")
              }
              value={lie}
            >
              <option value="">Não informado</option>
              <option value="LONGITUDINAL">Longitudinal</option>
              <option value="TRANSVERSE">Transversa</option>
            </select>
          </Field>
          <Field htmlFor="presentation" label="Apresentação">
            <select
              className={selectClass}
              defaultValue={baseline.fetus.presentation ?? ""}
              id="presentation"
              name="presentation"
            >
              <option value="">Não informado</option>
              <option value="CEPHALIC">Cefálica</option>
              <option value="PELVIC">Pélvica</option>
              <option value="CORMIC">Córmica</option>
            </select>
          </Field>
          {showSpineField(lieValue) ? (
            <Field htmlFor="spineSide" label="Dorso">
              <select
                className={selectClass}
                defaultValue={baseline.fetus.spineSide ?? ""}
                id="spineSide"
                name="spineSide"
              >
                <option value="">Não informado</option>
                <option value="RIGHT">Direita</option>
                <option value="LEFT">Esquerda</option>
                <option value="VARIABLE">Variável</option>
              </select>
            </Field>
          ) : (
            <input name="spineSide" type="hidden" value="" />
          )}
          {showCephalicPoleField(lieValue) ? (
            <Field htmlFor="cephalicPoleSide" label="Polo cefálico">
              <select
                className={selectClass}
                defaultValue={baseline.fetus.cephalicPoleSide ?? ""}
                id="cephalicPoleSide"
                name="cephalicPoleSide"
              >
                <option value="">Não informado</option>
                <option value="RIGHT">Direita</option>
                <option value="LEFT">Esquerda</option>
              </select>
            </Field>
          ) : (
            <input name="cephalicPoleSide" type="hidden" value="" />
          )}
        </div>

        <Field htmlFor="heartRateBpm" label="BCF (bpm)">
          <Input
            defaultValue={num(baseline.fetus.heartRateBpm)}
            id="heartRateBpm"
            name="heartRateBpm"
            type="number"
          />
        </Field>
        <p className="text-xs text-text-secondary">
          Captura apenas — sem classificação automática nesta Sprint.
        </p>

        <label className="flex items-center gap-2 text-sm text-text-primary">
          <input
            defaultChecked={presenceToCheckbox(baseline.fetus.bodyMovementsPresent)}
            name="bodyMovementsPresent"
            type="checkbox"
            value="true"
          />
          Movimentos fetais presentes
        </label>
        <label className="flex items-center gap-2 text-sm text-text-primary">
          <input
            defaultChecked={presenceToCheckbox(baseline.fetus.swallowingPresent)}
            name="swallowingPresent"
            type="checkbox"
            value="true"
          />
          Deglutição presente
        </label>
        <p className="text-xs text-text-secondary">
          Não marcado ≠ ausente. Sem marcação, o dado permanece não informado.
        </p>
      </Section>

      <Section title="4. Doppler">
        <h3 className="text-sm font-semibold text-text-primary">
          Artérias uterinas
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field htmlFor="uterineArteryRightPi" label="IP direita">
            <Input
              id="uterineArteryRightPi"
              name="uterineArteryRightPi"
              onChange={(event) => setRightPi(event.target.value)}
              step="0.01"
              type="number"
              value={rightPi}
            />
          </Field>
          <Field htmlFor="uterineArteryLeftPi" label="IP esquerda">
            <Input
              id="uterineArteryLeftPi"
              name="uterineArteryLeftPi"
              onChange={(event) => setLeftPi(event.target.value)}
              step="0.01"
              type="number"
              value={leftPi}
            />
          </Field>
        </div>
        <p className="text-sm text-text-secondary">
          IP médio:{" "}
          <span className="font-semibold text-text-primary">
            {meanPi == null ? "—" : meanPi.toFixed(2)}
          </span>{" "}
          (aritmético; sem classificação P95)
        </p>
        <label className="flex items-center gap-2 text-sm">
          <input
            defaultChecked={presenceToCheckbox(baseline.uterineArteryRightNotch)}
            name="uterineArteryRightNotch"
            type="checkbox"
            value="true"
          />
          Incisura direita presente
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            defaultChecked={presenceToCheckbox(baseline.uterineArteryLeftNotch)}
            name="uterineArteryLeftNotch"
            type="checkbox"
            value="true"
          />
          Incisura esquerda presente
        </label>

        <h3 className="pt-2 text-sm font-semibold text-text-primary">
          Doppler fetal
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field htmlFor="umbilicalArteryPi" label="IP umbilical">
            <Input
              id="umbilicalArteryPi"
              name="umbilicalArteryPi"
              onChange={(event) => setUmbilicalPi(event.target.value)}
              step="0.01"
              type="number"
              value={umbilicalPi}
            />
          </Field>
          <Field htmlFor="middleCerebralArteryPi" label="IP ACM">
            <Input
              id="middleCerebralArteryPi"
              name="middleCerebralArteryPi"
              onChange={(event) => setMcaPi(event.target.value)}
              step="0.01"
              type="number"
              value={mcaPi}
            />
          </Field>
          <div className="space-y-3 sm:col-span-3">
            <label className="flex items-center gap-2 text-sm text-text-primary">
              <input
                checked={ductusAssessed}
                name="ductusVenosusAssessed"
                onChange={(event) => setDuctusAssessed(event.target.checked)}
                type="checkbox"
                value="true"
              />
              Avaliar ducto venoso
            </label>
            {ductusAssessed ? (
              <Field
                error={state.fieldErrors?.ductusVenosusPi?.[0]}
                htmlFor="ductusVenosusPi"
                label="IP ducto venoso"
              >
                <Input
                  id="ductusVenosusPi"
                  invalid={Boolean(state.fieldErrors?.ductusVenosusPi)}
                  name="ductusVenosusPi"
                  onChange={(event) => setDuctusPi(event.target.value)}
                  required
                  step="0.01"
                  type="number"
                  value={ductusPi}
                />
              </Field>
            ) : (
              <input name="ductusVenosusPi" type="hidden" value={ductusPi} />
            )}
            <p className="text-xs text-text-secondary">
              Sem essa marcação, o ducto venoso não entra neste exame. Isso não
              significa normal nem ausente.
            </p>
          </div>
        </div>
        <p className="text-sm text-text-secondary">
          RCP (ACM/umbilical):{" "}
          <span className="font-semibold text-text-primary">
            {rcp == null ? "—" : rcp.toFixed(2)}
          </span>{" "}
          — valor matemático apenas, sem interpretação
        </p>
      </Section>

      <Section title="5. Biometria fetal">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field htmlFor="biparietalDiameterMm" label="DBP (mm)">
            <Input
              defaultValue={num(baseline.fetus.biparietalDiameterMm)}
              id="biparietalDiameterMm"
              name="biparietalDiameterMm"
              step="0.1"
              type="number"
            />
          </Field>
          <Field htmlFor="headCircumferenceMm" label="CC (mm)">
            <Input
              defaultValue={num(baseline.fetus.headCircumferenceMm)}
              id="headCircumferenceMm"
              name="headCircumferenceMm"
              step="0.1"
              type="number"
            />
          </Field>
          <Field htmlFor="abdominalCircumferenceMm" label="CA (mm)">
            <Input
              defaultValue={num(baseline.fetus.abdominalCircumferenceMm)}
              id="abdominalCircumferenceMm"
              name="abdominalCircumferenceMm"
              step="0.1"
              type="number"
            />
          </Field>
          <Field htmlFor="femurLengthMm" label="CF (mm)">
            <Input
              defaultValue={num(baseline.fetus.femurLengthMm)}
              id="femurLengthMm"
              name="femurLengthMm"
              step="0.1"
              type="number"
            />
          </Field>
        </div>
        <p className="text-xs text-text-secondary">
          Sem PFE, percentil ou classificação de crescimento nesta Sprint.
        </p>
      </Section>

      <Section title="6. Placenta">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field htmlFor="placentaLocation" label="Localização">
            <select
              className={selectClass}
              defaultValue={baseline.placentaLocation ?? ""}
              id="placentaLocation"
              name="placentaLocation"
            >
              <option value="">Não informado</option>
              <option value="ANTERIOR">Anterior</option>
              <option value="POSTERIOR">Posterior</option>
              <option value="FUNDAL">Fúndica</option>
              <option value="LATERAL">Lateral</option>
            </select>
          </Field>
          <Field htmlFor="placentaGrade" label="Grau">
            <select
              className={selectClass}
              defaultValue={baseline.placentaGrade ?? ""}
              id="placentaGrade"
              name="placentaGrade"
            >
              <option value="">Não informado</option>
              <option value="GRADE_0">0</option>
              <option value="I">I</option>
              <option value="II">II</option>
              <option value="III">III</option>
            </select>
          </Field>
        </div>
      </Section>

      <Section title="7. Líquido amniótico">
        <Field htmlFor="amnioticMethod" label="Método">
          <select
            className={selectClass}
            id="amnioticMethod"
            name="amnioticMethod"
            onChange={(event) => setAmnioticMethod(event.target.value)}
            value={amnioticMethod}
          >
            <option value="">Não informado</option>
            <option value="MBV">MBV</option>
            <option value="ILA">ILA</option>
          </select>
        </Field>
        {amnioticMethod ? (
          <Field
            htmlFor="amnioticValue"
            label={amnioticMethod === "MBV" ? "Valor MBV" : "Valor ILA"}
          >
            <Input
              defaultValue={num(baseline.amnioticValue)}
              id="amnioticValue"
              name="amnioticValue"
              step="0.1"
              type="number"
            />
          </Field>
        ) : (
          <input name="amnioticValue" type="hidden" value="" />
        )}
        <p className="text-xs text-text-secondary">
          Escolha manual do método. Sem classificação oligo/poli nesta Sprint.
        </p>
      </Section>

      <div className="sticky bottom-0 border-t border-border bg-background/95 py-4 backdrop-blur">
        <Button pending={pending} type="submit">
          Salvar rascunho
        </Button>
      </div>
    </form>
  );
}
