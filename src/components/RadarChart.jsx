import { getRadarProfile, computePercentiles, getPercentile } from '../utils/similarity'

export default function RadarChart({ player, allPlayers, comparePlayer = null, size = 300 }) {
  const profile = getRadarProfile(player.position)
  const percentileData = computePercentiles(allPlayers)
  const n = profile.length
  const cx = size / 2
  const cy = size / 2
  const radius = size * 0.38

  const angleStep = (2 * Math.PI) / n
  const startAngle = -Math.PI / 2

  const getPoint = (index, value) => {
    const angle = startAngle + index * angleStep
    const r = (value / 100) * radius
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    }
  }

  const buildPath = (values) => {
    return values.map((v, i) => {
      const { x, y } = getPoint(i, v)
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ') + ' Z'
  }

  const playerValues = profile.map(({ key }) =>
    getPercentile(player[key], percentileData[key])
  )

  const compareValues = comparePlayer
    ? profile.map(({ key }) => getPercentile(comparePlayer[key], percentileData[key]))
    : null

  const rings = [25, 50, 75, 100]

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-sm mx-auto">
      {/* Background rings */}
      {rings.map(ring => {
        const points = Array.from({ length: n }, (_, i) => {
          const { x, y } = getPoint(i, ring)
          return `${x},${y}`
        }).join(' ')
        return (
          <polygon
            key={ring}
            points={points}
            fill="none"
            stroke="#334155"
            strokeWidth={ring === 50 ? "0.8" : "0.4"}
            opacity={ring === 50 ? 0.6 : 0.3}
          />
        )
      })}

      {/* Axis lines */}
      {profile.map((_, i) => {
        const { x, y } = getPoint(i, 100)
        return (
          <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#334155" strokeWidth="0.4" opacity="0.3" />
        )
      })}

      {/* Compare player fill */}
      {compareValues && (
        <path
          d={buildPath(compareValues)}
          fill="#f43f5e"
          fillOpacity="0.12"
          stroke="#f43f5e"
          strokeWidth="1.5"
          strokeOpacity="0.6"
        />
      )}

      {/* Main player fill */}
      <path
        d={buildPath(playerValues)}
        fill="#22d3ee"
        fillOpacity="0.15"
        stroke="#22d3ee"
        strokeWidth="2"
        strokeOpacity="0.8"
      />

      {/* Data points */}
      {playerValues.map((v, i) => {
        const { x, y } = getPoint(i, v)
        return (
          <circle key={i} cx={x} cy={y} r="3" fill="#22d3ee" stroke="#0f172a" strokeWidth="1" />
        )
      })}

      {compareValues && compareValues.map((v, i) => {
        const { x, y } = getPoint(i, v)
        return (
          <circle key={`c-${i}`} cx={x} cy={y} r="2.5" fill="#f43f5e" stroke="#0f172a" strokeWidth="1" />
        )
      })}

      {/* Labels */}
      {profile.map(({ label }, i) => {
        const { x, y } = getPoint(i, 115)
        const pct = playerValues[i]
        return (
          <g key={i}>
            <text
              x={x}
              y={y - 4}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#94a3b8"
              fontSize="9"
              fontFamily="Inter, sans-serif"
              fontWeight="500"
            >
              {label}
            </text>
            <text
              x={x}
              y={y + 7}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#22d3ee"
              fontSize="8"
              fontFamily="JetBrains Mono, monospace"
              fontWeight="500"
            >
              {pct}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
