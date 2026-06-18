import { useEffect, useRef, useState, type RefObject } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { AdministratorFilters } from '../components/AdministratorFilters'
import { DashboardHeader } from '../components/DashboardHeader'
import { MetricCard } from '../components/MetricCard'
import { OperatorFilters } from '../components/OperatorFilters'
import { RankingTable } from '../components/RankingTable'
import { RealtimeSalesButton } from '../components/RealtimeSalesButton'
import { TeamsSection } from '../components/TeamsSection'
import { useAuth } from '../contexts/AuthContext'
import { useDashboardData } from '../contexts/DataContext'
import { administrators } from '../data/administrators'
import { operators as operatorCatalog } from '../data/campaigns'
import { useFilteredCampaigns } from '../hooks/useFilteredCampaigns'
import type { Audience, Campaign, CampaignStatus, PrizeType, ProductionReport as ProductionReportType } from '../types'
import { resolveDashboardTheme } from '../utils/dashboardTheme'

const statusOptions: Array<CampaignStatus | 'Todos'> = ['Todos', 'Ativa', 'Futura', 'Encerrada']
const prizeOptions: Array<PrizeType | 'Todos'> = ['Todos', 'Viagem', 'Experiência', 'Produto', 'Dinheiro']
const audienceOptions: Array<Audience | 'Todos'> = ['Todos', 'Corretores', 'Supervisores']

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 2,
})

