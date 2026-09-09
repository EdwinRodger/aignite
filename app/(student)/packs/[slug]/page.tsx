import React from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileTabBar } from '@/components/navigation/MobileTabBar';
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
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-20 md:pb-12">
      <Navbar />

      <main id="main-content" className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PackModuleClient pack={pack} />
      </main>

      <MobileTabBar />
    </div>
  );
}
