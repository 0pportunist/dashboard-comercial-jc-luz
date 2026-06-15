import { campaigns as defaultCampaigns } from '../data/campaigns'
import { brokerRankings as defaultBrokerRankings, supervisorRankings as defaultSupervisorRankings } from '../data/rankings'
import { salesTeams as defaultSalesTeams } from '../data/teams'
import type { Campaign, RankingEntry, SalesTeam } from '../types'

export interface AssistantData {
  campaigns: Campaign[]
  brokerRankings: RankingEntry[]
  supervisorRankings: RankingEntry[]
  salesTeams: SalesTeam[]
}

const defaultData: AssistantData = {
  campaigns: defaultCampaigns,
  brokerRankings: defaultBrokerRankings,
  supervisorRankings: defaultSupervisorRankings,
  salesTeams: defaultSalesTeams,
}

const normalize = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR')

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

const formatGoal = (campaign: Campaign) => campaign.goals.map((goal) => {
  const remaining = Math.max(goal.target - goal.current, 0)
  const percentage = goal.target > 0 ? Math.round((goal.current / goal.target) * 100) : 0
  const format = goal.unit === 'valor'
    ? (value: number) => currency.format(value)
    : (value: number) => `${value.toLocaleString('pt-BR')} ${goal.unit}`

  return `${goal.label}: ${format(goal.current)} de ${format(goal.target)} (${percentage}%). Faltam ${format(remaining)}.`
}).join('\n')

function findMentionedCampaign(question: string, campaigns: Campaign[]) {
  const normalizedQuestion = normalize(question)
  return campaigns.find((campaign) => {
    const normalizedName = normalize(campaign.name)
    const normalizedShortName = normalize(campaign.shortName)
    return normalizedQuestion.includes(normalizedName)
      || normalizedQuestion.includes(normalizedShortName)
      || normalizedName.split(' ').filter((word) => word.length > 4).some((word) => normalizedQuestion.includes(word))
  })
}

export function getCampaignInfo(question: string, data: AssistantData = defaultData) {
  const normalizedQuestion = normalize(question)
  const mentioned = findMentionedCampaign(question, data.campaigns)

  if (mentioned) {
    const details = [
      `${mentioned.name} está ${mentioned.status.toLocaleLowerCase('pt-BR')} e ocorre em ${mentioned.period}.`,
      `Operadoras: ${mentioned.operators.join(', ')}.`,
      `Público: ${mentioned.audience}. Prêmio principal: ${mentioned.mainPrize}.`,
    ]
    if (normalizedQuestion.includes('meta') || normalizedQuestion.includes('falta') || normalizedQuestion.includes('progresso')) {
      details.push(`Metas:\n${formatGoal(mentioned)}`)
    }
    if (normalizedQuestion.includes('regra') || normalizedQuestion.includes('como participar')) {
      details.push(`Regras principais:\n- ${mentioned.rules.join('\n- ')}`)
    }
    return details.join('\n\n')
  }

  const active = data.campaigns
    .filter((campaign) => campaign.status === 'Ativa')
    .sort((a, b) => a.endDate.localeCompare(b.endDate))

  if (normalizedQuestion.includes('quando') || normalizedQuestion.includes('termina') || normalizedQuestion.includes('prazo') || normalizedQuestion.includes('data')) {
    return active.length
      ? `Campanhas ativas por prazo:\n${active.map((campaign) => `- ${campaign.name}: ${campaign.period}`).join('\n')}`
      : 'Não há campanhas ativas cadastradas no momento.'
  }

  if (normalizedQuestion.includes('meta') || normalizedQuestion.includes('progresso')) {
    return active.length
      ? `Resumo das metas ativas:\n\n${active.map((campaign) => `${campaign.name}\n${formatGoal(campaign)}`).join('\n\n')}`
      : 'Não há metas de campanhas ativas cadastradas.'
  }

  return active.length
    ? `Há ${active.length} campanhas ativas:\n${active.map((campaign) => `- ${campaign.name}: ${campaign.mainPrize} • encerra em ${campaign.endDate.split('-').reverse().join('/')}`).join('\n')}`
    : 'Não há campanhas ativas cadastradas no momento.'
}

