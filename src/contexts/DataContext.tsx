import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { campaigns as initialCampaigns } from '../data/campaigns'
import {
  brokerRankings as initialBrokerRankings,
  productionReport as initialProductionReport,
  supervisorRankings as initialSupervisorRankings,
} from '../data/rankings'
import { salesTeams as initialSalesTeams } from '../data/teams'
import type { Campaign, ProductionReport, RankingEntry, SalesTeam } from '../types'

interface ReportUpdate {
  productionReport: ProductionReport
  brokerRankings?: RankingEntry[]
  supervisorRankings?: RankingEntry[]
  salesTeams?: SalesTeam[]
}

interface DataContextValue {
  campaigns: Campaign[]
  brokerRankings: RankingEntry[]
  supervisorRankings: RankingEntry[]
  productionReport: ProductionReport
  salesTeams: SalesTeam[]
  addCampaign: (campaign: Campaign) => void
  updateCampaign: (campaign: Campaign) => void
  applyReport: (update: ReportUpdate) => void
}

interface StoredData {
  campaigns: Campaign[]
  brokerRankings: RankingEntry[]
  supervisorRankings: RankingEntry[]
  productionReport: ProductionReport
  salesTeams: SalesTeam[]
}

const STORAGE_KEY = 'jc-luz-dashboard-data-v1'
const DataContext = createContext<DataContextValue | undefined>(undefined)

function loadStoredData(): StoredData {
  const fallback: StoredData = {
    campaigns: initialCampaigns,
    brokerRankings: initialBrokerRankings,
    supervisorRankings: initialSupervisorRankings,
    productionReport: initialProductionReport,
    salesTeams: initialSalesTeams,
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? { ...fallback, ...JSON.parse(stored) as StoredData } : fallback
  } catch {
    return fallback
  }
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoredData>(loadStoredData)

  const updateData = (updater: (current: StoredData) => StoredData) => {
    setData((current) => {
      const updated = updater(current)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const value = useMemo<DataContextValue>(() => ({
    ...data,
    addCampaign: (campaign) => updateData((current) => ({
      ...current,
      campaigns: [campaign, ...current.campaigns.filter((item) => item.id !== campaign.id)],
    })),
    updateCampaign: (campaign) => updateData((current) => ({
      ...current,
      campaigns: current.campaigns.map((item) => item.id === campaign.id ? campaign : item),
    })),
    applyReport: (update) => updateData((current) => ({
      ...current,
      productionReport: update.productionReport,
      brokerRankings: update.brokerRankings ?? current.brokerRankings,
      supervisorRankings: update.supervisorRankings ?? current.supervisorRankings,
      salesTeams: update.salesTeams ?? current.salesTeams,
    })),
  }), [data])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDashboardData() {
  const context = useContext(DataContext)
  if (!context) throw new Error('useDashboardData deve ser usado dentro de DataProvider.')
  return context
}
