import { Award, Check, Target, Users, X } from 'lucide-react'
import type { Campaign } from '../types'
import { ProgressBar } from './ProgressBar'
import { StatusBadge } from './StatusBadge'

interface CampaignDetailsProps {
  campaign: Campaign
  onClose: () => void
}

export function CampaignDetails({ campaign, onClose }: CampaignDetailsProps) {
  return (
    <aside className="sticky top-5 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
      <div className={`relative min-h-52 overflow-hidden bg-gradient-to-br ${campaign.accent} p-5 text-white`}>
        <img src={campaign.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/45 to-black/20" />
        <div className="relative flex items-start justify-between gap-4">
          <StatusBadge status={campaign.status} />
          <button onClick={onClose} aria-label="Fechar detalhes" className="grid h-8 w-8 place-items-center rounded-lg bg-white/15 transition hover:bg-white/25">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="absolute bottom-5 left-5 right-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">Campanha selecionada</p>
          <h2 className="mt-1 text-2xl font-black leading-tight">{campaign.name}</h2>
          <p className="mt-2 text-xs font-semibold text-white/80">{campaign.period}</p>
        </div>
      </div>
      <div className="max-h-[680px] overflow-y-auto p-5">
        <p className="text-sm leading-6 text-slate-600">{campaign.description}</p>

        <div className="mt-5 space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Operadoras</p>
            <p className="mt-1 text-xs font-bold text-navy-950">{campaign.operators.join(' • ')}</p>
          </div>
          {campaign.administrators && campaign.administrators.length > 0 && (
            <div className="border-t border-amber-200 pt-2">
              <p className="text-[9px] font-bold uppercase tracking-wider text-amber-700">Administradoras</p>
              <p className="mt-1 text-xs font-bold text-amber-900">{campaign.administrators.join(' • ')}</p>
            </div>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-slate-50 p-3">
            <Users className="h-4 w-4 text-blue-600" />
            <p className="mt-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">Público</p>
            <p className="text-xs font-black text-navy-950">{campaign.audience}</p>
          </div>
          <div className="rounded-xl bg-amber-50 p-3">
            <Award className="h-4 w-4 text-amber-600" />
            <p className="mt-2 text-[9px] font-bold uppercase tracking-wider text-amber-600/70">Prêmio</p>
            <p className="text-xs font-black text-navy-950">{campaign.prizeType}</p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-goldbrand/30 bg-amber-50/60 p-4">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-amber-700">Prêmio principal</p>
          <p className="mt-1 text-sm font-black leading-5 text-navy-950">{campaign.mainPrize}</p>
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-700" />
            <h3 className="text-sm font-black text-navy-950">Metas e desempenho</h3>
          </div>
          <div className="mt-4 space-y-5">
            {campaign.goals.map((goal) => <ProgressBar key={goal.label} goal={goal} />)}
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-5">
          <h3 className="text-sm font-black text-navy-950">Regras principais</h3>
          <ul className="mt-3 space-y-2.5">
            {campaign.rules.map((rule) => (
              <li key={rule} className="flex items-start gap-2 text-xs leading-5 text-slate-600">
                <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-limebrand text-navy-950">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  )
}