export function getRouteSuggestions(data: AssistantData = defaultData) {
  const rankings = [...data.brokerRankings, ...data.supervisorRankings]
  const salesByOperator = rankings.reduce<Record<string, number>>((totals, entry) => {
    if (entry.operator) totals[entry.operator] = (totals[entry.operator] ?? 0) + entry.sales
    return totals
  }, {})
  const rankedOperators = Object.entries(salesByOperator).sort((a, b) => b[1] - a[1])

  if (rankedOperators.length > 0) {
    const route = rankedOperators.slice(0, 5)
      .map(([operator, sales], index) => `${index + 1}. ${operator}: ${sales} vendas registradas`)
      .join('\n')
    return `Rota sugerida pelo volume de vendas registrado:\n${route}\n\nPriorize primeiro as operadoras com maior tração e use as campanhas ativas delas como argumento comercial.`
  }

  const opportunities = new Map<string, { campaigns: number; remaining: number; nearestEnd: string }>()
  data.campaigns.filter((campaign) => campaign.status === 'Ativa').forEach((campaign) => {
    const remaining = campaign.goals.reduce((total, goal) => total + Math.max(goal.target - goal.current, 0), 0)
    campaign.operators.forEach((operator) => {
      const current = opportunities.get(operator) ?? { campaigns: 0, remaining: 0, nearestEnd: campaign.endDate }
      opportunities.set(operator, {
        campaigns: current.campaigns + 1,
        remaining: current.remaining + remaining,
        nearestEnd: current.nearestEnd < campaign.endDate ? current.nearestEnd : campaign.endDate,
      })
    })
  })
  const route = [...opportunities.entries()]
    .sort((a, b) => b[1].campaigns - a[1].campaigns || a[1].nearestEnd.localeCompare(b[1].nearestEnd))
    .slice(0, 5)
    .map(([operator, opportunity], index) =>
      `${index + 1}. ${operator}: ${opportunity.campaigns} campanha(s) ativa(s), prazo mais próximo em ${opportunity.nearestEnd.split('-').reverse().join('/')}`)
    .join('\n')

  return `O ranking atual não informa a operadora de cada venda, então não é possível calcular volume por operadora com segurança.\n\nRota alternativa baseada nas oportunidades cadastradas:\n${route}\n\nPara obter uma rota estritamente baseada em vendas, os próximos relatórios precisam incluir o campo operadora em cada registro.`
}

function getRankingInfo(data: AssistantData) {
  const brokers = data.brokerRankings.slice(0, 3)
  const supervisors = data.supervisorRankings.slice(0, 3)
  return [
    'Top 3 corretores:',
    ...brokers.map((entry) => `${entry.position}. ${entry.name} • ${entry.sales} contratos • ${currency.format(entry.value)}`),
    '',
    'Top 3 supervisores:',
    ...supervisors.map((entry) => `${entry.position}. ${entry.name} (${entry.team ?? 'equipe não informada'}) • ${entry.sales} contratos • ${currency.format(entry.value)}`),
  ].join('\n')
}

function getTeamInfo(question: string, data: AssistantData) {
  const normalizedQuestion = normalize(question)
  const mentioned = data.salesTeams.find((team) =>
    normalizedQuestion.includes(normalize(team.name))
    || normalizedQuestion.includes(normalize(team.supervisor)))
  if (mentioned) {
    return `${mentioned.name} é liderada por ${mentioned.supervisor}, possui ${mentioned.collaborators} colaboradores e registra ${mentioned.contracts} contratos, ${mentioned.lives} vidas e ${currency.format(mentioned.value)} em produção.`
  }
  const leaders = [...data.salesTeams].sort((a, b) => b.value - a.value).slice(0, 5)
  return `Equipes com maior produção:\n${leaders.map((team, index) => `${index + 1}. ${team.name} • ${team.supervisor} • ${currency.format(team.value)}`).join('\n')}`
}

export function handleAssistantQuery(question: string, data: AssistantData = defaultData) {
  const normalizedQuestion = normalize(question)
  if (['tracar rota', 'qual a rota', 'rota de venda', 'rota comercial', 'onde focar', 'operadora focar'].some((term) => normalizedQuestion.includes(term))) {
    return getRouteSuggestions(data)
  }
  if (['campanha', 'campanhas', 'meta', 'metas', 'quando termina', 'prazo', 'data', 'premio', 'regra'].some((term) => normalizedQuestion.includes(term))) {
    return getCampaignInfo(question, data)
  }
  if (['ranking', 'corretor', 'supervisor', 'quem vendeu', 'mais vendeu'].some((term) => normalizedQuestion.includes(term))) {
    return getRankingInfo(data)
  }
  if (['equipe', 'equipes', 'time'].some((term) => normalizedQuestion.includes(term))) {
    return getTeamInfo(question, data)
  }
  return 'Estou em uma versão simplificada e uso somente os dados internos do dashboard. Pergunte sobre campanhas, metas, prazos, rankings, equipes ou peça uma rota de vendas.'
}
