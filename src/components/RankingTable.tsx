import { ArrowUpRight, Medal } from 'lucide-react'
import type { RankingEntry } from '../types'
import { getTeamLogo } from '../utils/getTeamLogo'

interface RankingTableProps {
  title: string
  subtitle: string
  data: RankingEntry[]
  type: 'broker' | 'supervisor'
}

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

function positionStyle(position: number) {
  if (position === 1) return 'bg-amber-100 text-amber-700'
  if (position === 2) return 'bg-slate-200 text-slate-600'
  if (position === 3) return 'bg-orange-100 text-orange-700'
  return 'bg-slate-50 text-slate-500'
}

export function RankingTable({ title, subtitle, data, type }: RankingTableProps) {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-slate-100 p-5">
        <div>
          <div className="flex items-center gap-2">
            <Medal className="h-5 w-5 text-goldbrand" />
            <h2 className="font-black tracking-tight text-navy-950">{title}</h2>
          </div>
          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        </div>
        <button className="flex items-center gap-1 text-xs font-bold text-blue-700">
          Ver ranking <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="bg-slate-50/80 text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
              <th className="px-5 py-3">Pos.</th>
              <th className="px-3 py-3">{type === 'broker' ? 'Corretor' : 'Supervisor'}</th>
              <th className="px-3 py-3">Equipe</th>
              <th className="px-3 py-3 text-center">Contratos</th>
              <th className="px-3 py-3 text-center">Vidas</th>
              <th className="px-3 py-3">Mensalidade</th>
              <th className="px-5 py-3 text-right">% Produção</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((entry) => (
              <tr key={entry.name} className="group text-xs transition hover:bg-blue-50/30">
                <td className="px-5 py-3.5">
                  <span className={`grid h-7 w-7 place-items-center rounded-lg font-black ${positionStyle(entry.position)}`}>
                    {entry.position}
                  </span>
                </td>
                <td className="px-3 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-navy-900 text-[10px] font-bold text-white">
                      {entry.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                    </span>
                    <span className="font-bold text-navy-950">{entry.name}</span>
                  </div>
                </td>
                <td className="max-w-[190px] px-3 py-3.5 font-semibold text-slate-600">
                  {entry.team ? (
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-lg border border-slate-100 bg-white p-0.5 shadow-sm">
                        <img
                          src={getTeamLogo(entry.team)}
                          alt={`Logo da ${entry.team}`}
                          className="h-full w-full object-contain"
                        />
                      </span>
                      <span className="truncate">{entry.team}</span>
                    </div>
                  ) : (
                    <span className="truncate">{entry.operator}</span>
                  )}
                </td>
                <td className="px-3 py-3.5 text-center font-black text-navy-950">{entry.sales}</td>
                <td className="px-3 py-3.5 text-center font-black text-navy-950">{entry.lives?.toLocaleString('pt-BR') ?? '—'}</td>
                <td className="px-3 py-3.5 font-bold text-slate-700">{currency.format(entry.value)}</td>
                <td className="px-5 py-3.5 text-right">
                  <span className="rounded-full bg-blue-50 px-2 py-1 font-black text-blue-700">
                    {entry.productionShare?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) ?? '—'}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
