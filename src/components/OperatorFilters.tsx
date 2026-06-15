import { useRef } from 'react'
import { Building2, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react'
import { operatorLogos } from '../data/operatorLogos'

interface OperatorFiltersProps {
  operators: string[]
  selected: string
  onChange: (operator: string) => void
}

export function OperatorFilters({ operators, selected, onChange }: OperatorFiltersProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollOperators = (direction: 'left' | 'right') => {
    scrollContainerRef.current?.scrollBy({
      left: direction === 'left' ? -280 : 280,
      behavior: 'smooth',
    })
  }

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white p-2 shadow-card">
      <div
        ref={scrollContainerRef}
        className="operator-scrollbar min-w-0 flex-1 snap-x snap-proximity overflow-x-auto"
      >
        <div className="flex w-max items-center gap-2 p-1 pb-2">
          <div className="mr-1 hidden shrink-0 items-center gap-2 px-2 text-xs font-extrabold uppercase tracking-wider text-slate-400 lg:flex">
            <Building2 className="h-4 w-4" />
            Operadora
          </div>
          <button
            type="button"
            onClick={() => onChange('Todas')}
            aria-pressed={selected === 'Todas'}
            className={`flex h-12 min-w-[96px] shrink-0 snap-start items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold transition ${
              selected === 'Todas'
                ? 'bg-navy-900 text-white shadow-md'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            Todas
          </button>

          {operators.map((operator) => {
            const logo = operatorLogos[operator]
            const isSelected = selected === operator

            return (
              <button
                type="button"
                key={operator}
                onClick={() => onChange(operator)}
                aria-label={`Filtrar campanhas da ${operator}`}
                aria-pressed={isSelected}
                title={operator}
                className={`flex h-12 min-w-[122px] shrink-0 snap-start items-center justify-center rounded-xl px-4 transition ${
                  isSelected
                    ? 'bg-navy-900 shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                {logo ? (
                  <img
                    src={logo.src}
                    alt=""
                    className={`h-auto w-auto object-contain transition ${logo.imageClassName ?? 'max-h-7 max-w-[104px]'} ${
                      isSelected ? 'brightness-0 invert' : ''
                    }`}
                  />
                ) : (
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-600'}`}>
                    {operator}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex shrink-0 gap-1 border-l border-slate-200 pl-2">
        <button
          type="button"
          onClick={() => scrollOperators('left')}
          aria-label="Ver operadoras anteriores"
          title="Operadoras anteriores"
          className="flex h-10 w-9 items-center justify-center rounded-lg bg-slate-100 text-navy-900 transition hover:bg-slate-200"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => scrollOperators('right')}
          aria-label="Ver próximas operadoras"
          title="Próximas operadoras"
          className="flex h-10 w-9 items-center justify-center rounded-lg bg-navy-900 text-white transition hover:bg-navy-800"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
