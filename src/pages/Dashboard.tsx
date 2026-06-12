import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import {
  Activity,
  ArrowRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Filter,
  Layers3,
  ReceiptText,
  Search,
  Sparkles,
  Trophy,
  UserRoundCheck,
  UsersRound,
  X,
} from 'lucide-react'
import { CampaignCard } from '../components/CampaignCard'
import { CampaignDetails } from '../components/CampaignDetails'
import { DashboardHeader } from '../components/DashboardHeader'
import { MetricCard } from '../components/MetricCard'
import { OperatorFilters } from '../components/OperatorFilters'
import { RankingTable } from '../components/RankingTable'
import { RealtimeSalesButton } from '../components/RealtimeSalesButton'
import { TeamsSection } from '../components/TeamsSection'
import { RoleGuard } from '../components/auth/RoleGuard'
import { useAuth } from '../contexts/AuthContext'
import { campaigns } from '../data/campaigns'
import { brokerRankings, productionReport, supervisorRankings } from '../data/rankings'
import { salesTeams } from '../data/teams'
import type { Audience, Campaign, CampaignStatus, PrizeType } from '../types'

const statusOptions: Array<CampaignStatus | 'Todos'> = ['Todos', 'Ativa', 'Futura', 'Encerrada']
const prizeOptions: Array<PrizeType | 'Todos'> = ['Todos', 'Viagem', 'Experiência', 'Produto', 'Dinheiro']
const audienceOptions: Array<Audience | 'Todos'> = ['Todos', 'Corretores', 'Supervisores']

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 2,
})

function normalizeName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .trim()
}

