import { useMemo } from 'react'
import type { Audience, Campaign, CampaignStatus, PrizeType } from '../types'

interface CampaignFilters {
  query: string
  operator: string
  administrator: string
  status: CampaignStatus | 'Todos'
  prizeType: PrizeType | 'Todos'
  audience: Audience | 'Todos'
}

export function useFilteredCampaigns(campaigns: Campaign[], filters: CampaignFilters) {
  return useMemo(() => {
    const normalizedQuery = filters.query.trim().toLocaleLowerCase('pt-BR')

    return campaigns.filter((campaign) => {
      const matchesQuery = !normalizedQuery || campaign.name.toLocaleLowerCase('pt-BR').includes(normalizedQuery)
      const matchesOperator = filters.operator === 'Todas' || campaign.operators.includes(filters.operator)
      const matchesAdministrator = filters.administrator === 'Todas'
        || campaign.administrators?.includes(filters.administrator)
      const matchesStatus = filters.status === 'Todos' || campaign.status === filters.status
      const matchesPrize = filters.prizeType === 'Todos' || campaign.prizeType === filters.prizeType
      const matchesAudience = filters.audience === 'Todos'
        || campaign.audience === filters.audience
        || campaign.audience === 'Todos'

      return matchesQuery && matchesOperator && matchesAdministrator && matchesStatus && matchesPrize && matchesAudience
    })
  }, [campaigns, filters.administrator, filters.audience, filters.operator, filters.prizeType, filters.query, filters.status])
}
