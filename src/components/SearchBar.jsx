import { useState, useRef, useEffect } from 'react'

export default function SearchBar({ players, onSelect, placeholder = 'Search for a player...' }) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  const filtered = query.length > 0
    ? players.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.team.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : []

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative w-full max-w-lg">
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true) }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-700 focus:border-cyan-500/50 rounded-xl text-white placeholder:text-slate-500 outline-none transition-colors text-sm"
        />
      </div>

      {isOpen && filtered.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50">
          {filtered.map((p, i) => (
            <button
              key={i}
              onClick={() => { onSelect(p); setQuery(''); setIsOpen(false) }}
              className="w-full px-4 py-3 text-left hover:bg-slate-800 transition-colors flex items-center justify-between border-b border-slate-800/50 last:border-0"
            >
              <div>
                <div className="text-sm text-white font-medium">{p.name}</div>
                <div className="text-xs text-slate-500">{p.team} · {p.nation}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400">{p.position}</span>
                <span className="text-xs text-slate-600">{p.age}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
