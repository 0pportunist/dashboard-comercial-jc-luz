import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import {
  ArrowLeft,
  CalendarPlus,
  CheckCircle2,
  FileUp,
  ListChecks,
  LoaderCircle,
  LogOut,
  Pencil,
  Save,
  Search,
  UploadCloud,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BrandLogo } from '../components/BrandLogo'
import { useAuth } from '../contexts/AuthContext'
import { useDashboardData } from '../contexts/DataContext'
import { administrators } from '../data/administrators'
import { operators } from '../data/campaigns'
import type { Audience, Campaign, CampaignStatus, PrizeType, UnitType } from '../types'
import type { ParsedReport } from '../utils/reportParser'

type AdminTab = 'reports' | 'campaigns' | 'manage'

const accentOptions = [
  'from-blue-500 to-indigo-700',
  'from-emerald-500 to-teal-700',
  'from-amber-400 to-orange-600',
  'from-violet-500 to-purple-700',
  'from-rose-500 to-red-700',
]

const slugify = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const monthNumbers: Record<string, string> = {
  jan: '01',
  fev: '02',
  mar: '03',
  abr: '04',
  mai: '05',
  jun: '06',
  jul: '07',
  ago: '08',
  set: '09',
  out: '10',
  nov: '11',
  dez: '12',
}

function dateFromPeriod(period: string, position: 'start' | 'end') {
  const part = period.split('—')[position === 'start' ? 0 : 1]?.trim() ?? ''
  const numeric = part.match(/(\d{2})\/(\d{2})\/(\d{4})/)
  if (numeric) return `${numeric[3]}-${numeric[2]}-${numeric[1]}`
  const textual = part.match(/(\d{1,2})\s+([a-zç]{3})\s+(\d{4})/i)
  if (textual) return `${textual[3]}-${monthNumbers[textual[2].toLowerCase()]}-${textual[1].padStart(2, '0')}`
  return position === 'end' ? '' : new Date().toISOString().slice(0, 10)
}

export function Admin() {
  const [tab, setTab] = useState<AdminTab>('reports')
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <header className="bg-navy-950 text-white">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <BrandLogo color="white" orientation="horizontal" className="w-36 sm:w-44" />
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => navigate('/dashboard')} className="flex h-10 items-center gap-2 rounded-xl bg-white/10 px-3 text-xs font-bold hover:bg-white/15">
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </button>
            <button type="button" onClick={logout} className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 hover:bg-white/15" aria-label="Sair">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-blue-700">Acesso exclusivo</p>
          <h1 className="mt-1 text-3xl font-black text-navy-950">Administração do dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">Importe fechamentos comerciais ou publique novas campanhas.</p>
        </div>

        <div className="mt-6 flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-2 shadow-card sm:flex-row">
          <TabButton active={tab === 'reports'} onClick={() => setTab('reports')} icon={FileUp} label="Adicionar relatório" />
          <TabButton active={tab === 'campaigns'} onClick={() => setTab('campaigns')} icon={CalendarPlus} label="Nova campanha" />
          <TabButton active={tab === 'manage'} onClick={() => setTab('manage')} icon={ListChecks} label="Gerenciar campanhas" />
        </div>

        <div className="mt-6">
          {tab === 'reports' && <ReportImporter />}
          {tab === 'campaigns' && <CampaignForm />}
          {tab === 'manage' && <CampaignManager />}
        </div>
      </main>
    </div>
  )
}