export function Dashboard() {
  const { logout } = useAuth()
  const { campaigns, brokerRankings, productionReport, salesTeams, supervisorRankings } = useDashboardData()
  const navigate = useNavigate()
  const [selectedOperator, setSelectedOperator] = useState('Todas')
  const [selectedAdministrator, setSelectedAdministrator] = useState('Todas')
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

  const visibleOperators = [...new Set([...operatorCatalog, ...campaigns.flatMap((campaign) => campaign.operators)])]
  const activeCampaigns = campaigns.filter((campaign) => campaign.status === 'Ativa')
  const futureCampaigns = campaigns.filter((campaign) => campaign.status === 'Futura')
  const endedCampaigns = campaigns.filter((campaign) => campaign.status === 'Encerrada')
  const closestEnding = [...activeCampaigns].sort((a, b) => a.endDate.localeCompare(b.endDate))[0]
  const dashboardTheme = resolveDashboardTheme(selectedAdministrator, selectedOperator)

  const filteredCampaigns = useFilteredCampaigns(campaigns, {
    query,
    operator: selectedOperator,
    administrator: selectedAdministrator,
    status,
    prizeType,
    audience,
  })

  useEffect(() => {
    if (!selectedCampaign || !filteredCampaigns.some((campaign) => campaign.id === selectedCampaign.id)) {
      setSelectedCampaign(filteredCampaigns[0] ?? null)
    }
  }, [filteredCampaigns, selectedCampaign])

  const scrollTo = (ref: RefObject<HTMLElement | HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const clearFilters = () => {
    setSelectedOperator('Todas')
    setSelectedAdministrator('Todas')
    setQuery('')
    setStatus('Todos')
    setPrizeType('Todos')
    setAudience('Todos')
  }

  return (
    <div
      data-theme={dashboardTheme}
      className={`dashboard-theme min-h-screen text-slate-800 ${dashboardTheme === 'supermed' ? 'dashboard-theme-supermed' : ''}`}
    >
      <DashboardHeader
        onOverviewClick={() => scrollTo(overviewRef)}
        onCampaignsClick={() => scrollTo(campaignsRef)}
        onRankingsClick={() => scrollTo(rankingsRef)}
        onTeamsClick={() => scrollTo(teamsRef)}
        onAdminClick={() => navigate('/admin')}
        onAssistantClick={() => navigate('/assistant')}
        onSignOut={logout}
        reportPeriod={productionReport.period}
        reportIssuedAt={productionReport.issuedAt}
      />

      <main className="mx-auto max-w-[1440px] px-4 pb-14 sm:px-6 lg:px-8">
        <section ref={overviewRef} className="-mt-1 scroll-mt-5 py-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            <MetricCard label="Total de campanhas" value={campaigns.length} helper="no calendário comercial" icon={Layers3} tone="blue" />
            <MetricCard label="Campanhas ativas" value={activeCampaigns.length} helper="em andamento agora" icon={Activity} tone="lime" />
            <MetricCard label="Campanhas futuras" value={futureCampaigns.length} helper="próximos lançamentos" icon={Clock3} tone="blue" />
            <MetricCard label="Encerradas" value={endedCampaigns.length} helper="ciclos concluídos" icon={CheckCircle2} tone="slate" />
            <MetricCard label="Operadoras" value={visibleOperators.length} helper="parceiras participantes" icon={Building2} tone="gold" />
            <MetricCard label="Mais próxima do fim" value={closestEnding?.shortName ?? '—'} helper={closestEnding ? `até ${closestEnding.period.split('—')[1]?.trim()}` : 'sem campanha ativa'} icon={CalendarClock} tone="gold" />
          </div>
        </section>

        <div>
          <AdministratorFilters
            administrators={administrators}
            selected={selectedAdministrator}
            onChange={setSelectedAdministrator}
          />
        </div>
        <section className="mt-3 flex flex-col gap-3 lg:flex-row">
          <div className="min-w-0 flex-1">
            <OperatorFilters operators={visibleOperators} selected={selectedOperator} onChange={setSelectedOperator} />
          </div>
          <RealtimeSalesButton onClick={() => setRealtimeModal(true)} />
        </section>

        <section ref={rankingsRef} className="mt-7 scroll-mt-5">
          <ProductionReport report={productionReport} />

          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-blue-700">Desempenho comercial</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-navy-950">Ranking comercial</h2>
            </div>
            <button
              onClick={() => scrollTo(campaignsRef)}
              className="flex items-center justify-center gap-2 rounded-xl bg-[var(--dashboard-action)] px-4 py-3 text-xs font-bold text-[var(--dashboard-action-text)] transition hover:bg-[var(--dashboard-action-hover)]"
            >
              Ver Campanhas Ativas <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <RankingTable
              title="Corretores - Período atual"
              subtitle="Base CLT e Salão"
              data={brokerRankings}
              type="broker"
            />
            <RankingTable
              title="Supervisores - Período atual"
              subtitle="Base consolidada de todas as equipes"
              data={supervisorRankings}
              type="supervisor"
            />
          </div>
        </section>

        <div ref={teamsRef} className="scroll-mt-5 pt-12">
          <TeamsSection teams={salesTeams} />
        </div>

        <section ref={campaignsRef} className="scroll-mt-5 pt-12">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-blue-700">Portfólio de incentivos</p>
              <h2 className="mt-1 text-3xl font-black tracking-tight text-navy-950">Campanhas comerciais</h2>
              <p className="mt-2 text-sm text-slate-500">Campanhas disponíveis para acompanhamento administrativo.</p>
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
            <FilterSelect label="Público" value={audience} options={audienceOptions} onChange={(value) => setAudience(value as Audience | 'Todos')} />
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
          <p className="font-semibold">Acesso administrativo local</p>
        </div>
      </footer>

      {realtimeModal && <RealtimeModal onClose={() => setRealtimeModal(false)} />}
    </div>
  )
}

function ProductionReport({ report }: { report: ProductionReportType }) {
  return (
    <div className="mb-7 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-card">
      <div className="flex flex-col justify-between gap-2 bg-blue-50/70 px-5 py-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-blue-700">Fechamento mais recente</p>
          <h2 className="mt-1 font-black text-navy-950">Produção de {report.period}</h2>
        </div>
        <p className="text-xs font-semibold text-slate-500">Relatórios SixVox emitidos em {report.issuedAt}</p>
      </div>
      <div className="grid gap-px bg-slate-100 sm:grid-cols-2 lg:grid-cols-4">
        <ReportMetric icon={ReceiptText} label="Mensalidade • CLT e Salão" value={currency.format(report.brokerBase.value)} />
        <ReportMetric icon={UserRoundCheck} label="Contratos • CLT e Salão" value={report.brokerBase.contracts.toLocaleString('pt-BR')} />
        <ReportMetric icon={ReceiptText} label="Mensalidade • Equipes" value={currency.format(report.supervisorBase.value)} />
        <ReportMetric icon={UsersRound} label="Vidas • Equipes" value={report.supervisorBase.lives.toLocaleString('pt-BR')} />
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
        <button onClick={onClear} className="mt-4 rounded-xl bg-[var(--dashboard-action)] px-4 py-2.5 text-xs font-bold text-[var(--dashboard-action-text)]">Limpar filtros</button>
      </div>
    </div>
  )
}

function RealtimeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-navy-950/70 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div className="relative w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-500"><X className="h-4 w-4" /></button>
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[var(--dashboard-primary)] text-[var(--dashboard-action-text)] shadow-glow"><Sparkles className="h-7 w-7" /></div>
        <h2 className="mt-5 text-xl font-black text-navy-950">Vendas em tempo real</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">Funcionalidade em desenvolvimento. Em breve este painel será integrado às vendas em tempo real.</p>
        <button onClick={onClose} className="mt-6 w-full rounded-xl bg-[var(--dashboard-action)] py-3 text-sm font-black text-[var(--dashboard-action-text)]">Entendido</button>
      </div>
    </div>
  )
}
