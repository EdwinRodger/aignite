import { redirect } from 'next/navigation';

export default function LegacyErrorHunterPage() {
  redirect('/challenges?module=rag&challenge=error-hunter');
}
