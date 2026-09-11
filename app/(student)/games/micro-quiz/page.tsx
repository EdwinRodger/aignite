import { redirect } from 'next/navigation';

export default function LegacyMicroQuizPage() {
  redirect('/challenges?module=rag&challenge=micro-quiz');
}
