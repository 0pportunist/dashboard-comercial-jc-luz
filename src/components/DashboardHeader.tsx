import { Bot, CalendarDays, LogOut, Settings } from 'lucide-react'
import { BrandLogo } from './BrandLogo'

interface DashboardHeaderProps {
  onOverviewClick: () => void
  onCampaignsClick: () => void
  onRankingsClick: () => void
  onTeamsClick: () => void
  onAdminClick: () => void
  onAssistantClick: () => void
  onSignOut: () => void
  reportPeriod: string
  reportIssuedAt: string
}

export function DashboardHeader({
  onOverviewClick,
  onCampaignsClick,
  onRankingsClick,
  onTeamsClick,
  onAdminClick,
  onAssistantClick,
  onSignOut,
  reportPeriod,
  reportIssuedAt,
}: DashboardHeaderProps) {
  return (
    <header className="relative overflow-hidden bg-navy-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(183,199,44,0.18),transparent_32%),radial-gradient(circle_at_20%_100%,rgba(255,255,255,0.18),transparent_38%)]" />
      <div className="relative mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          <BrandLogo
            color="white"
            orientation="horizontal"
            className="w-36 sm:w-44"
          />
          <div className="hidden items-center gap-7 text-sm font-semibold text-slate-300 md:flex">
            <button onClick={onOverviewClick} className="transition hover:text-white">Visão geral</button>
            <button onClick={onCampaignsClick} className="transition hover:text-white">Campanhas</button>
            <button onClick={onRankingsClick} className="transition hover:text-white">Rankings</button>
            <button onClick={onTeamsClick} className="transition hover:text-white">Equipes</button>
            <button onClick={onAssistantClick} className="transition hover:text-white">Assistente de IA</button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onAssistantClick}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white md:hidden"
              aria-label="Abrir Assistente de IA"
            >
              <Bot className="h-4 w-4" />
            </button>
            <button
              onClick={onAdminClick}
              className="flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden lg:inline">Administração</span>
            </button>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1.5 text-xs font-semibold text-slate-200">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-goldbrand font-black text-navy-950">AD</span>
              <span className="hidden max-w-32 truncate sm:block">
                Administração
                <span className="block text-[9px] uppercase tracking-wider text-limebrand">Acesso local</span>
              </span>
            </div>
            <button
              onClick={onSignOut}
              className="flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
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
              <p className="mt-0.5 max-w-72 text-sm font-bold">{reportPeriod} • emitido em {reportIssuedAt}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