export function Dashboard() {
  const { user, role = 'corretor', accessProfile, signOut } = useAuth()
  const [selectedOperator, setSelectedOperator] = useState('Todas')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<CampaignStatus | 'Todos'>('Todos')
  const [prizeType, setPrizeType] = useState<PrizeType | 'Todos'>('Todos')
  const [audience, setAudience] = useState<Audience | 'Todos'>('Todos')
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [realtimeModal, setRealtimeModal] = useState(false)
  const overviewRef = useRef<HTMLElement>(null)
  const rankingsRef = useRef<HTMLElement>(null)
  const teamsRef = useRef<HTMLDivElement>(null)
  const campaignsRef = useRef<HTMLElement>(null)

  const currentTeam = useMemo(
    () => salesTeams.find((team) => team.id === accessProfile?.teamId),
    [accessProfile?.teamId],
  )

  const currentBroker = useMemo(
    () => brokerRankings.find(
      (broker) => accessProfile?.brokerName
        && normalizeName(broker.name) === normalizeName(accessProfile.brokerName),
    ),
    [accessProfile?.brokerName],
  )

  const authorizedCampaigns = useMemo(() => {
    if (role === 'admin') return campaigns
    const targetAudience = role === 'supervisor' ? 'Supervisores' : 'Corretores'
    return campaigns.filter(
      (campaign) => campaign.audience === 'Todos' || campaign.audience === targetAudience,
    )
  }, [role])

  const authorizedBrokers = useMemo(() => {
    if (role === 'admin') return brokerRankings
    if (role === 'supervisor' && currentTeam) {
      return brokerRankings.filter((broker) => broker.team === currentTeam.name)
    }
    return currentBroker ? [currentBroker] : []
  }, [currentBroker, currentTeam, role])

  const authorizedSupervisors = useMemo(() => {
    if (role === 'admin') return supervisorRankings
    if (role === 'supervisor' && currentTeam) {
      return supervisorRankings.filter((supervisor) => supervisor.team === currentTeam.name)
    }
    return []
  }, [currentTeam, role])

  const authorizedTeams = role === 'admin' ? salesTeams : currentTeam ? [currentTeam] : []
  const visibleOperators = [...new Set(authorizedCampaigns.flatMap((campaign) => campaign.operators))]
  const activeCampaigns = authorizedCampaigns.filter((campaign) => campaign.status === 'Ativa')
  const futureCampaigns = authorizedCampaigns.filter((campaign) => campaign.status === 'Futura')
  const endedCampaigns = authorizedCampaigns.filter((campaign) => campaign.status === 'Encerrada')
  const closestEnding = [...activeCampaigns].sort((a, b) => a.endDate.localeCompare(b.endDate))[0]

  const filteredCampaigns = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR')
    return authorizedCampaigns.filter((campaign) => {
      const matchesQuery = !normalizedQuery || campaign.name.toLocaleLowerCase('pt-BR').includes(normalizedQuery)
      const matchesOperator = selectedOperator === 'Todas' || campaign.operators.includes(selectedOperator)
      const matchesStatus = status === 'Todos' || campaign.status === status
      const matchesPrize = prizeType === 'Todos' || campaign.prizeType === prizeType
      const matchesAudience = audience === 'Todos' || campaign.audience === audience || campaign.audience === 'Todos'
      return matchesQuery && matchesOperator && matchesStatus && matchesPrize && matchesAudience
    })
  }, [audience, authorizedCampaigns, prizeType, query, selectedOperator, status])

  useEffect(() => {
    if (!selectedCampaign || !authorizedCampaigns.some((campaign) => campaign.id === selectedCampaign.id)) {
      setSelectedCampaign(authorizedCampaigns[0] ?? null)
    }
  }, [authorizedCampaigns, selectedCampaign])

  const scrollTo = (ref: RefObject<HTMLElement | HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const clearFilters = () => {
    setSelectedOperator('Todas')
    setQuery('')
    setStatus('Todos')
    setPrizeType('Todos')
    setAudience('Todos')
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
      <DashboardHeader
        onOverviewClick={() => scrollTo(overviewRef)}
        onCampaignsClick={() => scrollTo(campaignsRef)}
        onRankingsClick={() => scrollTo(rankingsRef)}
        onTeamsClick={() => scrollTo(teamsRef)}
        onSignOut={() => void signOut()}
        userName={user?.displayName || user?.email || 'Usuário'}
        userPhoto={user?.photoURL}
        role={role}
        showTeams={role !== 'corretor'}
      />

      <main className="mx-auto max-w-[1440px] px-4 pb-14 sm:px-6 lg:px-8">
        <section ref={overviewRef} className="-mt-1 scroll-mt-5 py-5">
          {role === 'admin' && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
              <MetricCard label="Total de campanhas" value={authorizedCampaigns.length} helper="no calendário comercial" icon={Layers3} tone="blue" />
              <MetricCard label="Campanhas ativas" value={activeCampaigns.length} helper="em andamento agora" icon={Activity} tone="lime" />
              <MetricCard label="Campanhas futuras" value={futureCampaigns.length} helper="próximos lançamentos" icon={Clock3} tone="blue" />
              <MetricCard label="Encerradas" value={endedCampaigns.length} helper="ciclos concluídos" icon={CheckCircle2} tone="slate" />
              <MetricCard label="Operadoras" value={visibleOperators.length} helper="parceiras participantes" icon={Building2} tone="gold" />
              <MetricCard label="Mais próxima do fim" value={closestEnding?.shortName ?? '—'} helper={closestEnding ? `até ${closestEnding.period.split('—')[1]?.trim()}` : 'sem campanha ativa'} icon={CalendarClock} tone="gold" />
            </div>
          )}

          {role === 'supervisor' && (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
              <MetricCard label="Equipe" value={currentTeam?.name.replace('Equipe ', '') ?? 'Não vinculada'} helper="acesso do supervisor" icon={UsersRound} tone="blue" />
              <MetricCard label="Mensalidade" value={currency.format(currentTeam?.value ?? 0)} helper="produção de maio" icon={ReceiptText} tone="lime" />
              <MetricCard label="Contratos" value={currentTeam?.contracts ?? 0} helper="equipe autorizada" icon={UserRoundCheck} tone="blue" />
              <MetricCard label="Vidas" value={(currentTeam?.lives ?? 0).toLocaleString('pt-BR')} helper="equipe autorizada" icon={Activity} tone="gold" />
              <MetricCard label="Campanhas" value={authorizedCampaigns.length} helper="elegíveis ao perfil" icon={Layers3} tone="slate" />
            </div>
          )}

          {role === 'corretor' && (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <MetricCard label="Minha mensalidade" value={currency.format(currentBroker?.value ?? 0)} helper="produção de maio" icon={ReceiptText} tone="lime" />
              <MetricCard label="Meus contratos" value={currentBroker?.sales ?? 0} helper="produção individual" icon={UserRoundCheck} tone="blue" />
              <MetricCard label="Minhas vidas" value={currentBroker?.lives ?? 0} helper="produção individual" icon={Activity} tone="gold" />
              <MetricCard label="Campanhas elegíveis" value={authorizedCampaigns.length} helper="corretores e público geral" icon={Layers3} tone="slate" />
            </div>
          )}

          {role !== 'admin' && !currentTeam && !currentBroker && (
            <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
              Seu acesso foi autenticado, mas ainda não há vínculo de dados para {user?.email}. Configure o mapeamento por e-mail ou as custom claims no Firebase.
            </p>
          )}
        </section>

        <section className="flex flex-col gap-3 lg:flex-row">
          <div className="min-w-0 flex-1">
            <OperatorFilters operators={visibleOperators} selected={selectedOperator} onChange={setSelectedOperator} />
          </div>
          <RoleGuard allowedRoles={['admin']}>
            <RealtimeSalesButton onClick={() => setRealtimeModal(true)} />
          </RoleGuard>
        </section>

        <section ref={rankingsRef} className="mt-7 scroll-mt-5">
          <RoleGuard allowedRoles={['admin']}>
            <ProductionReport />
          </RoleGuard>

          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-blue-700">Desempenho autorizado</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-navy-950">
                {role === 'admin' ? 'Ranking comercial' : role === 'supervisor' ? currentTeam?.name ?? 'Minha equipe' : 'Meu resultado'}
              </h2>
            </div>
            <button
              onClick={() => scrollTo(campaignsRef)}
              className="flex items-center justify-center gap-2 rounded-xl bg-navy-900 px-4 py-3 text-xs font-bold text-white transition hover:bg-navy-800"
            >
              Ver Campanhas Ativas <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className={`grid gap-5 ${role === 'corretor' ? '' : 'xl:grid-cols-2'}`}>
            <RankingTable
              title={role === 'corretor' ? 'Minha produção - Maio' : 'Corretores - Maio'}
              subtitle={role === 'admin' ? 'Base CLT e Salão' : 'Dados filtrados pelo seu acesso'}
              data={authorizedBrokers}
              type="broker"
            />
            {role !== 'corretor' && (
              <RankingTable
                title={role === 'admin' ? 'Supervisores - Maio' : 'Resultado da equipe'}
                subtitle={role === 'admin' ? 'Base consolidada de todas as equipes' : 'Consolidado da equipe autorizada'}
                data={authorizedSupervisors}
                type="supervisor"
              />
            )}
          </div>
        </section>

        <RoleGuard allowedRoles={['admin', 'supervisor']}>
          <div ref={teamsRef} className="scroll-mt-5 pt-12">
            <TeamsSection teams={authorizedTeams} />
          </div>
        </RoleGuard>

        <section ref={campaignsRef} className="scroll-mt-5 pt-12">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-blue-700">Portfólio de incentivos</p>
              <h2 className="mt-1 text-3xl font-black tracking-tight text-navy-950">Campanhas comerciais</h2>
              <p className="mt-2 text-sm text-slate-500">Campanhas disponíveis para o seu nível de acesso.</p>
            </div>
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar campanha..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-100 bg-white p-3 shadow-card">
            <div className="mr-1 flex items-center gap-2 px-2 text-xs font-extrabold text-slate-500">
              <Filter className="h-4 w-4 text-blue-700" /> Filtros
            </div>
            <FilterSelect label="Status" value={status} options={statusOptions} onChange={(value) => setStatus(value as CampaignStatus | 'Todos')} />
            <FilterSelect label="Prêmio" value={prizeType} options={prizeOptions} onChange={(value) => setPrizeType(value as PrizeType | 'Todos')} />
            {role === 'admin' && (
              <FilterSelect label="Público" value={audience} options={audienceOptions} onChange={(value) => setAudience(value as Audience | 'Todos')} />
            )}
            <span className="ml-auto px-2 text-xs font-bold text-slate-400">{filteredCampaigns.length} resultado(s)</span>
          </div>

          <div className={`mt-5 grid gap-5 ${selectedCampaign ? 'xl:grid-cols-[1fr_380px]' : ''}`}>
            <div>
              {filteredCampaigns.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredCampaigns.map((campaign) => (
                    <CampaignCard key={campaign.id} campaign={campaign} selected={selectedCampaign?.id === campaign.id} onSelect={setSelectedCampaign} />
                  ))}
                </div>
              ) : (
                <EmptyState onClear={clearFilters} />
              )}
            </div>
            {selectedCampaign && <CampaignDetails campaign={selectedCampaign} onClose={() => setSelectedCampaign(null)} />}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-2 px-4 text-xs text-slate-400 sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 JC Luz Corretora de Seguros.</p>
          <p className="font-semibold">Acesso: {role}</p>
        </div>
      </footer>

      {realtimeModal && <RealtimeModal onClose={() => setRealtimeModal(false)} />}
    </div>
  )
}

