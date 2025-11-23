import React, { useState } from 'react'

export default function AddModal({ onClose, onCreate }) {
  const [target, setTarget] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [custom, setCustom] = useState(false)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const genCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let s = ''
    for (let i=0;i<6;i++) s += chars.charAt(Math.floor(Math.random()*chars.length))
    return s
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!target) return setError('Target URL is required')
    let short = code || genCode()
    if (custom && !/^[a-zA-Z0-9-_]+$/.test(short)) return setError('Custom code invalid')

    setLoading(true)
    try {
      await onCreate({ short_code: short, target_url: target, description, tags, total_clicks: 0, last_clicked: 0, created_at: Date.now() })
    } catch (err) {
      setError('Failed to create')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal active">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Link</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Target URL</label>
            <input value={target} onChange={e=>setTarget(e.target.value)} placeholder="https://example.com" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={description} onChange={e=>setDescription(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input value={tags} onChange={e=>setTags(e.target.value)} />
          </div>
          <div className="checkbox-group">
            <input type="checkbox" checked={custom} onChange={e=>setCustom(e.target.checked)} /> <label>Use custom short code</label>
          </div>
          {custom && <div className="form-group"><label>Custom code</label><input value={code} onChange={e=>setCode(e.target.value)} /></div>}
          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px'}}>
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Short Link'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
