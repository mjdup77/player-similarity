const STAT_KEYS = [
  'goals90', 'assists90', 'xG90', 'xA90', 'shots90', 'keyPasses90',
  'dribbles90', 'dribbleSuccess', 'passCompletion', 'progressivePasses90',
  'progressiveCarries90', 'tackles90', 'interceptions90', 'pressures90',
  'aerialWins90', 'touches90', 'passesIntoFinalThird90', 'passesIntoPenArea90',
  'crossesIntoBox90', 'throughBalls90'
]

const POSITION_PROFILES = {
  CF: ['goals90', 'xG90', 'shots90', 'aerialWins90', 'pressures90', 'dribbles90'],
  W: ['goals90', 'assists90', 'dribbles90', 'progressiveCarries90', 'keyPasses90', 'crossesIntoBox90'],
  AM: ['assists90', 'keyPasses90', 'progressivePasses90', 'dribbles90', 'goals90', 'throughBalls90'],
  CM: ['passCompletion', 'progressivePasses90', 'tackles90', 'interceptions90', 'touches90', 'pressures90'],
  DM: ['tackles90', 'interceptions90', 'pressures90', 'passCompletion', 'progressivePasses90', 'aerialWins90'],
  FB: ['progressiveCarries90', 'crossesIntoBox90', 'tackles90', 'passesIntoFinalThird90', 'interceptions90', 'dribbles90'],
  CB: ['aerialWins90', 'interceptions90', 'tackles90', 'passCompletion', 'progressivePasses90', 'pressures90'],
  GK: ['passCompletion', 'touches90', 'progressivePasses90', 'aerialWins90', 'interceptions90', 'pressures90'],
}

const RADAR_PROFILES = {
  CF: [
    { key: 'goals90', label: 'Goals' },
    { key: 'xG90', label: 'xG' },
    { key: 'shots90', label: 'Shots' },
    { key: 'aerialWins90', label: 'Aerial' },
    { key: 'pressures90', label: 'Pressing' },
    { key: 'keyPasses90', label: 'Key Passes' },
    { key: 'dribbles90', label: 'Dribbles' },
    { key: 'touches90', label: 'Touches' },
  ],
  W: [
    { key: 'goals90', label: 'Goals' },
    { key: 'assists90', label: 'Assists' },
    { key: 'dribbles90', label: 'Dribbles' },
    { key: 'progressiveCarries90', label: 'Prog Carries' },
    { key: 'keyPasses90', label: 'Key Passes' },
    { key: 'crossesIntoBox90', label: 'Crosses' },
    { key: 'xG90', label: 'xG' },
    { key: 'pressures90', label: 'Pressing' },
  ],
  AM: [
    { key: 'goals90', label: 'Goals' },
    { key: 'assists90', label: 'Assists' },
    { key: 'keyPasses90', label: 'Key Passes' },
    { key: 'throughBalls90', label: 'Through Balls' },
    { key: 'progressivePasses90', label: 'Prog Passes' },
    { key: 'dribbles90', label: 'Dribbles' },
    { key: 'shots90', label: 'Shots' },
    { key: 'pressures90', label: 'Pressing' },
  ],
  CM: [
    { key: 'passCompletion', label: 'Pass %' },
    { key: 'progressivePasses90', label: 'Prog Passes' },
    { key: 'tackles90', label: 'Tackles' },
    { key: 'interceptions90', label: 'Interceptions' },
    { key: 'pressures90', label: 'Pressing' },
    { key: 'touches90', label: 'Touches' },
    { key: 'keyPasses90', label: 'Key Passes' },
    { key: 'dribbles90', label: 'Dribbles' },
  ],
  DM: [
    { key: 'tackles90', label: 'Tackles' },
    { key: 'interceptions90', label: 'Interceptions' },
    { key: 'pressures90', label: 'Pressing' },
    { key: 'passCompletion', label: 'Pass %' },
    { key: 'progressivePasses90', label: 'Prog Passes' },
    { key: 'aerialWins90', label: 'Aerial' },
    { key: 'touches90', label: 'Touches' },
    { key: 'progressiveCarries90', label: 'Prog Carries' },
  ],
  FB: [
    { key: 'tackles90', label: 'Tackles' },
    { key: 'interceptions90', label: 'Interceptions' },
    { key: 'crossesIntoBox90', label: 'Crosses' },
    { key: 'progressiveCarries90', label: 'Prog Carries' },
    { key: 'passesIntoFinalThird90', label: 'Final 3rd Passes' },
    { key: 'dribbles90', label: 'Dribbles' },
    { key: 'pressures90', label: 'Pressing' },
    { key: 'passCompletion', label: 'Pass %' },
  ],
  CB: [
    { key: 'aerialWins90', label: 'Aerial' },
    { key: 'tackles90', label: 'Tackles' },
    { key: 'interceptions90', label: 'Interceptions' },
    { key: 'passCompletion', label: 'Pass %' },
    { key: 'progressivePasses90', label: 'Prog Passes' },
    { key: 'pressures90', label: 'Pressing' },
    { key: 'touches90', label: 'Touches' },
    { key: 'progressiveCarries90', label: 'Prog Carries' },
  ],
  GK: [
    { key: 'passCompletion', label: 'Pass %' },
    { key: 'touches90', label: 'Touches' },
    { key: 'progressivePasses90', label: 'Prog Passes' },
    { key: 'aerialWins90', label: 'Aerial' },
    { key: 'interceptions90', label: 'Interceptions' },
    { key: 'pressures90', label: 'Pressing' },
    { key: 'tackles90', label: 'Tackles' },
    { key: 'dribbles90', label: 'Dribbles' },
  ],
}

