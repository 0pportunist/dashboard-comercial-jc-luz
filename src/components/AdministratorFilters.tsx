import { BriefcaseBusiness, LayoutGrid } from 'lucide-react'
import { administratorLogos } from '../data/administratorLogos'

interface AdministratorFiltersProps {
  administrators: string[]
  selected: string
  onChange: (administrator: string) => void
}

export function AdministratorFilters({
  administrators,
  selected,
  onChange,
}: AdministratorFiltersProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex shrink-0 items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
          <BriefcaseBusiness className="h-4 w-4 text-blue-700" />
          Administradoras
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onChange('Todas')}
            aria-pressed={selected === 'Todas'}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition ${
              selected === 'Todas'
                ? 'bg-[var(--dashboard-action)] text-[var(--dashboard-action-text)] shadow-sm'
                : 'border border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-200 hover:bg-blue-50'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Todas
          </button>
          {administrators.map((administrator) => {
            const logo = administratorLogos[administrator]
            const isSelected = selected === administrator

            return (
              <button
                type="button"
                key={administrator}
                onClick={() => onChange(administrator)}
                aria-label={`Filtrar campanhas da administradora ${administrator}`}
                aria-pressed={isSelected}
                title={administrator}
                className={`flex h-12 min-w-[132px] items-center justify-center rounded-xl border px-4 transition ${
                  isSelected
                    ? 'border-[var(--dashboard-accent)] bg-[var(--dashboard-accent)] shadow-md'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                }`}
              >
                {logo ? (
                  <img
                    src={logo.src}
                    alt=""
                    className={`h-auto w-auto object-contain transition ${logo.imageClassName ?? 'max-h-8 max-w-[116px]'} ${
                      isSelected ? 'brightness-0 invert' : ''
                    }`}
                  />
                ) : (
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-navy-900'}`}>{administrator}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
