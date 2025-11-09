import { Keyboard } from 'lucide-react';

interface ResultsCardProps {
  wpm: number;
  accuracy: number;
  totalWords: number;
}

export function ResultsCard({ wpm, accuracy, totalWords }: ResultsCardProps) {
  return (
    <div className="p-12 rounded-3xl shadow-2xl" id="results-card" style={{ backgroundColor: '#ffffff' }}>
      {/* Logo */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <Keyboard className="size-10" style={{ color: '#1f2937' }} />
        <span className="text-3xl" style={{ color: '#1f2937' }}>TypeSpeed</span>
      </div>

      <h1 className="text-5xl mb-12 text-center" style={{ color: '#1f2937' }}>Test Complete!</h1>

      <div className="space-y-6">
        <div className="rounded-2xl p-8" style={{ background: 'linear-gradient(to bottom right, #eff6ff, #faf5ff)' }}>
          <div className="mb-2 text-center" style={{ color: '#4b5563' }}>Words per Minute</div>
          <div className="text-7xl text-center" style={{ color: '#1f2937' }}>{wpm}</div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-2xl p-8" style={{ backgroundColor: '#f9fafb' }}>
            <div className="mb-2 text-center" style={{ color: '#4b5563' }}>Accuracy</div>
            <div className="text-5xl text-center" style={{ color: '#1f2937' }}>{accuracy}%</div>
          </div>

          <div className="rounded-2xl p-8" style={{ backgroundColor: '#f9fafb' }}>
            <div className="mb-2 text-center" style={{ color: '#4b5563' }}>Words Typed</div>
            <div className="text-5xl text-center" style={{ color: '#1f2937' }}>{totalWords}</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm" style={{ color: '#9ca3af' }}>
        typespeed.app
      </div>
    </div>
  );
}
