import FittingRoom from '@/components/fitting-room/FittingRoom';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string | string[] }>;
}) {
  const query = await searchParams;
  const mode = query.mode === 'photo' ? 'photo' : 'live';

  return (
    <div className="relative">
      {/* VibeCheck Mirror Announcement Banner */}
      <div className="w-full bg-gradient-to-r from-amber-950/80 via-neutral-900 to-amber-950/80 border-b border-amber-500/30 px-4 py-2.5 text-center text-xs sm:text-sm text-neutral-200">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <div className="inline-flex items-center gap-1.5 text-amber-400 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>New: VibeCheck Style Mirror</span>
          </div>
          <span className="text-neutral-400 hidden sm:inline">&bull;</span>
          <span className="text-neutral-300">
            Looking for friendly outfit advice for your chosen vibe?
          </span>
          <Link
            href="/vibecheck"
            className="inline-flex items-center gap-1 font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4 transition-colors"
          >
            <span>Open VibeCheck Mirror</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <FittingRoom initialMode={mode} key={mode} />
    </div>
  );
}
