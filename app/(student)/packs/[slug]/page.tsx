import React from 'react';
import { notFound } from 'next/navigation';
import { PackModuleClient } from '@/components/learning/PackModuleClient';
import { getCompanyPackBySlug, getCompanyPacks } from '@/app/actions/learning';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const packs = await getCompanyPacks();
  return packs.map((p) => ({
    slug: p.slug,
  }));
}

export default async function PackDetailPage({ params }: Props) {
  const { slug } = await params;
  const pack = await getCompanyPackBySlug(slug);

  if (!pack) {
    notFound();
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <PackModuleClient pack={pack} />
    </div>
  );
}
