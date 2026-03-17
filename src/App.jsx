import { useState } from 'react'
import { players, POSITIONS, LEAGUES } from './data/players'
import { findSimilarPlayers } from './utils/similarity'
import SearchBar from './components/SearchBar'
import PlayerCard from './components/PlayerCard'
import RadarChart from './components/RadarChart'
import StatComparison from './components/StatComparison'
import Filters from './components/Filters'

export default function App() {
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [comparePlayer, setComparePlayer] = useState(null)
  const [filters, setFilters] = useState({ samePosition: true, maxAge: null, maxValue: null, excludeLeagues: [] })

  const similarPlayers = selectedPlayer
    ? findSimilarPlayers(selectedPlayer, players, { ...filters, limit: 10 })
    : []

  const handleSelect = (p) => { setSelectedPlayer(p); setComparePlayer(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const handleBack = () => { setSelectedPlayer(null); setComparePlayer(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return (
    <div className="min-h-screen relative">
      <div className="ambient-glow" />

      <header className="glass-strong sticky top-0 z-50 border-b border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-400 via-rose-400 to-amber-400 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-bold text-[15px] tracking-[-0.01em]">Player Similarity</h1>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide">RECRUITMENT INTELLIGENCE</p>
            </div>
          </div>
          {selectedPlayer && (
            <button onClick={handleBack}
              className="group flex items-center gap-2 text-[13px] text-slate-400 hover:text-white transition-all duration-300 px-4 py-2 rounded-xl hover:bg-white/[0.04]">
              <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              New search
            </button>
          )}
        </div>
      </header>

      <main className="relative z-10 pb-24">
        {!selectedPlayer ? (
          /* ------- HOME ------- */
          <div className="max-w-4xl mx-auto px-6 pt-20">
            <div className="flex flex-col items-center mb-14 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/[0.07] border border-violet-500/[0.12] text-[11px] text-violet-400 font-semibold tracking-wider uppercase mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse-glow" />
                Cosine similarity across per-90 stats
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.03em] text-white mb-6 leading-[1.05] text-center">
                Find Similar<br />
                <span className="text-gradient-violet">Players</span>
              </h1>
              <p className="text-slate-400 max-w-lg text-center text-base leading-relaxed">
                Select any player to discover statistically similar profiles
                across Europe's top leagues. Radar charts, percentile rankings, and scouting filters.
              </p>
            </div>

            <div className="flex justify-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <SearchBar players={players} onSelect={handleSelect} />
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-semibold mb-5 px-1">Browse by position</h3>
              {Object.entries(POSITIONS).filter(([k]) => k !== 'GK').map(([posKey, posLabel]) => {
                const posPlayers = players.filter(p => p.position === posKey).slice(0, 6)
                if (!posPlayers.length) return null
                return (
                  <div key={posKey} className="mb-6">
                    <h4 className="text-[13px] text-slate-300 font-semibold mb-2.5 flex items-center gap-2">
                      {posLabel}
                      <span className="text-[10px] text-slate-600 font-mono font-normal">{posPlayers.length}</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {posPlayers.map(p => (
                        <PlayerCard key={p.name} player={p} onClick={handleSelect} compact />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          /* ------- PLAYER VIEW ------- */
          <div className="max-w-[1400px] mx-auto px-8 pt-10 animate-fade-in-up">
            {/* Header card */}
            <div className="glass rounded-2xl p-8 mb-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-[-0.02em]">{selectedPlayer.name}</h2>
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-violet-400/[0.08] text-violet-300 font-semibold shrink-0">
                      {POSITIONS[selectedPlayer.position]}
                    </span>
                  </div>
                  <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-[13px] text-slate-400 mb-6">
                    {[
                      selectedPlayer.team,
                      LEAGUES[selectedPlayer.league],
                      selectedPlayer.nation,
                      `Age ${selectedPlayer.age}`,
                      `€${selectedPlayer.marketValue}m`,
                    ].map((item, i) => (
                      <span key={i} className="flex items-center gap-3">
                        {i > 0 && <span className="w-1 h-1 rounded-full bg-slate-700 shrink-0" />}
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {[
                      { label: 'Goals', value: selectedPlayer.goals90 },
                      { label: 'Assists', value: selectedPlayer.assists90 },
                      { label: 'xG', value: selectedPlayer.xG90 },
                      { label: 'xA', value: selectedPlayer.xA90 },
                      { label: 'Key Pass', value: selectedPlayer.keyPasses90 },
                      { label: 'Dribbles', value: selectedPlayer.dribbles90 },
                      { label: 'Tackles', value: selectedPlayer.tackles90 },
                      { label: 'Pressing', value: selectedPlayer.pressures90 },
                    ].map(s => (
                      <div key={s.label} className="bg-white/[0.03] rounded-xl p-2.5 text-center border border-white/[0.03]">
                        <div className="text-[13px] font-mono text-violet-300 font-semibold">{s.value.toFixed(2)}</div>
                        <div className="text-[9px] text-slate-600 mt-0.5 uppercase tracking-wider font-medium">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full lg:w-80 shrink-0">
                  <RadarChart
                    player={selectedPlayer}
                    allPlayers={players}
                    comparePlayer={comparePlayer}
                    size={280}
                  />
                  {comparePlayer && (
                    <div className="flex justify-center gap-5 mt-1 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-violet-400" />
                        <span className="text-slate-400">{selectedPlayer.name.split(' ').pop()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                        <span className="text-slate-400">{comparePlayer.name.split(' ').pop()}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="glass rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-[13px] font-semibold text-white">Scouting Filters</h3>
                <span className="text-[11px] text-slate-500">Narrow your shortlist</span>
              </div>
              <Filters filters={filters} onChange={setFilters} />
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <h3 className="text-[13px] font-semibold text-white mb-3 flex items-center gap-2">
                  Similar Players
                  <span className="text-[11px] text-slate-600 font-mono font-normal">{similarPlayers.length}</span>
                </h3>
                <div className="space-y-2">
                  {similarPlayers.map(p => (
                    <PlayerCard key={p.name} player={p} similarity={p.similarity} onClick={setComparePlayer} compact />
                  ))}
                  {similarPlayers.length === 0 && (
                    <div className="glass rounded-xl p-8 text-center">
                      <p className="text-[13px] text-slate-500">No matching players. Try adjusting filters.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[13px] font-semibold text-white flex items-center gap-2">
                    Percentile Rankings
                    {comparePlayer && (
                      <span className="text-slate-500 font-normal">vs {comparePlayer.name}</span>
                    )}
                  </h3>
                  {comparePlayer && (
                    <button onClick={() => setComparePlayer(null)}
                      className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors font-medium">
                      Clear comparison
                    </button>
                  )}
                </div>
                <div className="glass rounded-2xl p-7">
                  <StatComparison player={selectedPlayer} comparePlayer={comparePlayer} allPlayers={players} />
                </div>
              </div>
            </div>

            <footer className="mt-20 pt-10 border-t border-white/[0.04] text-center pb-10">
              <p className="text-[11px] text-slate-600 tracking-wide">
                Statistics modelled on FBref/StatsBomb per-90 data for 2024/25.
                Built by{' '}
                <a href="https://www.linkedin.com/in/mjduplessis" target="_blank" rel="noopener"
                  className="text-slate-500 hover:text-violet-400 transition-colors duration-300">MJ du Plessis</a>.
              </p>
            </footer>
          </div>
        )}
      </main>
    </div>
  )
}
