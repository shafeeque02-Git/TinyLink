import React, { useEffect, useState, useCallback } from 'react'
import LinkTable from './components/LinkTable'
import AddModal from './components/AddModal'
import QRModal from './components/QRModal'
import NewLinkPage from './pages/NewLinkPage'
import LinksPage from './pages/LinksPage'
import QRPage from './pages/QRPage'

const LOCAL_STORAGE_KEY = 'ls_links_v1'

export default function App() {
    const [showDateFilter, setShowDateFilter] = useState(false);
    const [showStatusFilter, setShowStatusFilter] = useState(false);
    const [dateFilter, setDateFilter] = useState({from: '', to: ''});
    const [statusFilter, setStatusFilter] = useState('');
  const [view, setView] = useState('home') // 'home' | 'links' | 'qr' | 'new'
  const [links, setLinks] = useState([])
  const [selected, setSelected] = useState(new Set())
  const [showAdd, setShowAdd] = useState(false)
  const [qrFor, setQrFor] = useState(null)
  const [statsFor, setStatsFor] = useState(null)
  const [dark, setDark] = useState(localStorage.getItem('darkMode') === 'true')

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]')
    setLinks(stored)
  }, [])

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(links))
  }, [links])

  useEffect(() => {
    document.body.classList.toggle('dark-mode', dark)
    localStorage.setItem('darkMode', dark)
  }, [dark])

  const createLink = useCallback(async (link) => {
    setLinks(prev => [{ ...link, __backendId: Date.now() }, ...prev])
  }, [])

  const deleteById = useCallback(async (backendId) => {
    setLinks(prev => prev.filter(p => String(p.__backendId) !== String(backendId)))
    setSelected(new Set())
  }, [])

  const updateLink = useCallback(async (updated) => {
    setLinks(prev => prev.map(p => p.short_code === updated.short_code ? updated : p))
  }, [])

  const visitLink = useCallback(async (link) => {
    // record click then open the target
    setLinks(prev => prev.map(p => {
      const idA = String(p.__backendId || p.short_code)
      const idB = String(link.__backendId || link.short_code)
      if (idA === idB) {
        return { ...p, total_clicks: (p.total_clicks || 0) + 1, last_clicked: Date.now() }
      }
      return p
    }))
    // update stats view to reflect new counts
    setStatsFor(prev => {
      if (!prev) return prev
      const idA = String(prev.__backendId || prev.short_code)
      const idB = String(link.__backendId || link.short_code)
      if (idA === idB) return { ...prev, total_clicks: (prev.total_clicks || 0) + 1, last_clicked: Date.now() }
      return prev
    })
    // open URL
    try { window.open(link.target_url, '_blank') } catch (e) {}
  }, [])

  const openStats = useCallback((link) => {
    setStatsFor(link)
  }, [])

  const bulkDelete = useCallback(async () => {
    const ids = Array.from(selected)
    for (const id of ids) {
      await deleteById(id)
    }
    setSelected(new Set())
  }, [selected, deleteById])

  return (
    <>
      <div className="container app-shell">
      <aside className="sidebar">
        <button className="add-btn sidebar-add-btn" style={{width:'100%',marginBottom:'1rem'}} onClick={() => setView('new')}>➕</button>
        <div className="nav-item sidebar-icon" title="Home" onClick={() => setView('home')}>
          <span role="img" aria-label="Home">🏠</span>
          <span className="sidebar-label">Home</span>
        </div>
        <div className="nav-item sidebar-icon" title="Links" onClick={() => setView('links')}>
          <span role="img" aria-label="Links">🔗</span>
          <span className="sidebar-label">Links</span>
        </div>
        <div className="nav-item sidebar-icon" title="QR Codes" onClick={() => setView('qr')}>
          <span role="img" aria-label="QR Codes">📱</span>
          <span className="sidebar-label">QR Codes</span>
        </div>
      </aside>

      <main className="main-area">
        <div className="header">
        <div className="header-left">
          <h1 id="dashboard-title">Tiny Link</h1>
          <button className="theme-toggle" id="theme-toggle" onClick={() => setDark(d => !d)}>{dark ? '☀' : '🌙'}</button>
        </div>
        <div className="header-actions">
          <button className="add-btn" id="add-btn" onClick={() => setShowAdd(true)}>+ Add New Link</button>
          <button className="filter-btn" id="filter-date-btn" style={{marginLeft:'8px'}} onClick={() => setShowDateFilter(true)}>📅 Filter by Created Date</button>
          <button className="filter-btn" id="filter-btn" style={{marginLeft:'8px'}} onClick={() => setShowStatusFilter(true)}>🔍 Filter</button>
          <button className="bulk-delete-btn" id="bulk-delete-btn" onClick={bulkDelete}>🗑 Delete Selected</button>
              {showDateFilter && (
                <div className="modal-overlay" onClick={() => setShowDateFilter(false)}>
                  <div className="modal" onClick={e => e.stopPropagation()}>
                    <h3>Filter by Created Date</h3>
                    <label>From: <input type="date" value={dateFilter.from} onChange={e => setDateFilter(f => ({...f, from: e.target.value}))} /></label>
                    <label>To: <input type="date" value={dateFilter.to} onChange={e => setDateFilter(f => ({...f, to: e.target.value}))} /></label>
                    <button className="add-btn" style={{marginTop:'1rem'}} onClick={() => setShowDateFilter(false)}>Apply</button>
                  </div>
                </div>
              )}
              {showStatusFilter && (
                <div className="modal-overlay" onClick={() => setShowStatusFilter(false)}>
                  <div className="modal" onClick={e => e.stopPropagation()}>
                    <h3>Filter Links</h3>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{width:'100%',padding:'0.5em',margin:'1em 0'}}>
                      <option value="">All</option>
                      <option value="clicked">Clicked</option>
                      <option value="never">Never Clicked</option>
                    </select>
                    <button className="add-btn" style={{marginTop:'1rem'}} onClick={() => setShowStatusFilter(false)}>Apply</button>
                  </div>
                </div>
              )}
        </div>
        </div>

        <div className="main-content">
          {view === 'home' && (
            <div>
              {links && links.length > 0 && (
                <div style={{marginTop:20}}>
                  <h3 style={{marginBottom:8}}>Recent Links</h3>
                  <div style={{display:'grid',gap:10}}>
                    {links.slice(0,5).map(l => (
                      <div key={l.__backendId || l.short_code} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:12,borderRadius:10,background:'linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0.45))'}}>
                        <div style={{minWidth:0}}>
                          <div style={{display:'flex',gap:8,alignItems:'center'}}>
                            <div className="code-cell" style={{cursor:'pointer'}} onClick={() => openStats(l)}>{l.short_code}</div>
                            <div className="muted" style={{fontSize:12,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} title={l.target_url}>{l.target_url}</div>
                          </div>
                          <div style={{fontSize:12,color:'#6b7280',marginTop:6}}>Created: {l.created_at ? new Date(l.created_at).toLocaleString() : '-'}</div>
                        </div>
                        <div style={{display:'flex',gap:8,alignItems:'center'}}>
                          <div className="muted" style={{fontSize:13}}>Clicks: <strong>{l.total_clicks || 0}</strong></div>
                          <div className="muted" style={{fontSize:12}}>{l.last_clicked ? new Date(l.last_clicked).toLocaleString() : 'Never'}</div>
                          <button className="test-link-btn" onClick={() => visitLink(l)}>Open</button>
                          <button className="qr-btn" onClick={() => setQrFor(l.short_code)}>QR</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {view === 'links' && (
            <LinksPage
              links={links.filter(l => {
                if (dateFilter.from && (!l.created_at || new Date(l.created_at) < new Date(dateFilter.from))) return false;
                if (dateFilter.to && (!l.created_at || new Date(l.created_at) > new Date(dateFilter.to))) return false;
                if (statusFilter === 'clicked' && !(l.total_clicks > 0)) return false;
                if (statusFilter === 'never' && (l.total_clicks > 0)) return false;
                return true;
              })}
              createLink={createLink}
              deleteById={deleteById}
              updateLink={updateLink}
              setQrFor={setQrFor}
              selected={selected}
              setSelected={setSelected}
              onOpenStats={openStats}
              onVisitLink={visitLink}
            />
          )}

          {view === 'qr' && (
            <QRPage links={links} onVisit={visitLink} />
          )}

          {view === 'new' && (
            <NewLinkPage onCreate={async (data) => { await createLink(data); setView('links') }} />
          )}

          {links.length === 0 && !statsFor && view !== 'links' && (
            <div className="empty-state" id="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
              <h3>No links yet</h3>
              <p>Create your first short link to get started!</p>
            </div>
          )}

          {statsFor ? (
            <div className="stats-view">
              <button className="back-btn" onClick={() => setStatsFor(null)}>← Back to Dashboard</button>
              <div className="stats-header">
                <h2>{statsFor.short_code}</h2>
                <div className="short-url-display"><span>{location.origin}/{statsFor.short_code}</span></div>
                <div className="stats-actions">
                  <button className="copy-btn" onClick={() => { navigator.clipboard.writeText(`${location.origin}/${statsFor.short_code}`) }}>📋 Copy</button>
                  <button className="test-link-btn" onClick={() => visitLink(statsFor)}>🔗 Test Link</button>
                  <button className="qr-btn" onClick={() => setQrFor(statsFor.short_code)}>📱 Show QR Code</button>
                </div>
              </div>
              <div className="stats-grid">
                <div className="stat-card"><div className="stat-label">Total Clicks</div><p className="stat-value">{statsFor.total_clicks || 0}</p></div>
                <div className="stat-card"><div className="stat-label">Last Clicked</div><p className="stat-value">{statsFor.last_clicked ? new Date(statsFor.last_clicked).toLocaleString() : 'Never'}</p></div>
                <div className="stat-card"><div className="stat-label">Created</div><p className="stat-value">{statsFor.created_at ? new Date(statsFor.created_at).toLocaleString() : '-'}</p></div>
              </div>
              <div className="target-url-section"><h3>Target URL</h3><a href={statsFor.target_url} target="_blank" rel="noopener noreferrer" className="target-url-link">{statsFor.target_url}</a></div>
            </div>
          ) : null}
        </div>
      </main>
      {showAdd && <AddModal onClose={() => setShowAdd(false)} onCreate={async (data) => { await createLink(data); setShowAdd(false); }} />}
      {qrFor && <QRModal code={qrFor} onClose={() => setQrFor(null)} />}
    </div>
  </>);
}
