import { Zap, ExternalLink } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(13,21,38,0.7)] backdrop-blur-[16px] border-b border-[rgba(56,189,248,0.1)]">
      <div className="w-full px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="AI Code Explainer Logo" className="w-9 h-9 object-contain rounded-lg" />
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold text-white tracking-tight">AI Code</span>
            <span className="text-[11px] font-semibold gradient-text tracking-widest uppercase">Explainer</span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(52,211,153,0.1)] border border-[rgba(52,211,153,0.2)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
            <span className="text-xs font-medium text-emerald-400">AI Online</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-[rgba(56,189,248,0.08)] border border-[rgba(56,189,248,0.15)] text-xs font-medium text-brand-300">
            <Zap size={12} />
            OpenRouter Free
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all duration-200"
          >
            <ExternalLink size={18} />
          </a>
        </div>
      </div>
    </nav>
  )
}
