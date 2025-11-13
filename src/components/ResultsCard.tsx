interface ResultsCardProps {
  wpm: number;
  accuracy: number;
  totalWords: number;
}

export function ResultsCard({ wpm, accuracy, totalWords }: ResultsCardProps) {
  return (
    <div
      id="results-card"
      style={{
        backgroundColor: '#ffffff',
        width: '600px',
        padding: '48px',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
        <img src="/Logo-Key.svg" alt="Keybreaker" style={{ height: '50px' }} />
      </div>

      <h1 style={{ fontSize: '48px', marginBottom: '48px', textAlign: 'center', color: '#1f2937', fontWeight: '700' }}>Test Complete!</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ borderRadius: '16px', padding: '32px', background: 'linear-gradient(to bottom right, #eff6ff, #faf5ff)' }}>
          <div style={{ marginBottom: '8px', textAlign: 'center', color: '#4b5563', fontSize: '16px' }}>Words per Minute</div>
          <div style={{ fontSize: '72px', textAlign: 'center', color: '#1f2937', fontWeight: '700' }}>{wpm}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ borderRadius: '16px', padding: '32px', backgroundColor: '#f9fafb' }}>
            <div style={{ marginBottom: '8px', textAlign: 'center', color: '#4b5563', fontSize: '16px' }}>Accuracy</div>
            <div style={{ fontSize: '48px', textAlign: 'center', color: '#1f2937', fontWeight: '700' }}>{accuracy}%</div>
          </div>

          <div style={{ borderRadius: '16px', padding: '32px', backgroundColor: '#f9fafb' }}>
            <div style={{ marginBottom: '8px', textAlign: 'center', color: '#4b5563', fontSize: '16px' }}>Words Typed</div>
            <div style={{ fontSize: '48px', textAlign: 'center', color: '#1f2937', fontWeight: '700' }}>{totalWords}</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: '#9ca3af' }}>
        keybreaker.lol
      </div>
    </div>
  );
}