function TabButton({ active, onClick, icon: Icon, label }: {
  active: boolean
  onClick: () => void
  icon: typeof FileUp
  label: string
}) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-black transition-colors duration-200 ${
      active ? 'bg-navy-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
    }`}>
      <Icon className="h-4 w-4" /> {label}
    </button>
  )
}

function ReportImporter() {
  const { productionReport, salesTeams, applyReport } = useDashboardData()
  const [parsed, setParsed] = useState<ParsedReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const { parseSixVoxReport } = await import('../utils/reportParser')
      setParsed(await parseSixVoxReport(file, productionReport, salesTeams))
    } catch (reason) {
      setParsed(null)
      setError(reason instanceof Error ? reason.message : 'Não foi possível processar o relatório.')
    } finally {
      setLoading(false)
    }
  }

  const updateTotal = (field: 'value' | 'contracts' | 'lives', value: number) => {
    if (!parsed) return
    const baseKey = parsed.kind === 'broker' ? 'brokerBase' : 'supervisorBase'
    setParsed({
      ...parsed,
      productionReport: {
        ...parsed.productionReport,
        [baseKey]: { ...parsed.productionReport[baseKey], [field]: value },
      },
    })
  }

  const confirm = () => {
    if (!parsed) return
    applyReport({
      productionReport: parsed.productionReport,
      brokerRankings: parsed.kind === 'broker' ? parsed.rankings : undefined,
      supervisorRankings: parsed.kind === 'supervisor' ? parsed.rankings : undefined,
      salesTeams: parsed.salesTeams,
    })
    setSuccess(`${parsed.fileName} aplicado ao dashboard com sucesso.`)
    setParsed(null)
  }

  const base = parsed?.kind === 'broker'
    ? parsed.productionReport.brokerBase
    : parsed?.productionReport.supervisorBase

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-700">
          <UploadCloud className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-xl font-black text-navy-950">Enviar relatório SixVox</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Selecione o PDF de produção de corretores ou supervisores. O sistema identifica o tipo automaticamente.
        </p>
        <label className="mt-6 flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 px-5 py-8 text-center transition-colors duration-200 hover:border-blue-400">
          {loading ? <LoaderCircle className="h-8 w-8 animate-spin text-blue-700" /> : <FileUp className="h-8 w-8 text-blue-700" />}
          <span className="mt-3 text-sm font-black text-navy-950">{loading ? 'Processando PDF...' : 'Selecionar relatório PDF'}</span>
          <span className="mt-1 text-xs text-slate-500">Relatório de Produção por Equipe</span>
          <input type="file" accept="application/pdf,.pdf" onChange={handleFile} disabled={loading} className="sr-only" />
        </label>
        <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          Os dados ficam salvos neste navegador. Uma API ou banco de dados será necessário para compartilhar as alterações entre computadores.
        </p>
        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700">{error}</p>}
        {success && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700">{success}</p>}
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
        <h2 className="text-xl font-black text-navy-950">Prévia da atualização</h2>
        {!parsed || !base ? (
          <div className="mt-5 grid min-h-64 place-items-center rounded-2xl bg-slate-50 text-center">
            <div>
              <FileUp className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-3 text-sm font-bold text-slate-500">Envie um PDF para revisar os dados extraídos.</p>
            </div>
          </div>
        ) : (
          <div className="mt-5">
            <div className="rounded-xl bg-blue-50 p-4">
              <p className="text-xs font-black text-blue-800">{parsed.kind === 'broker' ? 'Corretores • CLT e Salão' : 'Supervisores • Todas as equipes'}</p>
              <p className="mt-1 text-xs text-slate-600">{parsed.productionReport.period} • emitido em {parsed.productionReport.issuedAt}</p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <NumberField label="Mensalidade" value={base.value} step="0.01" onChange={(value) => updateTotal('value', value)} />
              <NumberField label="Contratos" value={base.contracts} onChange={(value) => updateTotal('contracts', value)} />
              <NumberField label="Vidas" value={base.lives} onChange={(value) => updateTotal('lives', value)} />
            </div>
            <div className="mt-4 rounded-xl border border-slate-100 p-4">
              <p className="text-xs font-black text-navy-950">{parsed.rankings.length} posições identificadas para o ranking</p>
              <div className="mt-3 space-y-2">
                {parsed.rankings.slice(0, 3).map((entry) => (
                  <div key={`${entry.position}-${entry.name}`} className="flex justify-between gap-4 text-xs">
                    <span className="truncate font-semibold text-slate-600">{entry.position}. {entry.name}</span>
                    <span className="shrink-0 font-black text-navy-950">{entry.sales} contratos</span>
                  </div>
                ))}
              </div>
            </div>
            <button type="button" onClick={confirm} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-navy-900 py-3.5 text-sm font-black text-white hover:bg-navy-800">
              <Save className="h-4 w-4" /> Confirmar e atualizar dashboard
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

function NumberField({ label, value, step = '1', onChange }: {
  label: string
  value: number
  step?: string
  onChange: (value: number) => void
}) {
  return (
    <label>
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{label}</span>
      <input type="number" min="0" step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold outline-none focus:border-blue-500" />
    </label>
  )
}

function CampaignManager() {
  const { campaigns } = useDashboardData()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<CampaignStatus | 'Todos'>('Ativa')
  const [editing, setEditing] = useState<Campaign | null>(null)
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR')
    return campaigns.filter((campaign) => (
      (!normalizedQuery || campaign.name.toLocaleLowerCase('pt-BR').includes(normalizedQuery))
      && (status === 'Todos' || campaign.status === status)
    ))
  }, [campaigns, query, status])

  if (editing) {
    return (
      <CampaignForm
        key={editing.id}
        campaign={editing}
        onCancel={() => setEditing(null)}
        onSaved={() => setEditing(null)}
      />
    )
  }

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h2 className="text-xl font-black text-navy-950">Gerenciar campanhas vigentes</h2>
          <p className="mt-1 text-sm text-slate-500">Atualize período, status, metas, regras, prêmio ou imagem.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Buscar campanha para editar"
              placeholder="Buscar campanha..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 sm:w-64"
            />
          </label>
          <label>
            <span className="sr-only">Filtrar campanhas por status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as CampaignStatus | 'Todos')}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600 outline-none focus:border-blue-500"
            >
              {['Ativa', 'Futura', 'Encerrada', 'Todos'].map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {filtered.map((campaign) => (
          <article key={campaign.id} className="flex flex-col gap-4 rounded-2xl border border-slate-100 p-4 transition-colors duration-200 hover:border-blue-200 sm:flex-row sm:items-center">
            <img src={campaign.image} alt="" loading="lazy" decoding="async" className="h-20 w-full rounded-xl object-cover sm:w-28" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate font-black text-navy-950">{campaign.name}</h3>
                <span className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase ${
                  campaign.status === 'Ativa'
                    ? 'bg-emerald-50 text-emerald-700'
                    : campaign.status === 'Futura'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-slate-100 text-slate-500'
                }`}>{campaign.status}</span>
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-500">{campaign.period}</p>
              <p className="mt-2 truncate text-xs text-slate-400">
                Operadoras: {campaign.operators.join(' • ')}
              </p>
              {campaign.administrators && campaign.administrators.length > 0 && (
                <p className="mt-1 truncate text-xs font-semibold text-amber-700">
                  Administradoras: {campaign.administrators.join(' • ')}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setEditing(campaign)}
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-navy-900 px-4 py-3 text-xs font-black text-white hover:bg-navy-800"
            >
              <Pencil className="h-4 w-4" /> Editar campanha
            </button>
          </article>
        ))}
        {filtered.length === 0 && (
          <div className="grid min-h-48 place-items-center rounded-2xl bg-slate-50 text-center">
            <p className="text-sm font-bold text-slate-500">Nenhuma campanha encontrada.</p>
          </div>
        )}
      </div>
    </section>
  )
}

