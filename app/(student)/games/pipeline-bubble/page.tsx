import { redirect } from 'next/navigation';

export default function LegacyPipelineBubblePage() {
  redirect('/challenges?module=rag&challenge=pipeline-bubble');
}
