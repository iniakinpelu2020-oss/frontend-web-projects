import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const submissions = []

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body || {}
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ ok: false, error: 'Please provide a valid name.' })
  }
  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: 'Please provide a valid email address.' })
  }
  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    return res.status(400).json({ ok: false, error: 'Please provide a project message (at least 10 characters).' })
  }

  const entry = {
    id: Date.now(),
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    receivedAt: new Date().toISOString(),
  }
  submissions.push(entry)
  console.log('Contact submission:', entry)

  return res.json({ ok: true, message: 'Message received. I will get back to you shortly.' })
})

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
