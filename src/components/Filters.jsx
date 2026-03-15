import { LEAGUES } from '../data/players'

export default function Filters({ filters, onChange }) {
  const handleChange = (key, value) => onChange({ ...filters, [key]: value })

  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div>
        <label className="text-[10px] text-slate-500 uppercase tracking-[0.12em] font-semibold block mb-1.5">Max Age</label>
        <input
          type="number"
          value={filters.maxAge || ''}
          onChange={(e) => handleChange('maxAge', e.target.value ? parseInt(e.target.value) : null)}
          placeholder="Any"
          className="w-20 px-3 py-2 glass-subtle rounded-xl text-[13px] text-white outline-none focus:border-violet-500/30 transition-colors placeholder:text-slate-600"
        />
      </div>

      <div>
        <label className="text-[10px] text-slate-500 uppercase tracking-[0.12em] font-semibold block mb-1.5">Max Value (€m)</label>
        <input
          type="number"
          value={filters.maxValue || ''}
          onChange={(e) => handleChange('maxValue', e.target.value ? parseInt(e.target.value) : null)}
          placeholder="Any"
          className="w-20 px-3 py-2 glass-subtle rounded-xl text-[13px] text-white outline-none focus:border-violet-500/30 transition-colors placeholder:text-slate-600"
        />
      </div>

      <div>
        <label className="text-[10px] text-slate-500 uppercase tracking-[0.12em] font-semibold block mb-1.5">Position</label>
        <button
          onClick={() => handleChange('samePosition', !filters.samePosition)}
          className={`px-3.5 py-2 rounded-xl text-[11px] font-semibold transition-all duration-300 ${
            filters.samePosition
              ? 'bg-violet-400/10 border border-violet-400/20 text-violet-300'
              : 'glass-subtle text-slate-400'
          }`}
        >
          {filters.samePosition ? 'Same position' : 'Any position'}
        </button>
      </div>

      <div>
        <label className="text-[10px] text-slate-500 uppercase tracking-[0.12em] font-semibold block mb-1.5">Exclude</label>
        <div className="flex gap-1">
          {Object.entries(LEAGUES).slice(0, 5).map(([key]) => {
            const excluded = filters.excludeLeagues?.includes(key)
            return (
              <button
                key={key}
                onClick={() => {
                  const current = filters.excludeLeagues || []
                  handleChange('excludeLeagues', excluded ? current.filter(l => l !== key) : [...current, key])
                }}
                className={`px-2.5 py-2 rounded-lg text-[10px] font-semibold transition-all duration-300 ${
                  excluded
                    ? 'bg-rose-400/10 border border-rose-400/20 text-rose-300 line-through opacity-60'
                    : 'glass-subtle text-slate-400 hover:text-slate-300'
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
