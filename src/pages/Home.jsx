import { useState } from 'react'
import { Sparkles, AlertCircle, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'

import Navbar from '../components/Navbar'
import CodeEditor from '../components/CodeEditor'
import LanguageDropdown from '../components/LanguageDropdown'
import Loading from '../components/Loading'
import ResponseCard from '../components/ResponseCard'
import { explainCode } from '../services/openrouter'

export default function Home() {
  const [code, setCode]         = useState('')
  const [language, setLanguage] = useState('Python')
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState(null)
  const [error, setError]       = useState(null)

  const handleExplain = async () => {
    const trimmed = code.trim()
    if (!trimmed) {
      toast.error('Please paste some code before explaining.')
      return
    }
    if (trimmed.length < 5) {
      toast.error('Code snippet is too short. Please paste more content.')
      return
    }

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const data = await explainCode(trimmed, language)
      setResult(data)
      setTimeout(() => {
        document.getElementById('response-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err) {
      const msg = err.message || 'Something went wrong. Please try again.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setCode('')
    setResult(null)
    setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Background radial gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #0ea5e9 0%, transparent 70%)', transform: 'translate(-50%, -30%)' }}
        />
        <div
          className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)', transform: 'translate(30%, 0)' }}
        />
        <div
          className="absolute bottom-0 left-1/2 w-[400px] h-[400px] rounded-full opacity-6"
          style={{ background: 'radial-gradient(circle, #f472b6 0%, transparent 70%)', transform: 'translate(-50%, 30%)' }}
        />
      </div>

      <Navbar />

      <main className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6 text-xs font-medium text-brand-300 border-[rgba(56,189,248,0.2)] fade-in-up">
            <Sparkles size={12} className="text-brand-400" />
            Powered by OpenRouter Free Models
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight fade-in-up fade-in-up-1">
            Understand Any Code
            <br />
            <span className="gradient-text">Instantly with AI</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed fade-in-up fade-in-up-2">
            Paste a code snippet, choose your language, and get a structured,
            beginner-friendly explanation in seconds.
          </p>
        </div>

        {/* Input card */}
        <div className="space-y-4 mb-6 fade-in-up fade-in-up-3">
          {/* Language selector */}
          <div className="flex items-center gap-3">
            <div className="w-44 shrink-0">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Language
              </label>
              <LanguageDropdown value={language} onChange={setLanguage} />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Code Snippet
              </label>
              {/* spacer — editor below spans full width */}
              <div className="h-[48px]" />
            </div>
          </div>
          <div className="-mt-2">
            <CodeEditor value={code} onChange={setCode} />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 mb-8 fade-in-up fade-in-up-4">
          <button
            id="explain-btn"
            onClick={handleExplain}
            disabled={loading}
            className={`flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 ${
              loading
                ? 'opacity-60 cursor-not-allowed bg-gradient-to-r from-brand-700 to-accent-600'
                : 'bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-400 hover:to-accent-400 hover:shadow-xl hover:shadow-brand-500/30 active:scale-[0.98]'
            }`}
          >
            <Sparkles size={16} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Analyzing...' : 'Explain Code'}
          </button>

          {result && (
            <button
              id="reset-btn"
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-3.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white glass-card hover:border-[rgba(255,255,255,0.12)] transition-all duration-200"
            >
              <RotateCcw size={15} />
              Reset
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && <Loading />}

        {/* Error state */}
        {error && !loading && (
          <div id="error-state" className="fade-in-up glass-card rounded-2xl p-5 flex items-start gap-3 border-l-4 border-red-500/60">
            <div className="w-8 h-8 rounded-lg bg-[rgba(248,113,113,0.1)] border border-[rgba(248,113,113,0.2)] flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle size={15} className="text-red-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-400 mb-0.5">Something went wrong</p>
              <p className="text-sm text-slate-400">{error}</p>
              <button
                id="retry-btn"
                onClick={handleExplain}
                className="mt-3 text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors"
              >
                Try again →
              </button>
            </div>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <ResponseCard data={result} language={language} />
        )}
      </main>

      {/* Footer */}
      <footer className="relative text-center pb-8 text-xs text-slate-600">
        Built with React + Vite · Powered by OpenRouter Free Models
      </footer>
    </div>
  )
}
