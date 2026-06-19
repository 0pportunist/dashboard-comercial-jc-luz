import type { CampaignGoal } from '../types'

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
const number = new Intl.NumberFormat('pt-BR')

function formatValue(value: number, unit: CampaignGoal['unit']) {
  return unit === 'valor' ? currency.format(value) : `${number.format(value)} ${unit}`
}

function progressColor(percentage: number) {
  if (percentage >= 100) return 'bg-emerald-500'
  if (percentage >= 80) return 'bg-blue-500'
  if (percentage >= 50) return 'bg-amber-400'
  return 'bg-gradient-to-r from-red-500 to-orange-500'
}

export function ProgressBar({ goal }: { goal: CampaignGoal }) {
  const percentage = Math.round((goal.current / goal.target) * 100)
  const remaining = Math.max(goal.target - goal.current, 0)

  return (
    <div>
      <div className="mb-2 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-slate-500">{goal.label}</p>
          <p className="mt-1 text-base font-black text-navy-950">
            {formatValue(goal.current, goal.unit)}
            <span className="ml-1 text-xs font-semibold text-slate-400">de {formatValue(goal.target, goal.unit)}</span>
          </p>
        </div>
        <span className="text-sm font-black text-navy-900">{percentage}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-[width] duration-[250ms] ease-out ${progressColor(percentage)}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <p className="mt-2 text-right text-[11px] font-semibold text-slate-500">
        {remaining === 0 ? 'Meta batida!' : `Faltam ${formatValue(remaining, goal.unit)}`}
      </p>
    </div>
  )
}
