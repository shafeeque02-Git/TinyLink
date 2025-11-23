import React, { useMemo, useState } from 'react'

export default function LinkTable({ links = [], createLink, deleteById, updateLink, setQrFor, selected, setSelected, onOpenStats, onVisitLink }) {
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [createdDate, setCreatedDate] = useState('')

  const tags = useMemo(() => {
    const s = new Set();
    links.forEach(l => { if (l.tags) l.tags.split(',').forEach(t => s.add(t.trim())) })
    return Array.from(s).sort()
  }, [links])

  const filtered = links.filter(l => {
    const q = search.toLowerCase()
    if (q && !((l.short_code||'').toLowerCase().includes(q) || (l.target_url||'').toLowerCase().includes(q) || (l.description||'').toLowerCase().includes(q))) return false
    if (tagFilter && !(l.tags || '').split(',').map(t=>t.trim()).includes(tagFilter)) return false
    return true
  })

  return (
    <div>
      <div className="flex gap-3 mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by code, URL or description..." className="flex-1 p-2 border rounded" />
        <select value={tagFilter} onChange={e => setTagFilter(e.target.value)} className="p-2 border rounded">
          <option value="">All Tags</option>
          {tags.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        {/* Add new link button should be here if present */}
      </div>

      {/* Filter by Created Date feature moved here */}
      <div className="flex gap-3 mb-4">
        <button className="px-2 py-1 bg-blue-500 text-white rounded" onClick={() => setShowDatePicker(s => !s)}>
          Filter by Created Date
        </button>
        {showDatePicker && (
          <>
            <input
              type="datetime-local"
              value={createdDate}
              onChange={e => setCreatedDate(e.target.value)}
              className="p-2 border rounded"
              style={{ zIndex: 10 }}
            />
            {createdDate && (
              <button className="ml-2 px-2 py-1 bg-gray-300 rounded" onClick={() => setCreatedDate('')}>
                Clear
              </button>
            )}
          </>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="text-left">
            <tr className="border-b">
              <th className="p-2">#</th>
              <th className="p-2">Short Code</th>
              <th className="p-2">Target URL</th>
              <th className="p-2">Tags</th>
              <th className="p-2">Clicks</th>
              <th className="p-2">Last Clicked</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={7} className="p-4 text-center text-slate-500">No links</td></tr>}
            {filtered.map((l, idx) => (
              <tr key={l.__backendId || l.short_code} className="hover:bg-slate-50">
                <td className="p-2">
                  <input type="checkbox" checked={selected.has(String(l.__backendId || l.short_code))} onChange={(e) => {
                    const id = String(l.__backendId || l.short_code)
                    const s = new Set(selected)
                    if (e.target.checked) s.add(id); else s.delete(id)
                    setSelected(s)
                  }} />
                </td>
                <td className="p-2 font-mono text-indigo-600 cursor-pointer" onClick={() => onOpenStats ? onOpenStats(l) : setQrFor(l.short_code)}>{l.short_code}</td>
                <td className="p-2 max-w-sm truncate" title={l.target_url}>{l.target_url}</td>
                <td className="p-2">
                  {l.tags ? l.tags.split(',').map(t => <span key={t} className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded mr-1 text-xs">{t.trim()}</span>) : '-'}
                </td>
                <td className="p-2">{l.total_clicks || 0}</td>
                <td className="p-2">{l.last_clicked ? new Date(l.last_clicked).toLocaleString() : 'Never'}</td>
                <td className="p-2">
                  <button className="px-2 py-1 bg-orange-400 text-white rounded mr-2" onClick={() => setQrFor(l.short_code)}>QR</button>
                  <button className="px-2 py-1 bg-red-400 text-white rounded" onClick={() => deleteById(l.__backendId || l.short_code)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
