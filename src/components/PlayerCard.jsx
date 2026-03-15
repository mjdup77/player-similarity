import { POSITIONS, LEAGUES } from '../data/players'

export default function PlayerCard({ player, onClick, similarity, compact = false }) {
  if (!player) return null

  const simPct = similarity ? Math.round(similarity * 100) : null

  return (
    <button
      onClick={() => onClick?.(player)}
      className={`w-full text-left bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 rounded-xl transition-all group ${
        compact ? 'p-3' : 'p-4'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`text-white font-semibold group-hover:text-cyan-400 transition-colors truncate ${compact ? 'text-sm' : 'text-base'}`}>
              {player.name}
            </h3>
            <span className="shrink-0 text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
              {player.age}
            </span>
          </div>
          <div className={`text-slate-400 mt-0.5 flex items-center gap-2 ${compact ? 'text-xs' : 'text-sm'}`}>
            <span>{player.team}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-500">{LEAGUES[player.league] || player.league}</span>
          </div>
          {!compact && (
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-medium">
                {POSITIONS[player.position] || player.position}
              </span>
              <span className="text-slate-500">{player.nation}</span>
              <span className="text-slate-600">€{player.marketValue}m</span>
            </div>
          )}
        </div>

        {simPct !== null && (
          <div className="shrink-0 ml-3 text-right">
            <div className={`text-lg font-bold font-mono ${
              simPct >= 95 ? 'text-emerald-400' :
              simPct >= 90 ? 'text-cyan-400' :
              simPct >= 85 ? 'text-amber-400' :
              'text-slate-400'
            }`}>
              {simPct}%
            </div>
            <div className="text-xs text-slate-600">match</div>
          </div>
        )}
      </div>

      {!compact && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {[
            { label: 'Goals', value: player.goals90 },
            { label: 'Assists', value: player.assists90 },
            { label: 'xG', value: player.xG90 },
            { label: 'Key Pass', value: player.keyPasses90 },
          ].map(s => (
            <div key={s.label} className="text-center bg-slate-800/50 rounded-lg py-1.5">
              <div className="text-xs font-mono text-cyan-400">{s.value.toFixed(2)}</div>
              <div className="text-[10px] text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </button>
  )
}
