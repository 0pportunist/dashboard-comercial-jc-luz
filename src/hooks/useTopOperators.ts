import { useMemo } from 'react'
import type { RankingEntry } from '../types'

export interface OperatorSales {
  operator: string
  sales: number
}

export function calculateTopOperators(rankings: RankingEntry[], limit = 5) {
  const totals = rankings.reduce<Record<string, number>>((result, entry) => {
    if (entry.operator) result[entry.operator] = (result[entry.operator] ?? 0) + entry.sales
    return result
  }, {})

  return Object.entries(totals)
    .map(([operator, sales]) => ({ operator, sales }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, limit)
}

export function useTopOperators(rankings: RankingEntry[], limit = 5) {
  return useMemo(() => calculateTopOperators(rankings, limit), [limit, rankings])
}
