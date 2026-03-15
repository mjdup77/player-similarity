import { useState, useRef, useEffect } from 'react'
import { POSITIONS, LEAGUES } from '../data/players'

export default function SearchBar({ players, onSelect, placeholder = 'Search by player name or club...' }) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [focusIdx, setFocusIdx] = useState(-1)
  const ref = useRef(null)
  const inputRef = useRef(null)

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

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusIdx(prev => Math.min(prev + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusIdx(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && focusIdx >= 0 && filtered[focusIdx]) {
      onSelect(filtered[focusIdx])
      setQuery('')
      setIsOpen(false)
      setFocusIdx(-1)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div ref={ref} className="relative w-full max-w-xl">
      <div className="relative group">
        {/* Glow effect behind search bar */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-violet-500/20 via-transparent to-rose-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm" />

        <div className="relative">
          <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-500 group-focus-within:text-violet-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setIsOpen(true); setFocusIdx(-1) }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full pl-13 pr-5 py-4 glass rounded-2xl text-white placeholder:text-slate-500 outline-none transition-all duration-300 text-[14px] focus:shadow-lg focus:shadow-violet-500/5"
          />
        </div>
      </div>

      {isOpen && filtered.length > 0 && (
        <div className="absolute top-full mt-3 w-full glass-strong rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50 animate-scale-in">
          {filtered.map((p, i) => (
            <button
              key={i}
              onClick={() => { onSelect(p); setQuery(''); setIsOpen(false) }}
              className={`w-full px-5 py-3.5 text-left transition-all duration-200 flex items-center justify-between border-b border-white/[0.03] last:border-0 ${
                i === focusIdx ? 'bg-white/[0.05]' : 'hover:bg-white/[0.03]'
              }`}
            >
              <div>
                <div className="text-[13px] text-white font-semibold tracking-tight">{p.name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{p.team} · {p.nation}</div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-400/10 text-violet-400 font-semibold">{p.position}</span>
                <span className="text-[11px] text-slate-600 font-mono">{p.age}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