function CampaignForm({ campaign, onCancel, onSaved }: {
  campaign?: Campaign
  onCancel?: () => void
  onSaved?: () => void
}) {
  const { addCampaign, updateCampaign } = useDashboardData()
  const navigate = useNavigate()
  const [success, setSuccess] = useState('')
  const [selectedOperators, setSelectedOperators] = useState<string[]>(campaign?.operators ?? [])
  const [selectedAdministrators, setSelectedAdministrators] = useState<string[]>(campaign?.administrators ?? [])
  const [image, setImage] = useState(campaign?.image ?? '')
  const isEditing = Boolean(campaign)

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImage(String(reader.result))
    reader.readAsDataURL(file)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name'))
    const startDate = String(form.get('startDate'))
    const endDate = String(form.get('endDate'))
    const rules = String(form.get('rules')).split('\n').map((rule) => rule.trim()).filter(Boolean)
    const submittedCampaign: Campaign = {
      id: campaign?.id ?? `${slugify(name)}-${Date.now()}`,
      name,
      shortName: String(form.get('shortName') || name),
      period: `${new Date(`${startDate}T12:00:00`).toLocaleDateString('pt-BR')} — ${new Date(`${endDate}T12:00:00`).toLocaleDateString('pt-BR')}`,
      endDate,
      operators: selectedOperators,
      administrators: selectedAdministrators,
      prizeType: String(form.get('prizeType')) as PrizeType,
      audience: String(form.get('audience')) as Audience,
      mainPrize: String(form.get('mainPrize')),
      image: image || campaign?.image || '/campaigns/show-premios.jpg',
      status: String(form.get('status')) as CampaignStatus,
      description: String(form.get('description')),
      rules,
      goals: [{
        label: String(form.get('goalLabel')),
        current: Number(form.get('current')),
        target: Number(form.get('target')),
        unit: String(form.get('unit')) as UnitType,
      }],
      accent: String(form.get('accent')),
      icon: campaign?.icon ?? 'trophy',
    }
    if (isEditing) {
      updateCampaign(submittedCampaign)
      setSuccess(`Campanha “${name}” atualizada com sucesso.`)
      window.setTimeout(() => onSaved?.(), 900)
    } else {
      addCampaign(submittedCampaign)
      setSuccess(`Campanha “${name}” adicionada com sucesso.`)
      event.currentTarget.reset()
      setSelectedOperators([])
      setSelectedAdministrators([])
      setImage('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-black text-navy-950">{isEditing ? 'Editar campanha vigente' : 'Cadastrar nova campanha'}</h2>
          <p className="mt-1 text-sm text-slate-500">{isEditing ? 'As alterações aparecerão imediatamente no dashboard.' : 'A campanha aparecerá imediatamente no dashboard.'}</p>
        </div>
        {success && <span className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700"><CheckCircle2 className="h-4 w-4" /> {success}</span>}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <TextField name="name" label="Nome da campanha" defaultValue={campaign?.name} required />
        <TextField name="shortName" label="Nome curto" defaultValue={campaign?.shortName} required />
        <TextField name="startDate" label="Data inicial" type="date" defaultValue={campaign ? dateFromPeriod(campaign.period, 'start') : undefined} required />
        <TextField name="endDate" label="Data final" type="date" defaultValue={campaign?.endDate || (campaign ? dateFromPeriod(campaign.period, 'end') : undefined)} required />
        <SelectField name="status" label="Status" options={['Ativa', 'Futura', 'Encerrada']} defaultValue={campaign?.status} />
        <SelectField name="prizeType" label="Tipo de prêmio" options={['Viagem', 'Experiência', 'Produto', 'Dinheiro']} defaultValue={campaign?.prizeType} />
        <SelectField name="audience" label="Público elegível" options={['Todos', 'Corretores', 'Supervisores']} defaultValue={campaign?.audience} />
        <TextField name="mainPrize" label="Prêmio principal" defaultValue={campaign?.mainPrize} required />
      </div>

      <fieldset className="mt-5">
        <legend className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Operadoras</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {operators.map((operator) => (
            <label key={operator} className={`cursor-pointer rounded-xl border px-3 py-2 text-xs font-bold transition-colors duration-200 ${
              selectedOperators.includes(operator) ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-slate-200 text-slate-500'
            }`}>
              <input
                type="checkbox"
                className="sr-only"
                checked={selectedOperators.includes(operator)}
                onChange={() => setSelectedOperators((current) =>
                  current.includes(operator) ? current.filter((item) => item !== operator) : [...current, operator])}
              />
              {operator}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
        <legend className="px-2 text-xs font-extrabold uppercase tracking-wider text-amber-800">Administradoras</legend>
        <p className="mb-3 text-xs text-amber-800/70">Selecione apenas quando a campanha for comercializada por uma administradora.</p>
        <div className="flex flex-wrap gap-2">
          {administrators.map((administrator) => (
            <label key={administrator} className={`cursor-pointer rounded-xl border px-3 py-2 text-xs font-bold transition-colors duration-200 ${
              selectedAdministrators.includes(administrator)
                ? 'border-amber-600 bg-amber-100 text-amber-900'
                : 'border-amber-200 bg-white text-amber-800'
            }`}>
              <input
                type="checkbox"
                className="sr-only"
                checked={selectedAdministrators.includes(administrator)}
                onChange={() => setSelectedAdministrators((current) =>
                  current.includes(administrator)
                    ? current.filter((item) => item !== administrator)
                    : [...current, administrator])}
              />
              {administrator}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="md:col-span-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Descrição</span>
          <textarea name="description" defaultValue={campaign?.description} required rows={3} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500" />
        </label>
        <label className="md:col-span-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Regras principais, uma por linha</span>
          <textarea name="rules" defaultValue={campaign?.rules.join('\n')} required rows={4} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500" />
        </label>
        <TextField name="goalLabel" label="Nome da meta" defaultValue={campaign?.goals[0]?.label} required />
        <SelectField name="unit" label="Unidade da meta" options={['valor', 'vidas', 'contratos']} defaultValue={campaign?.goals[0]?.unit} />
        <TextField name="current" label="Realizado atual" type="number" defaultValue={campaign?.goals[0]?.current} required />
        <TextField name="target" label="Meta" type="number" defaultValue={campaign?.goals[0]?.target} required />
        <SelectField name="accent" label="Cor do card" options={accentOptions} defaultValue={campaign?.accent} />
        <label>
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Imagem da campanha</span>
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImage} className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs" />
          {campaign?.image && <span className="mt-1 block text-[10px] text-slate-400">Deixe vazio para manter a imagem atual.</span>}
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={() => onCancel ? onCancel() : navigate('/dashboard')} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600">Cancelar</button>
        <button type="submit" disabled={selectedOperators.length === 0} className="flex items-center justify-center gap-2 rounded-xl bg-navy-900 px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-50">
          {isEditing ? <Save className="h-4 w-4" /> : <CalendarPlus className="h-4 w-4" />}
          {isEditing ? 'Salvar alterações' : 'Publicar campanha'}
        </button>
      </div>
    </form>
  )
}

function TextField({ name, label, type = 'text', required = false, defaultValue }: {
  name: string
  label: string
  type?: string
  required?: boolean
  defaultValue?: string | number
}) {
  return (
    <label>
      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">{label}</span>
      <input name={name} type={type} required={required} defaultValue={defaultValue} min={type === 'number' ? 0 : undefined} step={type === 'number' ? 'any' : undefined} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500" />
    </label>
  )
}

function SelectField({ name, label, options, defaultValue }: { name: string; label: string; options: string[]; defaultValue?: string }) {
  return (
    <label>
      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">{label}</span>
      <select name={name} defaultValue={defaultValue} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  )
}
