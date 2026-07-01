import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { explainRoute } from './routes/explain.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env from server/ directory
dotenv.config({ path: join(__dirname, '.env') })
// Also load root .env as fallback (useful for Vercel / production)
dotenv.config({ path: join(__dirname, '..', '.env') })

const app  = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json({ limit: '50kb' }))

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api', explainRoute)

// 404 catch-all
app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' })
})

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('[Server Error]', err)
  res.status(500).json({ message: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`🚀  AI Code Explainer API running on http://localhost:${PORT}`)
})
