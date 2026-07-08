import { DashboardShell } from "@/shared/components/layout/DashboardShell";
import { ImportWizard } from "@/features/csv-import/components/ImportWizard";

export default function HomePage() {
  return (
    <DashboardShell>
      <ImportWizard />
    </DashboardShell>
  );
}
