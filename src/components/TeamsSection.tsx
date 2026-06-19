import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowDownUp,
  BriefcaseBusiness,
  Search,
  TrendingUp,
  UserRound,
  UsersRound,
} from 'lucide-react'
import { salesTeams } from '../data/teams'
import type { SalesDepartment, SalesTeam } from '../types'
import { getTeamLogo } from '../utils/getTeamLogo'

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

type DepartmentFilter = SalesDepartment | 'Todos'
type SortOption = 'production' | 'collaborators' | 'name'

export function TeamsSection({ teams = salesTeams }: { teams?: SalesTeam[] }) {
  const [department, setDepartment] = useState<DepartmentFilter>('Todos')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortOption>('production')

  const filteredTeams = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR')
    return teams
      .filter((team) => department === 'Todos' || team.department === department)
      .filter((team) => {
        if (!normalizedQuery) return true
        return `${team.name} ${team.supervisor}`.toLocaleLowerCase('pt-BR').includes(normalizedQuery)
      })
      .sort((a, b) => {
        if (sort === 'collaborators') return b.collaborators - a.collaborators
        if (sort === 'name') return a.name.localeCompare(b.name, 'pt-BR')
        return b.value - a.value
      })
  }, [department, query, sort, teams])

  const totalCollaborators = useMemo(() => teams.reduce((sum, team) => sum + team.collaborators, 0), [teams])
  const totalProduction = useMemo(() => teams.reduce((sum, team) => sum + team.value, 0), [teams])
  const leader = useMemo(() => [...teams].sort((a, b) => b.value - a.value)[0], [teams])

  return (
    <section>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-blue-700">Estrutura comercial</p>
          <h2 className="mt-1 text-3xl font-black tracking-tight text-navy-950">Equipes e supervisores</h2>
          <p className="mt-2 text-sm text-slate-500">Estrutura organizacional cruzada com a produção de maio de 2026.</p>
        </div>
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Buscar equipe ou supervisor"
            placeholder="Buscar equipe ou supervisor..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-medium outline-none transition-colors duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={BriefcaseBusiness} label="Equipes mapeadas" value={teams.length.toString()} helper="estrutura autorizada" />
        <SummaryCard icon={UsersRound} label="Colaboradores" value={totalCollaborators.toLocaleString('pt-BR')} helper="estrutura informada" />
        <SummaryCard icon={TrendingUp} label="Produção mapeada" value={currency.format(totalProduction)} helper="fechamento de maio" />
        <SummaryCard icon={TrendingUp} label="Líder de produção" value={leader?.name.replace('Equipe ', '') ?? 'Sem dados'} helper={leader ? currency.format(leader.value) : '—'} />
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-card sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto">
          {(['Todos', 'Vendas G1', 'Vendas G2', 'Vendas Externas'] as DepartmentFilter[]).map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => setDepartment(item)}
              aria-pressed={department === item}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors duration-200 ${
                department === item ? 'bg-navy-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <label className="relative shrink-0">
          <span className="sr-only">Ordenar equipes</span>
          <ArrowDownUp className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            className="appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-8 text-xs font-bold text-slate-700 outline-none"
          >
            <option value="production">Maior produção</option>
            <option value="collaborators">Mais colaboradores</option>
            <option value="name">Nome da equipe</option>
          </select>
        </label>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredTeams.map((team) => {
          const averageTicket = team.contracts ? team.value / team.contracts : 0
          return (
            <article key={team.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-100 bg-white p-1 shadow-sm">
                    <img
                      src={team.logo ?? getTeamLogo(team.name)}
                      alt={`Logo da ${team.name}`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-black text-navy-950">{team.name}</h3>
                    <p className="mt-0.5 truncate text-xs font-semibold text-slate-500">{team.supervisor}</p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-blue-700">
                  {team.department}
                </span>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-3 gap-2">
                  <TeamMetric label="Produção" value={currency.format(team.value)} />
                  <TeamMetric label="Contratos" value={team.contracts.toLocaleString('pt-BR')} />
                  <TeamMetric label="Vidas" value={team.lives.toLocaleString('pt-BR')} />
                </div>
                <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <UserRound className="h-4 w-4 text-blue-700" />
                    {team.collaborators} colaborador{team.collaborators === 1 ? '' : 'es'}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">Ticket {currency.format(averageTicket)}</span>
                </div>
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{team.role}</p>
                {team.dataWarning && (
                  <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-[10px] leading-4 text-amber-800">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {team.dataWarning}
                  </div>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

interface SummaryCardProps {
  icon: typeof BriefcaseBusiness
  label: string
  value: string
  helper: string
}

function SummaryCard({ icon: Icon, label, value, helper }: SummaryCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-lime-50 text-lime-700">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="mt-0.5 truncate text-lg font-black text-navy-950">{value}</p>
        <p className="truncate text-[10px] font-medium text-slate-500">{helper}</p>
      </div>
    </div>
  )
}

function TeamMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl bg-blue-50/60 p-2.5 text-center">
      <p className="truncate text-[8px] font-extrabold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 truncate text-xs font-black text-navy-950">{value}</p>
    </div>
  )
}
