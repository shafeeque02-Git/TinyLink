// Lightweight auth client for communicating with NextAuth server
// Assumes NextAuth server runs at http://localhost:3000
const AUTH_SERVER = process.env.VITE_AUTH_SERVER || 'http://localhost:3000'

export async function fetchCsrf() {
  const res = await fetch(`${AUTH_SERVER}/api/auth/csrf`, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch CSRF token')
  const data = await res.json()
  return data.csrfToken
}

export async function signInWithCredentials({ email, password, callbackUrl }) {
  // NextAuth expects a form POST to /api/auth/callback/credentials with fields: csrfToken, email, password, callbackUrl
  const csrfToken = await fetchCsrf()
  const form = new URLSearchParams()
  form.set('csrfToken', csrfToken)
  form.set('email', email)
  form.set('password', password)
  if (callbackUrl) form.set('callbackUrl', callbackUrl)

  const res = await fetch(`${AUTH_SERVER}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
    credentials: 'include'
  })

  // NextAuth will typically redirect on success; when called via fetch it may return HTML.
  // We'll treat non-OK as failure.
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || 'Sign-in failed')
  }

  return res
}

export function signInWithGoogle({ callbackUrl }) {
  const cb = encodeURIComponent(callbackUrl || window.location.href)
  // Redirect the browser to NextAuth sign-in for Google
  window.location.href = `${AUTH_SERVER}/api/auth/signin/google?callbackUrl=${cb}`
}

export async function fetchMe() {
  const res = await fetch(`${AUTH_SERVER}/api/auth/session`, { credentials: 'include' })
  if (!res.ok) return null
  return res.json()
}

export async function signOut() {
  await fetch(`${AUTH_SERVER}/api/auth/signout`, { method: 'POST', credentials: 'include' })
}

export default { fetchCsrf, signInWithCredentials, signInWithGoogle, fetchMe, signOut }
