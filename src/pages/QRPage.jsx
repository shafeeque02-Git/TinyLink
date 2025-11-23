import React, { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

export default function QRPage({ links = [], onVisit }) {
  const [selected, setSelected] = useState(links[0] ? (links[0].short_code || links[0].__backendId) : '')

  const link = links.find(l => String(l.short_code) === String(selected) || String(l.__backendId) === String(selected))
  const url = link ? `${location.origin}/${link.short_code}` : ''

  return (
    <div>
      <h2 style={{marginTop:0}}>QR Codes</h2>
      {links.length === 0 ? (
        <div className="empty-state">No links yet</div>
      ) : (
        <div style={{display:'flex',gap:'1rem',alignItems:'flex-start'}}>
          <div style={{minWidth:220}}>
            <label style={{fontWeight:700}}>Select Link</label>
            <select value={selected} onChange={e=>setSelected(e.target.value)} style={{width:'100%',padding:8,borderRadius:8}}>
              {links.map(l => <option key={l.__backendId || l.short_code} value={l.short_code || l.__backendId}>{l.short_code} — {l.target_url}</option>)}
            </select>
            {link && (
              <div style={{marginTop:12}}>
                <div style={{fontSize:12,color:'#6b7280'}}>Clicks: <strong>{link.total_clicks || 0}</strong></div>
                <div style={{fontSize:12,color:'#6b7280'}}>Last clicked: <strong>{link.last_clicked ? new Date(link.last_clicked).toLocaleString() : 'Never'}</strong></div>
                <div style={{marginTop:8}}>
                  <button className="test-link-btn" onClick={() => onVisit && onVisit(link)}>Open Link</button>
                </div>
              </div>
            )}
          </div>

          <div style={{flex:1,display:'flex',justifyContent:'center',alignItems:'center'}}>
            {link ? (
              <div style={{textAlign:'center'}}>
                <div style={{display:'inline-block',padding:12,borderRadius:12,background:'#fff'}}>
                  <QRCodeCanvas value={url} size={220} />
                </div>
                <div style={{marginTop:12}}><a href={url} target="_blank" rel="noreferrer">{url}</a></div>
              </div>
            ) : <div className="empty-state">Select a link to show QR</div>}
          </div>
        </div>
      )}
    </div>
  )
}
