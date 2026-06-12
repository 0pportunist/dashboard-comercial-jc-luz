import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string | number
  helper: string
  icon: LucideIcon
  tone?: 'blue' | 'lime' | 'gold' | 'slate'
}

const tones = {
  blue: 'bg-blue-50 text-blue-700',
  lime: 'bg-lime-50 text-lime-700',
  gold: 'bg-amber-50 text-amber-700',
  slate: 'bg-slate-100 text-slate-600',
}

export function MetricCard({ label, value, helper, icon: Icon, tone = 'blue' }: MetricCardProps) {
  return (
    <article className="group min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-card transition duration-300 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">{label}</p>
          <p className="mt-2 truncate text-2xl font-black tracking-tight text-navy-950">{value}</p>
          <p className="mt-1 truncate text-xs font-medium text-slate-500">{helper}</p>
        </div>
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </article>
  )
}
