import type { CampaignStatus } from '../types'

const styles: Record<CampaignStatus, string> = {
  Ativa: 'bg-[var(--dashboard-primary-soft)] text-[var(--dashboard-text)] ring-[var(--dashboard-primary)]/30',
  Futura: 'bg-blue-50 text-blue-700 ring-blue-600/15',
  Encerrada: 'bg-slate-100 text-slate-600 ring-slate-500/15',
}

export function StatusBadge({ status }: { status: CampaignStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ring-1 ring-inset ${styles[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status === 'Ativa' ? 'bg-[var(--dashboard-primary)]' : status === 'Futura' ? 'bg-blue-500' : 'bg-slate-400'}`} />
      {status}
    </span>
  )
}
