import { LEAGUES } from '../data/players'

export default function Filters({ filters, onChange }) {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div>
        <label className="text-xs text-slate-500 block mb-1">Max Age</label>
        <input
          type="number"
          value={filters.maxAge || ''}
          onChange={(e) => handleChange('maxAge', e.target.value ? parseInt(e.target.value) : null)}
          placeholder="Any"
          className="w-20 px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white outline-none focus:border-cyan-500/50 transition-colors"
        />
      </div>

      <div>
        <label className="text-xs text-slate-500 block mb-1">Max Value (€m)</label>
        <input
          type="number"
          value={filters.maxValue || ''}
          onChange={(e) => handleChange('maxValue', e.target.value ? parseInt(e.target.value) : null)}
          placeholder="Any"
          className="w-20 px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white outline-none focus:border-cyan-500/50 transition-colors"
        />
      </div>

      <div>
        <label className="text-xs text-slate-500 block mb-1">Position Lock</label>
        <button
          onClick={() => handleChange('samePosition', !filters.samePosition)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            filters.samePosition
              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}
        >
          {filters.samePosition ? 'Same position' : 'Any position'}
        </button>
      </div>

      <div>
        <label className="text-xs text-slate-500 block mb-1">Exclude Leagues</label>
        <div className="flex gap-1 flex-wrap">
          {Object.entries(LEAGUES).slice(0, 5).map(([key, name]) => {
            const excluded = filters.excludeLeagues?.includes(key)
            return (
              <button
                key={key}
                onClick={() => {
                  const current = filters.excludeLeagues || []
                  handleChange('excludeLeagues',
                    excluded ? current.filter(l => l !== key) : [...current, key]
                  )
                }}
                className={`px-2 py-1 rounded text-[10px] font-medium border transition-all ${
                  excluded
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 line-through'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {key}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