function ProductionReport() {
  return (
    <div className="mb-7 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-card">
      <div className="flex flex-col justify-between gap-2 bg-blue-50/70 px-5 py-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-blue-700">Fechamento mais recente</p>
          <h2 className="mt-1 font-black text-navy-950">Produção de {productionReport.period}</h2>
        </div>
        <p className="text-xs font-semibold text-slate-500">Relatórios SixVox emitidos em {productionReport.issuedAt}</p>
      </div>
      <div className="grid gap-px bg-slate-100 sm:grid-cols-2 lg:grid-cols-4">
        <ReportMetric icon={ReceiptText} label="Mensalidade • CLT e Salão" value={currency.format(productionReport.brokerBase.value)} />
        <ReportMetric icon={UserRoundCheck} label="Contratos • CLT e Salão" value={productionReport.brokerBase.contracts.toLocaleString('pt-BR')} />
        <ReportMetric icon={ReceiptText} label="Mensalidade • Equipes" value={currency.format(productionReport.supervisorBase.value)} />
        <ReportMetric icon={UsersRound} label="Vidas • Equipes" value={productionReport.supervisorBase.lives.toLocaleString('pt-BR')} />
      </div>
    </div>
  )
}

function ReportMetric({ icon: Icon, label, value }: { icon: typeof ReceiptText; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-white p-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700"><Icon className="h-5 w-5" /></div>
      <div className="min-w-0">
        <p className="truncate text-[9px] font-extrabold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="mt-1 truncate text-lg font-black text-navy-950">{value}</p>
      </div>
    </div>
  )
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-9 text-xs font-bold text-slate-700 outline-none focus:border-blue-500">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
      <Trophy className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
    </label>
  )
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="grid min-h-72 place-items-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <div>
        <Search className="mx-auto h-8 w-8 text-slate-300" />
        <h3 className="mt-3 font-black text-navy-950">Nenhuma campanha encontrada</h3>
        <button onClick={onClear} className="mt-4 rounded-xl bg-navy-900 px-4 py-2.5 text-xs font-bold text-white">Limpar filtros</button>
      </div>
    </div>
  )
}

function RealtimeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-navy-950/70 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div className="relative w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-500"><X className="h-4 w-4" /></button>
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-limebrand text-navy-950 shadow-glow"><Sparkles className="h-7 w-7" /></div>
        <h2 className="mt-5 text-xl font-black text-navy-950">Vendas em tempo real</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">Funcionalidade em desenvolvimento. Em breve este painel será integrado às vendas em tempo real.</p>
        <button onClick={onClose} className="mt-6 w-full rounded-xl bg-navy-900 py-3 text-sm font-black text-white">Entendido</button>
      </div>
    </div>
  )
}
