import { useMemo, useRef, useState } from 'react'
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
import { CampaignCard } from './components/CampaignCard'
import { CampaignDetails } from './components/CampaignDetails'
import { DashboardHeader } from './components/DashboardHeader'
import { MetricCard } from './components/MetricCard'
import { OperatorFilters } from './components/OperatorFilters'
import { RankingTable } from './components/RankingTable'
import { RealtimeSalesButton } from './components/RealtimeSalesButton'
import { TeamsSection } from './components/TeamsSection'
import { campaigns, operators } from './data/campaigns'
import { brokerRankings, productionReport, supervisorRankings } from './data/rankings'
import type { Audience, Campaign, CampaignStatus, PrizeType } from './types'

const statusOptions: Array<CampaignStatus | 'Todos'> = ['Todos', 'Ativa', 'Futura', 'Encerrada']
const prizeOptions: Array<PrizeType | 'Todos'> = ['Todos', 'Viagem', 'Experiência', 'Produto', 'Dinheiro']
const audienceOptions: Array<Audience | 'Todos'> = ['Todos', 'Corretores', 'Supervisores']

function App() {
  const [selectedOperator, setSelectedOperator] = useState('Todas')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<CampaignStatus | 'Todos'>('Todos')
  const [prizeType, setPrizeType] = useState<PrizeType | 'Todos'>('Todos')
  const [audience, setAudience] = useState<Audience | 'Todos'>('Todos')
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(campaigns[0])
  const [realtimeModal, setRealtimeModal] = useState(false)
  const overviewRef = useRef<HTMLElement>(null)
  const rankingsRef = useRef<HTMLElement>(null)
  const teamsRef = useRef<HTMLDivElement>(null)
  const campaignsRef = useRef<HTMLElement>(null)

  const activeCampaigns = campaigns.filter((campaign) => campaign.status === 'Ativa')
  const futureCampaigns = campaigns.filter((campaign) => campaign.status === 'Futura')
  const endedCampaigns = campaigns.filter((campaign) => campaign.status === 'Encerrada')
  const closestEnding = [...activeCampaigns].sort((a, b) => a.endDate.localeCompare(b.endDate))[0]

  const filteredCampaigns = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR')
    return campaigns.filter((campaign) => {
      const matchesQuery = !normalizedQuery || campaign.name.toLocaleLowerCase('pt-BR').includes(normalizedQuery)
      const matchesOperator = selectedOperator === 'Todas' || campaign.operators.includes(selectedOperator)
      const matchesStatus = status === 'Todos' || campaign.status === status
      const matchesPrize = prizeType === 'Todos' || campaign.prizeType === prizeType
      const matchesAudience = audience === 'Todos' || campaign.audience === audience || campaign.audience === 'Todos'
      return matchesQuery && matchesOperator && matchesStatus && matchesPrize && matchesAudience
    })
  }, [audience, prizeType, query, selectedOperator, status])

  const scrollToCampaigns = () => campaignsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const scrollToOverview = () => overviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const scrollToRankings = () => rankingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const scrollToTeams = () => teamsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

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
        onOverviewClick={scrollToOverview}
        onCampaignsClick={scrollToCampaigns}
        onRankingsClick={scrollToRankings}
        onTeamsClick={scrollToTeams}
      />

      <main className="mx-auto max-w-[1440px] px-4 pb-14 sm:px-6 lg:px-8">
        <section ref={overviewRef} className="-mt-1 scroll-mt-5 grid grid-cols-2 gap-3 py-5 sm:grid-cols-3 xl:grid-cols-6">
          <MetricCard label="Total de campanhas" value={campaigns.length} helper="no calendário comercial" icon={Layers3} tone="blue" />
          <MetricCard label="Campanhas ativas" value={activeCampaigns.length} helper="em andamento agora" icon={Activity} tone="lime" />
          <MetricCard label="Campanhas futuras" value={futureCampaigns.length} helper="próximos lançamentos" icon={Clock3} tone="blue" />
          <MetricCard label="Encerradas" value={endedCampaigns.length} helper="ciclos concluídos" icon={CheckCircle2} tone="slate" />
          <MetricCard label="Operadoras" value={operators.length} helper="parceiras participantes" icon={Building2} tone="gold" />
          <MetricCard label="Mais próxima do fim" value={closestEnding.shortName} helper={`até ${closestEnding.period.split('—')[1]?.trim()}`} icon={CalendarClock} tone="gold" />
        </section>

        <section className="flex flex-col gap-3 lg:flex-row">
          <div className="min-w-0 flex-1">
            <OperatorFilters operators={operators} selected={selectedOperator} onChange={setSelectedOperator} />
          </div>
          <RealtimeSalesButton onClick={() => setRealtimeModal(true)} />
        </section>

        <section ref={rankingsRef} className="mt-7 scroll-mt-5">
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
            <p className="border-t border-slate-100 px-5 py-3 text-[11px] leading-5 text-slate-500">
              As bases CLT e Salão e Todas as Equipes possuem escopos diferentes. Operadoras e campanhas não são detalhadas por venda nesses relatórios.
            </p>
          </div>
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-blue-700">Pódio comercial</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-navy-950">Quem está fazendo acontecer</h2>
            </div>
            <button
              onClick={scrollToCampaigns}
              className="flex items-center justify-center gap-2 rounded-xl bg-navy-900 px-4 py-3 text-xs font-bold text-white transition hover:bg-navy-800"
            >
              Ver Campanhas Ativas <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            <RankingTable title="Ranking de Maio - Corretores" subtitle="Base CLT e Salão • mensalidade cadastrada" data={brokerRankings} type="broker" />
            <RankingTable title="Ranking de Maio - Supervisores" subtitle="Base consolidada de todas as equipes" data={supervisorRankings} type="supervisor" />
          </div>
        </section>

        <div ref={teamsRef} className="scroll-mt-5 pt-12">
          <TeamsSection />
        </div>

        <section ref={campaignsRef} className="scroll-mt-5 pt-12">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-blue-700">Portfólio de incentivos</p>
              <h2 className="mt-1 text-3xl font-black tracking-tight text-navy-950">Campanhas comerciais</h2>
              <p className="mt-2 text-sm text-slate-500">Encontre oportunidades, acompanhe o progresso e chegue mais longe.</p>
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
                    <CampaignCard
                      key={campaign.id}
                      campaign={campaign}
                      selected={selectedCampaign?.id === campaign.id}
                      onSelect={setSelectedCampaign}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid min-h-72 place-items-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                  <div>
                    <Search className="mx-auto h-8 w-8 text-slate-300" />
                    <h3 className="mt-3 font-black text-navy-950">Nenhuma campanha encontrada</h3>
                    <p className="mt-1 text-sm text-slate-500">Tente ajustar a busca ou limpar os filtros.</p>
                    <button onClick={clearFilters} className="mt-4 rounded-xl bg-navy-900 px-4 py-2.5 text-xs font-bold text-white">Limpar filtros</button>
                  </div>
                </div>
              )}
            </div>
            {selectedCampaign && <CampaignDetails campaign={selectedCampaign} onClose={() => setSelectedCampaign(null)} />}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-2 px-4 text-xs text-slate-400 sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 JC Luz Corretora de Seguros. Dados demonstrativos.</p>
          <p className="font-semibold">Painel Comercial • Versão 1.0</p>
        </div>
      </footer>

      {realtimeModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy-950/70 p-4 backdrop-blur-sm" onMouseDown={() => setRealtimeModal(false)}>
          <div className="relative w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
            <button onClick={() => setRealtimeModal(false)} className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-500">
              <X className="h-4 w-4" />
            </button>
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-limebrand text-navy-950 shadow-glow">
              <Sparkles className="h-7 w-7" />
            </div>
            <h2 className="mt-5 text-xl font-black text-navy-950">Vendas em tempo real</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Funcionalidade em desenvolvimento. Em breve este painel será integrado às vendas em tempo real.
            </p>
            <button onClick={() => setRealtimeModal(false)} className="mt-6 w-full rounded-xl bg-navy-900 py-3 text-sm font-black text-white transition hover:bg-navy-800">
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

interface FilterSelectProps {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 2,
})

interface ReportMetricProps {
  icon: typeof ReceiptText
  label: string
  value: string
}

function ReportMetric({ icon: Icon, label, value }: ReportMetricProps) {
  return (
    <div className="flex items-center gap-3 bg-white p-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[9px] font-extrabold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="mt-1 truncate text-lg font-black text-navy-950">{value}</p>
      </div>
    </div>
  )
}

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-9 text-xs font-bold text-slate-700 outline-none focus:border-blue-500"
      >
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
      <Trophy className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
    </label>
  )
}

export default App
