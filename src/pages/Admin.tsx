import { useState, type ChangeEvent, type FormEvent } from 'react'
import {
  ArrowLeft,
  CalendarPlus,
  CheckCircle2,
  FileUp,
  LoaderCircle,
  LogOut,
  Save,
  UploadCloud,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BrandLogo } from '../components/BrandLogo'
import { useAuth } from '../contexts/AuthContext'
import { useDashboardData } from '../contexts/DataContext'
import { operators } from '../data/campaigns'
import type { Audience, Campaign, CampaignStatus, PrizeType, UnitType } from '../types'
import type { ParsedReport } from '../utils/reportParser'

type AdminTab = 'reports' | 'campaigns'

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
            <button onClick={() => navigate('/dashboard')} className="flex h-10 items-center gap-2 rounded-xl bg-white/10 px-3 text-xs font-bold hover:bg-white/15">
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </button>
            <button onClick={logout} className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 hover:bg-white/15" aria-label="Sair">
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

        <div className="mt-6 flex gap-2 rounded-2xl border border-slate-100 bg-white p-2 shadow-card">
          <TabButton active={tab === 'reports'} onClick={() => setTab('reports')} icon={FileUp} label="Adicionar relatório" />
          <TabButton active={tab === 'campaigns'} onClick={() => setTab('campaigns')} icon={CalendarPlus} label="Nova campanha" />
        </div>

        <div className="mt-6">
          {tab === 'reports' ? <ReportImporter /> : <CampaignForm />}
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
    <button onClick={onClick} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-black transition ${
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
        <label className="mt-6 flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 px-5 py-8 text-center transition hover:border-blue-400">
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
            <button onClick={confirm} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-navy-900 py-3.5 text-sm font-black text-white hover:bg-navy-800">
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

function CampaignForm() {
  const { addCampaign } = useDashboardData()
  const navigate = useNavigate()
  const [success, setSuccess] = useState('')
  const [selectedOperators, setSelectedOperators] = useState<string[]>([])
  const [image, setImage] = useState('')

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
    const campaign: Campaign = {
      id: `${slugify(name)}-${Date.now()}`,
      name,
      shortName: String(form.get('shortName') || name),
      period: `${new Date(`${startDate}T12:00:00`).toLocaleDateString('pt-BR')} — ${new Date(`${endDate}T12:00:00`).toLocaleDateString('pt-BR')}`,
      endDate,
      operators: selectedOperators,
      prizeType: String(form.get('prizeType')) as PrizeType,
      audience: String(form.get('audience')) as Audience,
      mainPrize: String(form.get('mainPrize')),
      image: image || '/campaigns/show-premios.jpg',
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
      icon: 'trophy',
    }
    addCampaign(campaign)
    setSuccess(`Campanha “${name}” adicionada com sucesso.`)
    event.currentTarget.reset()
    setSelectedOperators([])
    setImage('')
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-black text-navy-950">Cadastrar nova campanha</h2>
          <p className="mt-1 text-sm text-slate-500">A campanha aparecerá imediatamente no dashboard.</p>
        </div>
        {success && <span className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700"><CheckCircle2 className="h-4 w-4" /> {success}</span>}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <TextField name="name" label="Nome da campanha" required />
        <TextField name="shortName" label="Nome curto" required />
        <TextField name="startDate" label="Data inicial" type="date" required />
        <TextField name="endDate" label="Data final" type="date" required />
        <SelectField name="status" label="Status" options={['Ativa', 'Futura', 'Encerrada']} />
        <SelectField name="prizeType" label="Tipo de prêmio" options={['Viagem', 'Experiência', 'Produto', 'Dinheiro']} />
        <SelectField name="audience" label="Público elegível" options={['Todos', 'Corretores', 'Supervisores']} />
        <TextField name="mainPrize" label="Prêmio principal" required />
      </div>

      <fieldset className="mt-5">
        <legend className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Operadoras</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {operators.map((operator) => (
            <label key={operator} className={`cursor-pointer rounded-xl border px-3 py-2 text-xs font-bold transition ${
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

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="md:col-span-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Descrição</span>
          <textarea name="description" required rows={3} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500" />
        </label>
        <label className="md:col-span-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Regras principais, uma por linha</span>
          <textarea name="rules" required rows={4} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500" />
        </label>
        <TextField name="goalLabel" label="Nome da meta" required />
        <SelectField name="unit" label="Unidade da meta" options={['valor', 'vidas', 'contratos']} />
        <TextField name="current" label="Realizado atual" type="number" required />
        <TextField name="target" label="Meta" type="number" required />
        <SelectField name="accent" label="Cor do card" options={accentOptions} />
        <label>
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Imagem da campanha</span>
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImage} className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs" />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={() => navigate('/dashboard')} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600">Cancelar</button>
        <button type="submit" disabled={selectedOperators.length === 0} className="flex items-center justify-center gap-2 rounded-xl bg-navy-900 px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-50">
          <CalendarPlus className="h-4 w-4" /> Publicar campanha
        </button>
      </div>
    </form>
  )
}

function TextField({ name, label, type = 'text', required = false }: {
  name: string
  label: string
  type?: string
  required?: boolean
}) {
  return (
    <label>
      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">{label}</span>
      <input name={name} type={type} required={required} min={type === 'number' ? 0 : undefined} step={type === 'number' ? 'any' : undefined} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500" />
    </label>
  )
}

function SelectField({ name, label, options }: { name: string; label: string; options: string[] }) {
  return (
    <label>
      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">{label}</span>
      <select name={name} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  )
}
