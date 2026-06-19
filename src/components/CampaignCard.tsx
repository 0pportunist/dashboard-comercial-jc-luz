import {
  ArrowRight,
  CalendarDays,
  Flame,
  Gift,
  Mountain,
  Palmtree,
  Shirt,
  Ship,
  Sparkles,
  Trophy,
  Waves,
  Zap,
} from 'lucide-react'
import type { Campaign } from '../types'
import { StatusBadge } from './StatusBadge'

const icons = { ship: Ship, palmtree: Palmtree, sparkles: Sparkles, mountain: Mountain, waves: Waves, flame: Flame, shirt: Shirt, gift: Gift, trophy: Trophy, zap: Zap }

interface CampaignCardProps {
  campaign: Campaign
  selected: boolean
  onSelect: (campaign: Campaign) => void
}

export function CampaignCard({ campaign, selected, onSelect }: CampaignCardProps) {
  const Icon = icons[campaign.icon as keyof typeof icons] ?? Trophy
  const primaryGoal = campaign.goals[0]
  const percentage = Math.round((primaryGoal.current / primaryGoal.target) * 100)

  return (
    <button
      type="button"
      onClick={() => onSelect(campaign)}
      aria-pressed={selected}
      className={`group w-full overflow-hidden rounded-2xl border bg-white text-left shadow-card transition-colors duration-200 ${
        selected ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-100'
      }`}
    >
      <div className={`relative h-36 overflow-hidden bg-gradient-to-br ${campaign.accent} p-4 text-white`}>
        <img
          src={campaign.image}
          alt={`Arte da campanha ${campaign.name}`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-black/15" />
        <div className="relative flex items-start justify-between">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-navy-950/45">
            <Icon className="h-5 w-5" />
          </div>
          <StatusBadge status={campaign.status} />
        </div>
        <h3 className="absolute bottom-4 left-4 right-4 line-clamp-1 font-black tracking-tight">{campaign.shortName}</h3>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
          <CalendarDays className="h-3.5 w-3.5 text-blue-600" />
          {campaign.period}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {campaign.operators.slice(0, 2).map((operator) => (
            <span key={operator} className="rounded-md bg-slate-100 px-2 py-1 text-[9px] font-bold text-slate-600">{operator}</span>
          ))}
          {campaign.operators.length > 2 && <span className="rounded-md bg-slate-100 px-2 py-1 text-[9px] font-bold text-slate-500">+{campaign.operators.length - 2}</span>}
        </div>
        {campaign.administrators && campaign.administrators.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-700">Administradora</span>
            {campaign.administrators.map((administrator) => (
              <span key={administrator} className="rounded-md bg-amber-50 px-2 py-1 text-[9px] font-bold text-amber-800">
                {administrator}
              </span>
            ))}
          </div>
        )}
        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-[10px] font-bold">
            <span className="text-slate-500">Progresso principal</span>
            <span className="text-navy-950">{percentage}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.min(percentage, 100)}%` }} />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{campaign.prizeType}</p>
            <p className="mt-0.5 max-w-[190px] truncate text-xs font-bold text-navy-950">{campaign.mainPrize}</p>
          </div>
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-700 transition-colors duration-200 group-hover:bg-blue-700 group-hover:text-white">
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </button>
  )
}
