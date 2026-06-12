export type CampaignStatus = 'Ativa' | 'Futura' | 'Encerrada'
export type PrizeType = 'Viagem' | 'Experiência' | 'Produto' | 'Dinheiro'
export type Audience = 'Corretores' | 'Supervisores' | 'Todos'
export type UnitType = 'valor' | 'vidas' | 'contratos'

export interface CampaignGoal {
  label: string
  current: number
  target: number
  unit: UnitType
}

export interface Campaign {
  id: string
  name: string
  shortName: string
  period: string
  endDate: string
  operators: string[]
  prizeType: PrizeType
  audience: Audience
  mainPrize: string
  image: string
  status: CampaignStatus
  description: string
  rules: string[]
  goals: CampaignGoal[]
  accent: string
  icon: string
}

export interface RankingEntry {
  position: number
  name: string
  operator?: string
  team?: string
  sales: number
  lives?: number
  value: number
  campaign: string
  goalPercentage?: number
  productionShare?: number
}

export type SalesDepartment = 'Vendas G1' | 'Vendas G2' | 'Vendas Externas'

export interface SalesTeam {
  id: string
  name: string
  supervisor: string
  role: string
  department: SalesDepartment
  collaborators: number
  value: number
  contracts: number
  lives: number
  reportName: string
  dataWarning?: string
}

export type AuthRole = 'admin' | 'supervisor' | 'corretor'

export interface AccessProfile {
  role: AuthRole
  teamId?: string
  brokerName?: string
  source: 'claim' | 'email-map' | 'default'
}
