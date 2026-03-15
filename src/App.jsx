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

  const handleSelectPlayer = (p) => {
    setSelectedPlayer(p)
    setComparePlayer(null)
  }

  const handleBack = () => {
    setSelectedPlayer(null)
    setComparePlayer(null)
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-400 to-rose-400 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg tracking-tight">Player Similarity Engine</h1>
              <p className="text-xs text-slate-500 -mt-0.5">Recruitment intelligence tool</p>
            </div>
          </div>
          {selectedPlayer && (
            <button onClick={handleBack} className="flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              New search
            </button>
          )}
        </div>
      </header>

      <main className="pb-20">
        {!selectedPlayer ? (
          <div className="max-w-4xl mx-auto px-6 pt-16">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
                Find Similar<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-rose-400">Players</span>
              </h1>
              <p className="text-slate-400 max-w-xl mx-auto">
                Select any player to discover statistically similar profiles across Europe's top leagues.
                Radar charts, percentile rankings, and customisable scouting filters.
              </p>
            </div>

            <div className="flex justify-center mb-10">
              <SearchBar players={players} onSelect={handleSelectPlayer} />
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-4 px-1">Browse by position</h3>
              {Object.entries(POSITIONS).filter(([k]) => k !== 'GK').map(([posKey, posLabel]) => {
                const posPlayers = players.filter(p => p.position === posKey).slice(0, 6)
                if (!posPlayers.length) return null
                return (
                  <div key={posKey} className="mb-6">
                    <h4 className="text-sm text-slate-300 font-medium mb-2">{posLabel}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {posPlayers.map(p => (
                        <PlayerCard key={p.name} player={p} onClick={handleSelectPlayer} compact />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-6 pt-8 animate-fade-in">
            {/* Selected player header */}
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 mb-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">{selectedPlayer.name}</h2>
                    <span className="text-sm px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-medium">
                      {POSITIONS[selectedPlayer.position]}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                    <span>{selectedPlayer.team}</span>
                    <span className="text-slate-600">·</span>
                    <span>{LEAGUES[selectedPlayer.league]}</span>
                    <span className="text-slate-600">·</span>
                    <span>{selectedPlayer.nation}</span>
                    <span className="text-slate-600">·</span>
                    <span>Age {selectedPlayer.age}</span>
                    <span className="text-slate-600">·</span>
                    <span>€{selectedPlayer.marketValue}m</span>
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
                      { label: 'Press', value: selectedPlayer.pressures90 },
                    ].map(s => (
                      <div key={s.label} className="bg-slate-800/50 rounded-lg p-2 text-center">
                        <div className="text-sm font-mono text-cyan-400">{s.value.toFixed(2)}</div>
                        <div className="text-[10px] text-slate-500">{s.label}</div>
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
                    <div className="flex justify-center gap-4 mt-1 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
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
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-sm font-semibold text-white">Scouting Filters</h3>
                <span className="text-xs text-slate-500">Narrow down similar players</span>
              </div>
              <Filters filters={filters} onChange={setFilters} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Similar players list */}
              <div className="lg:col-span-1">
                <h3 className="text-sm font-semibold text-white mb-3">
                  Similar Players
                  <span className="text-slate-500 font-normal ml-2">({similarPlayers.length})</span>
                </h3>
                <div className="space-y-2">
                  {similarPlayers.map(p => (
                    <PlayerCard
                      key={p.name}
                      player={p}
                      similarity={p.similarity}
                      onClick={setComparePlayer}
                      compact
                    />
                  ))}
                  {similarPlayers.length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-8">No matching players found. Try adjusting filters.</p>
                  )}
                </div>
              </div>

              {/* Stat comparison */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white">
                    Percentile Rankings
                    {comparePlayer && <span className="text-slate-500 font-normal ml-2">vs {comparePlayer.name}</span>}
                  </h3>
                  {comparePlayer && (
                    <button
                      onClick={() => setComparePlayer(null)}
                      className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      Clear comparison
                    </button>
                  )}
                </div>
                <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                  <StatComparison
                    player={selectedPlayer}
                    comparePlayer={comparePlayer}
                    allPlayers={players}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="mt-16 pt-8 border-t border-slate-800/50 text-center pb-8">
              <p className="text-xs text-slate-600">
                Player statistics are modelled on publicly available per-90 data from FBref/StatsBomb for the 2024/25 season.
                Built by <a href="https://www.linkedin.com/in/mjduplessis" target="_blank" rel="noopener" className="text-slate-500 hover:text-cyan-400 transition-colors">MJ du Plessis</a>.
              </p>
            </footer>
          </div>
        )}
      </main>
    </div>
  )
}
