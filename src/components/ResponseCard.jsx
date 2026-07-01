import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  BookOpen,
  List,
  Clock,
  Database,
  Lightbulb,
  BarChart2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Star,
} from 'lucide-react'
import toast from 'react-hot-toast'

/* ── helpers ──────────────────────────────────────────────────────────── */

function difficultyBadge(level) {
  const lc = (level || '').toLowerCase()
  if (lc.includes('beginner'))     return 'badge-beginner'
  if (lc.includes('intermediate')) return 'badge-intermediate'
  if (lc.includes('advanced'))     return 'badge-advanced'
  return 'badge-beginner'
}

function difficultyStars(level) {
  const lc = (level || '').toLowerCase()
  if (lc.includes('advanced'))     return 3
  if (lc.includes('intermediate')) return 2
  return 1
}

/* ── CopyBtn ──────────────────────────────────────────────────────────── */
function CopyBtn({ text, id }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Copy failed')
    }
  }
  return (
    <button
      id={id}
      onClick={copy}
      aria-label="Copy to clipboard"
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-brand-300 hover:bg-[rgba(56,189,248,0.06)] transition-all duration-150 shrink-0"
    >
      {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

/* ── Section card ─────────────────────────────────────────────────────── */
function Section({ id, icon: Icon, title, children, colorClass, accent, delay = 0, copyText }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      id={id}
      className={`glass-card rounded-xl border-l-4 ${colorClass} overflow-hidden fade-in-up`}
      style={{ animationDelay: `${delay}s`, opacity: 0 }}
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(255,255,255,0.04)]">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
          >
            <Icon size={15} style={{ color: accent }} />
          </div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
        <div className="flex items-center gap-1">
          {copyText && <CopyBtn text={copyText} id={`copy-${id}`} />}
          <button
            onClick={() => setCollapsed(c => !c)}
            aria-label={collapsed ? 'Expand section' : 'Collapse section'}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-300 hover:bg-[rgba(255,255,255,0.04)] transition-all duration-150"
          >
            {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="px-5 py-4 text-sm text-slate-300 leading-relaxed prose-custom">
          {children}
        </div>
      )}
    </div>
  )
}

/* ── Markdown wrapper ─────────────────────────────────────────────────── */
function MD({ children }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ inline, children, ...props }) {
          return inline ? (
            <code className="px-1.5 py-0.5 rounded text-xs font-mono bg-[rgba(56,189,248,0.1)] text-brand-300 border border-[rgba(56,189,248,0.15)]" {...props}>
              {children}
            </code>
          ) : (
            <pre className="my-3 p-3 rounded-xl bg-[rgba(10,15,30,0.8)] border border-[rgba(56,189,248,0.1)] overflow-x-auto">
              <code className="font-mono text-xs text-slate-200 leading-relaxed" {...props}>{children}</code>
            </pre>
          )
        },
        p: ({ children }) => <p className="mb-2 last:mb-0 text-slate-300">{children}</p>,
        ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2 text-slate-300">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2 text-slate-300">{children}</ol>,
        li: ({ children }) => <li className="text-slate-300 leading-relaxed">{children}</li>,
        strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
        h1: ({ children }) => <h1 className="text-base font-bold text-white mb-2 mt-1">{children}</h1>,
        h2: ({ children }) => <h2 className="text-sm font-bold text-white mb-1.5 mt-1">{children}</h2>,
        h3: ({ children }) => <h3 className="text-sm font-semibold text-brand-300 mb-1 mt-1">{children}</h3>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-brand-500 pl-3 my-2 text-slate-400 italic">{children}</blockquote>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  )
}

/* ── Main ResponseCard ────────────────────────────────────────────────── */
export default function ResponseCard({ data, language }) {
  if (!data) return null

  const {
    summary,
    lineByLine,
    timeComplexity,
    spaceComplexity,
    suggestions,
    difficulty,
  } = data

  const diffClass = difficultyBadge(difficulty)
  const stars = difficultyStars(difficulty)

  const allText = [summary, lineByLine, timeComplexity, spaceComplexity, suggestions]
    .filter(Boolean)
    .join('\n\n')

  return (
    <div id="response-card" className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-white">Analysis Result</h2>
          <span className="text-xs text-slate-500 px-2 py-0.5 rounded-full border border-[rgba(255,255,255,0.06)]">
            {language}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {difficulty && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${diffClass}`}>
              {Array.from({ length: stars }).map((_, i) => (
                <Star key={i} size={10} fill="currentColor" />
              ))}
              {difficulty}
            </div>
          )}
          <CopyBtn text={allText} id="copy-all-btn" />
        </div>
      </div>

      {/* Sections */}
      {summary && (
        <Section id="section-summary" icon={BookOpen} title="Summary" colorClass="section-summary" accent="#38bdf8" delay={0.05} copyText={summary}>
          <MD>{summary}</MD>
        </Section>
      )}

      {lineByLine && (
        <Section id="section-lineby" icon={List} title="Line-by-Line Explanation" colorClass="section-lineby" accent="#a78bfa" delay={0.1} copyText={lineByLine}>
          <MD>{lineByLine}</MD>
        </Section>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {timeComplexity && (
          <Section id="section-time" icon={Clock} title="Time Complexity" colorClass="section-time" accent="#34d399" delay={0.15} copyText={timeComplexity}>
            <MD>{timeComplexity}</MD>
          </Section>
        )}
        {spaceComplexity && (
          <Section id="section-space" icon={Database} title="Space Complexity" colorClass="section-space" accent="#fbbf24" delay={0.2} copyText={spaceComplexity}>
            <MD>{spaceComplexity}</MD>
          </Section>
        )}
      </div>

      {suggestions && (
        <Section id="section-suggest" icon={Lightbulb} title="Suggestions & Improvements" colorClass="section-suggest" accent="#f472b6" delay={0.25} copyText={suggestions}>
          <MD>{suggestions}</MD>
        </Section>
      )}
    </div>
  )
}
