import { getRadarProfile, computePercentiles, getPercentile } from '../utils/similarity'

export default function RadarChart({ player, allPlayers, comparePlayer = null, size = 300 }) {
  const profile = getRadarProfile(player.position)
  const percentileData = computePercentiles(allPlayers)
  const n = profile.length
  const cx = size / 2
  const cy = size / 2
  const radius = size * 0.36

  const angleStep = (2 * Math.PI) / n
  const startAngle = -Math.PI / 2

  const getPoint = (index, value) => {
    const angle = startAngle + index * angleStep
    const r = (value / 100) * radius
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  }

  const buildPath = (values) =>
    values.map((v, i) => {
      const { x, y } = getPoint(i, v)
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ') + ' Z'

  const playerValues = profile.map(({ key }) =>
    getPercentile(player[key], percentileData[key])
  )
  const compareValues = comparePlayer
    ? profile.map(({ key }) => getPercentile(comparePlayer[key], percentileData[key]))
    : null

  const rings = [25, 50, 75, 100]

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-sm mx-auto">
      <defs>
        <radialGradient id="radar-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(167,139,250,0.03)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="player-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="compare-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fb7185" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.05" />
        </linearGradient>
        <filter id="radar-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <circle cx={cx} cy={cy} r={radius * 1.05} fill="url(#radar-bg)" />

      {/* Rings */}
      {rings.map(ring => {
        const points = Array.from({ length: n }, (_, i) => {
          const { x, y } = getPoint(i, ring)
          return `${x},${y}`
        }).join(' ')
        return (
          <polygon key={ring} points={points}
            fill="none" stroke="rgba(255,255,255,0.04)"
            strokeWidth={ring === 50 ? "0.8" : "0.5"}
          />
        )
      })}

      {/* Axis lines */}
      {profile.map((_, i) => {
        const { x, y } = getPoint(i, 100)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
      })}

      {/* Compare fill */}
      {compareValues && (
        <path d={buildPath(compareValues)} fill="url(#compare-fill)" stroke="#fb7185" strokeWidth="1.5" strokeOpacity="0.5" />
      )}

      {/* Player fill */}
      <path d={buildPath(playerValues)} fill="url(#player-fill)" stroke="#a78bfa" strokeWidth="2" strokeOpacity="0.7" filter="url(#radar-glow)" />

      {/* Player dots */}
      {playerValues.map((v, i) => {
        const { x, y } = getPoint(i, v)
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="4" fill="#a78bfa" opacity="0.15" />
            <circle cx={x} cy={y} r="2.5" fill="#a78bfa" stroke="rgba(2,6,23,0.6)" strokeWidth="1" />
          </g>
        )
      })}

      {/* Compare dots */}
      {compareValues?.map((v, i) => {
        const { x, y } = getPoint(i, v)
        return <circle key={`c-${i}`} cx={x} cy={y} r="2" fill="#fb7185" stroke="rgba(2,6,23,0.6)" strokeWidth="0.8" />
      })}

      {/* Labels */}
      {profile.map(({ label }, i) => {
        const { x, y } = getPoint(i, 118)
        const pct = playerValues[i]
        const pctColor = pct >= 90 ? '#34d399' : pct >= 70 ? '#a78bfa' : pct >= 40 ? '#fbbf24' : '#fb7185'
        return (
          <g key={i}>
            <text x={x} y={y - 5} textAnchor="middle" dominantBaseline="middle"
              fill="#64748b" fontSize="8.5" fontFamily="Inter" fontWeight="500" letterSpacing="0.02em">
              {label}
            </text>
            <text x={x} y={y + 6} textAnchor="middle" dominantBaseline="middle"
              fill={pctColor} fontSize="8" fontFamily="JetBrains Mono" fontWeight="600">
              {pct}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
