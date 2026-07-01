import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Code } from 'lucide-react'

export const LANGUAGES = [
  { value: 'Python',     icon: '🐍', color: '#3b82f6' },
  { value: 'JavaScript', icon: '🟨', color: '#f59e0b' },
  { value: 'Java',       icon: '☕', color: '#ef4444' },
  { value: 'C',          icon: '🔵', color: '#06b6d4' },
  { value: 'C++',        icon: '⚡', color: '#8b5cf6' },
  { value: 'HTML',       icon: '🌐', color: '#f97316' },
  { value: 'CSS',        icon: '🎨', color: '#ec4899' },
  { value: 'SQL',        icon: '🗄️', color: '#10b981' },
]

export default function LanguageDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const selected = LANGUAGES.find(l => l.value === value) || LANGUAGES[0]

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative" id="language-dropdown">
      <button
        id="language-select-btn"
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 glass-card rounded-xl hover:border-[rgba(56,189,248,0.25)] transition-all duration-200 group"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select programming language"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-lg leading-none">{selected.icon}</span>
          <span className="text-sm font-semibold text-white">{selected.value}</span>
        </div>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Programming language options"
          className="absolute top-full left-0 right-0 mt-2 z-50 glass-card rounded-xl overflow-hidden border-[rgba(56,189,248,0.15)] shadow-2xl shadow-black/60"
          style={{ animation: 'fadeInUp 0.15s ease forwards' }}
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.value}
              role="option"
              aria-selected={lang.value === value}
              onClick={() => { onChange(lang.value); setOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150 hover:bg-[rgba(56,189,248,0.06)] ${
                lang.value === value
                  ? 'text-white bg-[rgba(56,189,248,0.08)]'
                  : 'text-slate-400'
              }`}
            >
              <span className="text-base leading-none">{lang.icon}</span>
              <span className="font-medium">{lang.value}</span>
              {lang.value === value && (
                <span className="ml-auto text-brand-400 text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
