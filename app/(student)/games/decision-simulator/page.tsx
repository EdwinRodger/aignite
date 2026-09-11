import { redirect } from 'next/navigation';

export default function LegacyDecisionSimulatorPage() {
  redirect('/challenges?module=rag&challenge=decision-simulator');
}
