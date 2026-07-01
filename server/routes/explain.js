import express from 'express'

export const explainRoute = express.Router()

// ─── Config ────────────────────────────────────────────────────────────────
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL              = process.env.OPENROUTER_MODEL || 'openrouter/free'
const MAX_CODE_LENGTH    = 10_000

// ─── Prompt builder ─────────────────────────────────────────────────────────
function buildPrompt(code, language) {
  return `You are an expert programming tutor. A user has shared a ${language} code snippet and wants a detailed, beginner-friendly explanation.

Analyze the following ${language} code carefully and respond with a JSON object (and ONLY the JSON object — no markdown fences, no extra text) that has exactly these keys:

{
  "summary": "A concise 2-4 sentence overview of what this code does and its purpose.",
  "lineByLine": "A detailed explanation of each meaningful line or block, using numbered steps or bullet points. Mention variable names, function calls, control flow, etc.",
  "timeComplexity": "The Big-O time complexity with a brief explanation of why.",
  "spaceComplexity": "The Big-O space complexity with a brief explanation of why.",
  "suggestions": "2-4 concrete improvement suggestions covering readability, performance, error handling, or best practices.",
  "difficulty": "One of: Beginner, Intermediate, or Advanced — with a one-sentence justification."
}

Here is the ${language} code:

\`\`\`${language.toLowerCase()}
${code}
\`\`\`

Remember: respond ONLY with the raw JSON object. Do not wrap it in markdown code fences.`
}

// ─── JSON extraction helper ──────────────────────────────────────────────────
function extractJSON(raw) {
  // Strip markdown code fences if model ignores the instruction
  const stripped = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim()

  // Try direct parse first
  try {
    return JSON.parse(stripped)
  } catch { /* continue */ }

  // Find the first {...} block
  const match = stripped.match(/\{[\s\S]*\}/)
  if (match) {
    try { return JSON.parse(match[0]) } catch { /* continue */ }
  }

  // Fallback: return the raw text as summary
  return {
    summary:        raw,
    lineByLine:     '',
    timeComplexity: '',
    spaceComplexity:'',
    suggestions:    '',
    difficulty:     'Unknown',
  }
}

// ─── Route ──────────────────────────────────────────────────────────────────
explainRoute.post('/explain', async (req, res) => {
  const { code, language } = req.body

  // Validate
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid "code" field.' })
  }
  if (!language || typeof language !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid "language" field.' })
  }
  if (code.trim().length === 0) {
    return res.status(400).json({ message: 'Code snippet cannot be empty.' })
  }
  if (code.length > MAX_CODE_LENGTH) {
    return res.status(400).json({ message: `Code must be under ${MAX_CODE_LENGTH} characters.` })
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    console.error('OPENROUTER_API_KEY is not set')
    return res.status(500).json({ message: 'Server configuration error. API key is missing.' })
  }

  const prompt = buildPrompt(code.trim(), language)

  // Call OpenRouter
  let openRouterRes
  try {
    openRouterRes = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer':  process.env.FRONTEND_URL || 'http://localhost:5173',
        'X-Title':       'AI Code Explainer',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 3000,
      }),
      signal: AbortSignal.timeout(55_000),
    })
  } catch (err) {
    const isTimeout = err.name === 'TimeoutError' || err.name === 'AbortError'
    console.error('[OpenRouter fetch error]', err.name, err.message)
    return res.status(504).json({
      message: isTimeout
        ? 'OpenRouter request timed out. Please try again.'
        : 'Failed to reach the AI service. Check your connection.',
    })
  }

  if (!openRouterRes.ok) {
    let errBody = {}
    try { errBody = await openRouterRes.json() } catch { /* ignore */ }
    console.error('[OpenRouter API error]', openRouterRes.status, errBody)
    const message =
      errBody?.error?.message ||
      (openRouterRes.status === 429 ? 'Rate limit exceeded. Please wait a moment and try again.' :
       openRouterRes.status === 401 ? 'Invalid API key. Check your OPENROUTER_API_KEY.' :
       `OpenRouter returned status ${openRouterRes.status}.`)
    return res.status(openRouterRes.status >= 500 ? 502 : openRouterRes.status).json({ message })
  }

  let aiData
  try {
    aiData = await openRouterRes.json()
  } catch {
    return res.status(502).json({ message: 'Received invalid response from AI service.' })
  }

  const rawContent = aiData?.choices?.[0]?.message?.content
  if (!rawContent) {
    return res.status(502).json({ message: 'AI returned an empty response. Please try again.' })
  }

  const explanation = extractJSON(rawContent)
  return res.json(explanation)
})
