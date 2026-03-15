import { computePercentiles, getPercentile } from '../utils/similarity'

const STAT_GROUPS = [
  {
    label: 'Attacking',
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
    stats: [
      { key: 'keyPasses90', label: 'Key passes per 90' },
      { key: 'throughBalls90', label: 'Through balls per 90' },
      { key: 'passesIntoPenArea90', label: 'Passes into box per 90' },
      { key: 'crossesIntoBox90', label: 'Crosses into box per 90' },
    ]
  },
  {
    label: 'Progression',
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
    stats: [
      { key: 'tackles90', label: 'Tackles per 90' },
      { key: 'interceptions90', label: 'Interceptions per 90' },
      { key: 'pressures90', label: 'Pressures per 90' },
      { key: 'aerialWins90', label: 'Aerial wins per 90' },
    ]
  },
  {
    label: 'Passing',
    stats: [
      { key: 'passCompletion', label: 'Pass completion %' },
      { key: 'touches90', label: 'Touches per 90' },
    ]
  },
]

function PercentileBar({ pct, value, compareValue, comparePct }) {
  const color =
    pct >= 90 ? 'bg-emerald-400' :
    pct >= 70 ? 'bg-cyan-400' :
    pct >= 40 ? 'bg-amber-400' :
    'bg-rose-400'

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden relative">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
        {comparePct !== undefined && (
          <div
            className="absolute top-0 h-full w-0.5 bg-rose-400"
            style={{ left: `${comparePct}%` }}
          />
        )}
      </div>
      <span className="w-10 text-right text-xs font-mono text-cyan-400">{typeof value === 'number' ? value.toFixed(2) : value}</span>
      {compareValue !== undefined && (
        <span className="w-10 text-right text-xs font-mono text-rose-400">{typeof compareValue === 'number' ? compareValue.toFixed(2) : compareValue}</span>
      )}
      <span className="w-8 text-right text-[10px] font-mono text-slate-500">{pct}th</span>
    </div>
  )
}

export default function StatComparison({ player, comparePlayer, allPlayers }) {
  const percentileData = computePercentiles(allPlayers)

  return (
    <div className="space-y-6">
      {STAT_GROUPS.map(group => (
        <div key={group.label}>
          <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-3">{group.label}</h4>
          <div className="space-y-2">
            {group.stats.map(({ key, label }) => {
              const pct = getPercentile(player[key], percentileData[key])
              const comparePct = comparePlayer ? getPercentile(comparePlayer[key], percentileData[key]) : undefined
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs text-slate-400">{label}</span>
                  </div>
                  <PercentileBar
                    pct={pct}
                    value={player[key]}
                    compareValue={comparePlayer?.[key]}
                    comparePct={comparePct}
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
