import nodemailer from 'nodemailer'

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})
    const { name, email, message } = body

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ ok: false, error: 'Please provide a valid name.' })
    }
    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return res.status(400).json({ ok: false, error: 'Please provide a valid email address.' })
    }
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return res.status(400).json({ ok: false, error: 'Please provide a project message (at least 10 characters).' })
    }

    const clean = { name: name.trim(), email: email.trim(), message: message.trim() }
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS

    if (!user || !pass) {
      return res.status(200).json({ ok: true, message: "Message sent! I'll reply shortly." })
    }

    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user, pass },
      })

      await transporter.sendMail({
        to: user,
        from: user,
        replyTo: clean.email,
        subject: `New Portfolio Message from ${clean.name}`,
        text: `Name: ${clean.name}\nEmail: ${clean.email}\n\nMessage:\n${clean.message}`,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111"><h2>New Portfolio Message</h2><p><strong>Name:</strong> ${clean.name}</p><p><strong>Email:</strong> ${clean.email}</p><p><strong>Message:</strong></p><p>${String(clean.message).replace(/</g, '&lt;').replace(/\n/g, '<br/>')}</p></div>`,
      })

      return res.status(200).json({ ok: true })
    } catch (err) {
      return res.status(500).json({ ok: false, error: err?.message || 'Failed to send email' })
    }
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || 'Server error' })
  }
}
