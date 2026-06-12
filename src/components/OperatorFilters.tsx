import { Building2 } from 'lucide-react'

interface OperatorFiltersProps {
  operators: string[]
  selected: string
  onChange: (operator: string) => void
}

export function OperatorFilters({ operators, selected, onChange }: OperatorFiltersProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-2 shadow-card">
      <div className="flex items-center gap-2 overflow-x-auto p-1 scrollbar-hide">
        <div className="mr-1 hidden shrink-0 items-center gap-2 px-2 text-xs font-extrabold uppercase tracking-wider text-slate-400 lg:flex">
          <Building2 className="h-4 w-4" />
          Operadora
        </div>
        {['Todas', ...operators].map((operator) => (
          <button
            key={operator}
            onClick={() => onChange(operator)}
            className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
              selected === operator
                ? 'bg-navy-900 text-white shadow-md'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {operator}
          </button>
        ))}
      </div>
    </div>
  )
}
