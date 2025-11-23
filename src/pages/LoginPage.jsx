import React, { useState } from 'react'
import { signInWithCredentials, signInWithGoogle } from '../services/auth'

export default function LoginPage({ onLogin, redirectAfterLogin = '/', style }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  function validate() {
    const errs = {}
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errs.email = 'Please enter a valid email'
    if (!password || password.length < 6) errs.password = 'Password must be at least 6 characters'
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!validate()) return
    setLoading(true)
    try {
      // Attempt sign-in via NextAuth credentials callback
      await signInWithCredentials({ email, password, callbackUrl: redirectAfterLogin })
      // On success NextAuth usually redirects the browser. If it didn't, call onLogin
      if (onLogin) onLogin({ username: email, remember: true })
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page" style={style}>
      <div className="login-card">
        <h2>Sign In</h2>
        {error && <div role="alert" className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} aria-describedby={error ? 'error-banner' : undefined}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} aria-invalid={!!fieldErrors.email} />
            {fieldErrors.email && <small className="error-message">{fieldErrors.email}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} aria-invalid={!!fieldErrors.password} />
            {fieldErrors.password && <small className="error-message">{fieldErrors.password}</small>}
          </div>

          <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:12}}>
            <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
            <button type="button" className="submit-btn" onClick={() => signInWithGoogle({ callbackUrl: redirectAfterLogin })} aria-label="Sign in with Google">Sign in with Google</button>
          </div>

          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <a href="#" onClick={(e)=>{e.preventDefault(); alert('Reset flow: open /api/auth/reset or implement server-side reset.')}}>Forgot password?</a>
            <a href="#" onClick={(e)=>{e.preventDefault(); alert('Create account flow: implement registration UI or point to /register')}}>Create account</a>
          </div>
        </form>
      </div>
    </div>
  )
}
