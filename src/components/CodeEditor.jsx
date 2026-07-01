import { useState, useRef } from 'react'
import { Clipboard, X, FileCode } from 'lucide-react'
import toast from 'react-hot-toast'

const PLACEHOLDER = `// Paste your code here...
// Example:

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`

export default function CodeEditor({ value, onChange }) {
  const textareaRef = useRef(null)
  const [charCount, setCharCount] = useState(value?.length || 0)
  const MAX_CHARS = 10000

  const handleChange = (e) => {
    const val = e.target.value
    if (val.length > MAX_CHARS) return
    setCharCount(val.length)
    onChange(val)
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (!text) { toast.error('Clipboard is empty'); return }
      const trimmed = text.slice(0, MAX_CHARS)
      setCharCount(trimmed.length)
      onChange(trimmed)
      toast.success('Pasted from clipboard!')
    } catch {
      toast.error('Could not read clipboard. Please paste manually.')
    }
  }

  const handleClear = () => {
    onChange('')
    setCharCount(0)
    textareaRef.current?.focus()
  }

  const handleTab = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      const newVal = value.substring(0, start) + '  ' + value.substring(end)
      onChange(newVal)
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2
      })
    }
  }

  const pct = (charCount / MAX_CHARS) * 100
  const barColor = pct > 85 ? '#f87171' : pct > 60 ? '#fbbf24' : '#38bdf8'

  return (
    <div className="glow-border rounded-2xl">
      <div className="glass-card rounded-2xl overflow-hidden">
        {/* Editor toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[rgba(56,189,248,0.08)] bg-[rgba(10,15,30,0.5)]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-3 text-xs font-mono text-slate-500 flex items-center gap-1.5">
              <FileCode size={12} /> code-snippet
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="paste-code-btn"
              onClick={handlePaste}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-brand-300 hover:bg-[rgba(56,189,248,0.06)] transition-all duration-150"
            >
              <Clipboard size={12} /> Paste
            </button>
            {value && (
              <button
                id="clear-code-btn"
                onClick={handleClear}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-[rgba(248,113,113,0.06)] transition-all duration-150"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Textarea */}
        <textarea
          id="code-input"
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleTab}
          placeholder={PLACEHOLDER}
          spellCheck={false}
          aria-label="Code input area"
          className="code-textarea w-full bg-transparent text-slate-200 p-4 outline-none min-h-[260px] max-h-[500px]"
        />

        {/* Char counter */}
        <div className="px-4 py-2 border-t border-[rgba(56,189,248,0.06)] flex items-center justify-between">
          <div className="h-1 flex-1 rounded-full bg-[rgba(255,255,255,0.05)] overflow-hidden mr-4">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${pct}%`, backgroundColor: barColor }}
            />
          </div>
          <span className="text-xs text-slate-500 tabular-nums shrink-0">
            {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
