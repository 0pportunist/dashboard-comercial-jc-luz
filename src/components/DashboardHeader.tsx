import { CalendarDays, ChevronDown, ShieldCheck } from 'lucide-react'

interface DashboardHeaderProps {
  onOverviewClick: () => void
  onCampaignsClick: () => void
  onRankingsClick: () => void
  onTeamsClick: () => void
}

export function DashboardHeader({ onOverviewClick, onCampaignsClick, onRankingsClick, onTeamsClick }: DashboardHeaderProps) {
  return (
    <header className="relative overflow-hidden bg-navy-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(185,239,47,0.16),transparent_32%),radial-gradient(circle_at_20%_100%,rgba(41,121,255,0.22),transparent_38%)]" />
      <div className="relative mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-limebrand text-navy-950 shadow-glow">
              <ShieldCheck className="h-6 w-6" strokeWidth={2.4} />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black tracking-tight">JC LUZ</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-limebrand">Seguros</span>
              </div>
              <p className="text-xs text-slate-400">Performance que protege sonhos</p>
            </div>
          </div>
          <div className="hidden items-center gap-7 text-sm font-semibold text-slate-300 md:flex">
            <button onClick={onOverviewClick} className="transition hover:text-white">Visão geral</button>
            <button onClick={onCampaignsClick} className="transition hover:text-white">Campanhas</button>
            <button onClick={onRankingsClick} className="transition hover:text-white">Rankings</button>
            <button onClick={onTeamsClick} className="transition hover:text-white">Equipes</button>
          </div>
          <button className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-goldbrand text-xs font-black text-navy-950">JC</span>
            <span className="hidden sm:inline">Gestão Comercial</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </nav>

        <div className="grid gap-7 pb-4 pt-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-limebrand/25 bg-limebrand/10 px-3 py-1.5 text-xs font-bold text-limebrand">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-limebrand" />
              Central de performance comercial
            </div>
            <h1 className="max-w-3xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Campanhas que movem
              <span className="block text-limebrand">resultados extraordinários.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Acompanhe metas, reconheça talentos e transforme cada venda em uma nova conquista.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-limebrand">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Último relatório disponível</p>
              <p className="mt-0.5 text-sm font-bold">Maio/2026 • emitido em 08 jun</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
