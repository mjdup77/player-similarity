import { computePercentiles, getPercentile } from '../utils/similarity'

const STAT_GROUPS = [
  {
    label: 'Attacking',
    icon: '⚡',
    stats: [
      { key: 'goals90', label: 'Goals per 90' },
      { key: 'xG90', label: 'xG per 90' },
      { key: 'shots90', label: 'Shots per 90' },
      { key: 'assists90', label: 'Assists per 90' },
      { key: 'xA90', label: 'xA per 90' },
    ]
  },
  {
    label: 'Creativity',
    icon: '🎯',
    stats: [
      { key: 'keyPasses90', label: 'Key passes per 90' },
      { key: 'throughBalls90', label: 'Through balls per 90' },
      { key: 'passesIntoPenArea90', label: 'Passes into box per 90' },
      { key: 'crossesIntoBox90', label: 'Crosses into box per 90' },
    ]
  },
  {
    label: 'Progression',
    icon: '🔄',
    stats: [
      { key: 'progressivePasses90', label: 'Progressive passes per 90' },
      { key: 'progressiveCarries90', label: 'Progressive carries per 90' },
      { key: 'passesIntoFinalThird90', label: 'Passes into final 3rd per 90' },
      { key: 'dribbles90', label: 'Dribbles per 90' },
      { key: 'dribbleSuccess', label: 'Dribble success %' },
    ]
  },
  {
    label: 'Defending',
    icon: '🛡️',
    stats: [
      { key: 'tackles90', label: 'Tackles per 90' },
      { key: 'interceptions90', label: 'Interceptions per 90' },
      { key: 'pressures90', label: 'Pressures per 90' },
      { key: 'aerialWins90', label: 'Aerial wins per 90' },
    ]
  },
  {
    label: 'Passing',
    icon: '📐',
    stats: [
      { key: 'passCompletion', label: 'Pass completion %' },
      { key: 'touches90', label: 'Touches per 90' },
    ]
  },
]

function PercentileBar({ pct, value, comparePct, compareValue }) {
  const gradient =
    pct >= 90 ? 'linear-gradient(90deg, rgba(52,211,153,0.4), rgba(52,211,153,0.8))'
    : pct >= 70 ? 'linear-gradient(90deg, rgba(167,139,250,0.3), rgba(167,139,250,0.7))'
    : pct >= 40 ? 'linear-gradient(90deg, rgba(251,191,36,0.3), rgba(251,191,36,0.6))'
    : 'linear-gradient(90deg, rgba(251,113,133,0.3), rgba(251,113,133,0.6))'

  const textColor =
    pct >= 90 ? 'text-emerald-400'
    : pct >= 70 ? 'text-violet-300'
    : pct >= 40 ? 'text-amber-400'
    : 'text-rose-400'

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-[5px] bg-white/[0.03] rounded-full overflow-hidden relative">
        <div
          className="h-full rounded-full stat-bar-fill transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, background: gradient }}
        />
        {comparePct !== undefined && (
          <div className="absolute top-0 h-full w-[2px] rounded-full bg-rose-400/70 transition-all duration-500"
            style={{ left: `${comparePct}%` }} />
        )}
      </div>
      <span className="w-10 text-right text-[12px] font-mono text-slate-300 font-medium tabular-nums">
        {typeof value === 'number' ? value.toFixed(2) : value}
      </span>
      {compareValue !== undefined && (
        <span className="w-10 text-right text-[12px] font-mono text-rose-300 font-medium tabular-nums">
          {typeof compareValue === 'number' ? compareValue.toFixed(2) : compareValue}
        </span>
      )}
      <span className={`w-9 text-right text-[10px] font-mono font-semibold ${textColor}`}>
        {pct}<span className="text-slate-600 font-normal">th</span>
      </span>
    </div>
  )
}

export default function StatComparison({ player, comparePlayer, allPlayers }) {
  const percentileData = computePercentiles(allPlayers)

  return (
    <div className="space-y-8">
      {STAT_GROUPS.map(group => (
        <div key={group.label}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm opacity-70">{group.icon}</span>
            <h4 className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-semibold">{group.label}</h4>
          </div>
          <div className="space-y-3">
            {group.stats.map(({ key, label }) => {
              const pct = getPercentile(player[key], percentileData[key])
              const comparePct = comparePlayer ? getPercentile(comparePlayer[key], percentileData[key]) : undefined
              return (
                <div key={key}>
                  <div className="text-[11px] text-slate-500 mb-1.5 font-medium">{label}</div>
                  <PercentileBar
                    pct={pct} value={player[key]}
                    compareValue={comparePlayer?.[key]} comparePct={comparePct}
                  />
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