export function computePercentiles(players) {
  const result = {}
  for (const key of STAT_KEYS) {
    const values = players.map(p => p[key]).sort((a, b) => a - b)
    result[key] = values
  }
  return result
}

export function getPercentile(value, sortedValues) {
  if (!sortedValues.length) return 50
  let count = 0
  for (const v of sortedValues) {
    if (v <= value) count++
    else break
  }
  return Math.round((count / sortedValues.length) * 100)
}

export function computeSimilarity(playerA, playerB, positionWeights) {
  const weights = positionWeights || STAT_KEYS.map(() => 1)
  let dotProduct = 0
  let magA = 0
  let magB = 0

  const keys = positionWeights ? POSITION_PROFILES[playerA.position] || STAT_KEYS : STAT_KEYS

  for (let i = 0; i < STAT_KEYS.length; i++) {
    const key = STAT_KEYS[i]
    const w = keys.includes(key) ? 2 : 1
    const a = (playerA[key] || 0) * w
    const b = (playerB[key] || 0) * w
    dotProduct += a * b
    magA += a * a
    magB += b * b
  }

  if (magA === 0 || magB === 0) return 0
  return dotProduct / (Math.sqrt(magA) * Math.sqrt(magB))
}

export function findSimilarPlayers(target, allPlayers, { maxAge, maxValue, excludeLeagues = [], samePosition = true, limit = 10 } = {}) {
  let candidates = allPlayers.filter(p => p.name !== target.name)

  if (samePosition) {
    candidates = candidates.filter(p => p.position === target.position)
  }
  if (maxAge) {
    candidates = candidates.filter(p => p.age <= maxAge)
  }
  if (maxValue) {
    candidates = candidates.filter(p => p.marketValue <= maxValue)
  }
  if (excludeLeagues.length) {
    candidates = candidates.filter(p => !excludeLeagues.includes(p.league))
  }

  return candidates
    .map(p => ({
      ...p,
      similarity: computeSimilarity(target, p, true)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
}

export function getRadarProfile(position) {
  return RADAR_PROFILES[position] || RADAR_PROFILES.CM
}

export { STAT_KEYS, POSITION_PROFILES }
