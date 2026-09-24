import Link from "next/link";
import { PatientCreateForm } from "@/components/clinical/patient-create-form";
import { Card, PageHeader } from "@/components/ui";

export default function NewPatientPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        description="Use apenas dados fictícios neste piloto."
        title="Nova paciente"
      />
      <Card>
        <PatientCreateForm />
      </Card>
      <Link className="text-sm font-semibold text-brand-blue-700" href="/app/pacientes">
        Voltar para pacientes
      </Link>
    </div>
  );
}
