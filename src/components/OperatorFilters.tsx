import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Building2, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react'
import { operatorLogos } from '../data/operatorLogos'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

interface OperatorFiltersProps {
  operators: string[]
  selected: string
  onChange: (operator: string) => void
}

export function OperatorFilters({ operators, selected, onChange }: OperatorFiltersProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const operatorKey = operators.join('|')

  const updateScrollControls = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const maxScrollLeft = Math.max(container.scrollWidth - container.clientWidth, 0)
    setCanScrollLeft(container.scrollLeft > 2)
    setCanScrollRight(container.scrollLeft < maxScrollLeft - 2)
  }, [])

  useLayoutEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    container.scrollTo({ left: 0 })
    updateScrollControls()
  }, [operatorKey, updateScrollControls])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => updateScrollControls()
    const resizeObserver = new ResizeObserver(updateScrollControls)
    container.addEventListener('scroll', handleScroll, { passive: true })
    resizeObserver.observe(container)
    const content = container.firstElementChild
    if (content) resizeObserver.observe(content)

    return () => {
      container.removeEventListener('scroll', handleScroll)
      resizeObserver.disconnect()
    }
  }, [updateScrollControls])

  const scrollOperators = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container) return

    const rawPositions = Array.from(
      container.querySelectorAll<HTMLElement>('[data-operator-item]'),
      (item) => item.offsetLeft,
    )
    const firstPosition = rawPositions[0] ?? 0
    const positions = rawPositions.map((position) => Math.max(position - firstPosition, 0))
    const current = container.scrollLeft
    const target = direction === 'right'
      ? positions.find((position) => position > current + 4)
      : positions.filter((position) => position < current - 4).pop()

    container.scrollTo({
      left: target ?? (direction === 'right' ? container.scrollWidth : 0),
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white p-2 shadow-card">
      <div
        ref={scrollContainerRef}
        className="scrollbar-hide min-w-0 flex-1 overflow-x-auto"
      >
        <div className="flex w-max items-center gap-2 p-1 pb-2">
          <div className="mr-1 hidden shrink-0 items-center gap-2 px-2 text-xs font-extrabold uppercase tracking-wider text-slate-400 lg:flex">
            <Building2 className="h-4 w-4" />
            Operadora
          </div>
          <button
            data-operator-item
            type="button"
            onClick={() => onChange('Todas')}
            aria-pressed={selected === 'Todas'}
            className={`flex h-12 min-w-[96px] shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold transition-colors duration-200 ${
              selected === 'Todas'
                ? 'bg-[var(--dashboard-action)] text-[var(--dashboard-action-text)] shadow-md'
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
                data-operator-item
                type="button"
                key={operator}
                onClick={() => onChange(operator)}
                aria-label={`Filtrar campanhas da ${operator}`}
                aria-pressed={isSelected}
                title={operator}
                className={`flex h-12 min-w-[122px] shrink-0 items-center justify-center rounded-xl px-4 transition-colors duration-200 ${
                  isSelected
                    ? 'bg-[var(--dashboard-accent)] shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                {logo ? (
                  <img
                    src={logo.src}
                    alt=""
                    className={`h-auto w-auto object-contain ${logo.imageClassName ?? 'max-h-7 max-w-[104px]'} ${
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
          disabled={!canScrollLeft}
          aria-label="Ver operadoras anteriores"
          title="Operadoras anteriores"
          className="flex h-10 w-9 items-center justify-center rounded-lg bg-slate-100 text-navy-900 transition-colors duration-200 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-slate-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => scrollOperators('right')}
          disabled={!canScrollRight}
          aria-label="Ver próximas operadoras"
          title="Próximas operadoras"
          className="flex h-10 w-9 items-center justify-center rounded-lg bg-[var(--dashboard-action)] text-[var(--dashboard-action-text)] transition-colors duration-200 hover:bg-[var(--dashboard-action-hover)] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
