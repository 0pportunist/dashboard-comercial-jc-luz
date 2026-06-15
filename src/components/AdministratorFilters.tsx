import { BriefcaseBusiness, LayoutGrid } from 'lucide-react'

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
    <div className="rounded-2xl border border-amber-200/70 bg-amber-50/60 p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex shrink-0 items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-800">
          <BriefcaseBusiness className="h-4 w-4" />
          Administradoras
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onChange('Todas')}
            aria-pressed={selected === 'Todas'}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition ${
              selected === 'Todas'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'border border-amber-200 bg-white text-amber-900 hover:bg-amber-100'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Todas
          </button>
          {administrators.map((administrator) => (
            <button
              type="button"
              key={administrator}
              onClick={() => onChange(administrator)}
              aria-pressed={selected === administrator}
              className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                selected === administrator
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'border border-amber-200 bg-white text-amber-900 hover:bg-amber-100'
              }`}
            >
              {administrator}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
