import FittingRoom from '@/components/fitting-room/FittingRoom';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VirtuFit Fitting Room — Open Fitting Studio',
  description: 'Virtual fitting room and AI garment try-on studio.',
};

export default async function StudioPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string | string[] }>;
}) {
  const query = await searchParams;
  const mode = query.mode === 'photo' ? 'photo' : 'live';

  return <FittingRoom initialMode={mode} key={mode} />;
}
