import { Brain } from 'lucide-react'

const STEPS = [
  'Parsing your code...',
  'Analyzing structure & patterns...',
  'Generating explanation...',
  'Formatting response...',
]

export default function Loading() {
  return (
    <div
      id="loading-state"
      role="status"
      aria-live="polite"
      aria-label="AI is generating explanation"
      className="fade-in-up glass-card rounded-2xl p-8 flex flex-col items-center gap-6"
    >
      {/* Animated brain icon */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-500/20 to-accent-500/20 animate-pulse" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-brand-500/30 to-accent-500/30 animate-ping" style={{ animationDuration: '1.5s' }} />
        <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center shadow-xl shadow-brand-500/30 float-anim">
          <Brain size={24} className="text-white" />
        </div>
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold text-white mb-1">AI is thinking...</p>
        <p className="text-sm text-slate-400">Generating a structured explanation for your code</p>
      </div>

      {/* Step indicators */}
      <div className="w-full max-w-xs space-y-2.5">
        {STEPS.map((step, i) => (
          <div key={step} className="flex items-center gap-3">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 shimmer"
              style={{
                background: `rgba(56,189,248,${0.1 + i * 0.05})`,
                border: '1px solid rgba(56,189,248,0.2)',
                animationDelay: `${i * 0.3}s`,
              }}
            >
              <span
                className="w-2 h-2 rounded-full bg-brand-400 pulse-dot"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            </div>
            <span className="text-xs text-slate-400 shimmer rounded px-1">{step}</span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs h-1.5 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full"
          style={{
            animation: 'shimmer 1.5s ease-in-out infinite',
            backgroundSize: '200% 100%',
            width: '70%',
          }}
        />
      </div>
    </div>
  )
}
