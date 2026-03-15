import { POSITIONS, LEAGUES } from '../data/players'

export default function PlayerCard({ player, onClick, similarity, compact = false }) {
  if (!player) return null
  const simPct = similarity ? Math.round(similarity * 100) : null

  return (
    <button
      onClick={() => onClick?.(player)}
      className={`group w-full text-left glow-border rounded-xl transition-all duration-300 hover:bg-white/[0.03] ${
        compact ? 'glass-subtle p-3.5' : 'glass p-5'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`text-white font-semibold group-hover:text-violet-300 transition-colors duration-300 truncate ${
              compact ? 'text-[13px]' : 'text-[14px]'
            }`}>
              {player.name}
            </h3>
            <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-md bg-white/[0.04] text-slate-500 font-mono font-medium">
              {player.age}
            </span>
          </div>
          <div className={`text-slate-400 mt-0.5 flex items-center gap-1.5 ${compact ? 'text-[11px]' : 'text-[12px]'}`}>
            <span>{player.team}</span>
            <span className="text-slate-700">·</span>
            <span className="text-slate-500">{LEAGUES[player.league] || player.league}</span>
          </div>
          {!compact && (
            <div className="flex items-center gap-2.5 mt-2.5 text-[11px]">
              <span className="px-2 py-0.5 rounded-full bg-violet-400/[0.08] text-violet-300 font-semibold tracking-wide">
                {POSITIONS[player.position] || player.position}
              </span>
              <span className="text-slate-500">{player.nation}</span>
              <span className="text-slate-600 font-mono">€{player.marketValue}m</span>
            </div>
          )}
        </div>

        {simPct !== null && (
          <div className="shrink-0 text-right">
            <div className={`text-lg font-bold font-mono tracking-tight ${
              simPct >= 97 ? 'text-emerald-400' :
              simPct >= 95 ? 'text-cyan-300' :
              simPct >= 90 ? 'text-violet-300' :
              'text-slate-400'
            }`}>
              {simPct}%
            </div>
            <div className="text-[9px] text-slate-600 uppercase tracking-wider font-semibold">match</div>
          </div>
        )}
      </div>

      {!compact && (
        <div className="mt-3.5 grid grid-cols-4 gap-2">
          {[
            { label: 'Goals', value: player.goals90 },
            { label: 'Assists', value: player.assists90 },
            { label: 'xG', value: player.xG90 },
            { label: 'Key Pass', value: player.keyPasses90 },
          ].map(s => (
            <div key={s.label} className="bg-white/[0.02] rounded-lg py-2 text-center border border-white/[0.03]">
              <div className="text-[12px] font-mono text-violet-300 font-semibold">{s.value.toFixed(2)}</div>
              <div className="text-[9px] text-slate-600 mt-0.5 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </button>
  )
}
