import React, { useState, useEffect } from 'react'

export default function AccountSettings({ user, onSave }) {
  const [displayName, setDisplayName] = useState(user?.username || '')
  const [bio, setBio] = useState(user?.bio || '')

  useEffect(() => {
    setDisplayName(user?.username || '')
    setBio(user?.bio || '')
  }, [user])

  const save = () => {
    const updated = { ...(user||{}), username: displayName, bio }
    try { localStorage.setItem('ls_user', JSON.stringify(updated)) } catch (e) {}
    if (onSave) onSave(updated)
    alert('Saved account settings')
  }

  return (
    <div style={{padding:20}}>
      <h2>Account Settings</h2>
      <div style={{maxWidth:640,background:'transparent',padding:12}}>
        <div style={{marginBottom:12}}>
          <label style={{display:'block',fontWeight:600,marginBottom:6}}>Display Name / Email</label>
          <input value={displayName} onChange={e=>setDisplayName(e.target.value)} style={{width:'100%',padding:8,borderRadius:8,border:'1px solid #e5e7eb'}} />
        </div>
        <div style={{marginBottom:12}}>
          <label style={{display:'block',fontWeight:600,marginBottom:6}}>Bio</label>
          <textarea value={bio} onChange={e=>setBio(e.target.value)} style={{width:'100%',padding:8,borderRadius:8,border:'1px solid #e5e7eb'}} />
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={save} style={{background:'#4f46e5',color:'white',padding:'8px 12px',borderRadius:8,border:'none'}}>Save</button>
        </div>
      </div>
    </div>
  )
}
