import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import type { ProductionReport, RankingEntry, SalesTeam } from '../types'

GlobalWorkerOptions.workerSrc = workerUrl

export interface ParsedReport {
  kind: 'broker' | 'supervisor'
  fileName: string
  productionReport: ProductionReport
  rankings: RankingEntry[]
  salesTeams?: SalesTeam[]
}

const moneyToNumber = (value: string) =>
  Number(value.replace(/\./g, '').replace(',', '.'))

const countToNumber = (value: string) => Number(value.replace(/\./g, ''))

const titleCase = (value: string) =>
  value.replace(/\s+\((?:CORRETOR|VENDEDOR)\)\s*$/i, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/(^|\s)\S/g, (letter) => letter.toLocaleUpperCase('pt-BR'))

function uniqueByName(rows: RankingEntry[]) {
  return [...new Map(rows.map((row) => [row.name.toLocaleUpperCase('pt-BR'), row])).values()]
}

const formatDate = (value: string) => {
  const [day, month, year] = value.split(/[-/]/).map(Number)
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    .format(new Date(year, month - 1, day))
}

function extractRows(text: string, kind: ParsedReport['kind'], team?: string): RankingEntry[] {
  const rows: RankingEntry[] = []
  const rowPattern = kind === 'supervisor'
    ? /^\s*(\d+)\s+(.+?)\s+\(SUPERVISOR(?:A)?\)(?:\s+\([^)]*\)|\s+G3)?\s+R\$\s*([\d.]+,\d{2})\s+([\d.]+)\s+([\d.]+)\s*$/gim
    : /^\s*(\d+)\s+\d+\s+-\s+(.+?)\s+\([^)]*\)\s+R\$\s*([\d.]+,\d{2})\s+([\d.]+)\s+([\d.]+)\s*$/gim

  for (const match of text.matchAll(rowPattern)) {
    rows.push({
      position: Number(match[1]),
      name: titleCase(match[2].trim()),
      team,
      value: moneyToNumber(match[3]),
      sales: countToNumber(match[4]),
      lives: countToNumber(match[5]),
      campaign: 'Produção importada',
    })
  }
  return rows
}

export async function parseSixVoxReport(
  file: File,
  currentReport: ProductionReport,
  teams: SalesTeam[],
): Promise<ParsedReport> {
  const document = await getDocument({ data: await file.arrayBuffer() }).promise
  const pages: string[] = []

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber)
    const content = await page.getTextContent()
    pages.push(content.items.map((item) => (
      'str' in item ? `${item.str}${item.hasEOL ? '\n' : ' '}` : ''
    )).join(''))
  }

  const fullText = pages.join('\n')
  const kind: ParsedReport['kind'] = /\bEQUPE\s+MENSALIDADE/i.test(fullText) ? 'supervisor' : 'broker'
  const periodMatch = fullText.match(/CADASTRO:\s*De\s*(\d{2}\/\d{2}\/\d{4})\s*a\s*(\d{2}\/\d{2}\/\d{4})/i)
  const issuedMatch = fullText.match(/SixVox\s*-\s*(\d{1,2}[-/]\d{1,2}[-/]\d{4})/i)
  const totalMatches = [...fullText.matchAll(/Total\s+R\$\s*([\d.]+,\d{2})\s+([\d.]+)\s+([\d.]+)/gi)]
  const total = totalMatches[totalMatches.length - 1]

  if (!periodMatch || !issuedMatch || !total) {
    throw new Error('Não foi possível identificar período, emissão e total no relatório SixVox.')
  }

  const period = `${periodMatch[1]} a ${periodMatch[2]}`
  const issuedAt = formatDate(issuedMatch[1])
  const base = {
    label: kind === 'broker' ? 'CLT e Salão' : 'Todas as equipes',
    value: moneyToNumber(total[1]),
    contracts: countToNumber(total[2]),
    lives: countToNumber(total[3]),
  }
  const productionReport: ProductionReport = {
    period,
    issuedAt,
    brokerBase: kind === 'broker' ? base : currentReport.brokerBase,
    supervisorBase: kind === 'supervisor' ? base : currentReport.supervisorBase,
  }

  if (kind === 'supervisor') {
    const allRows = uniqueByName(extractRows(fullText, kind))
    const rankings = allRows
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
      .map((entry, index) => ({ ...entry, position: index + 1, campaign: `Produção ${period}` }))

    const updatedTeams = teams.map((team) => {
      const row = allRows.find((entry) =>
        entry.name.toLocaleUpperCase('pt-BR').includes(team.reportName.toLocaleUpperCase('pt-BR'))
        || team.reportName.toLocaleUpperCase('pt-BR').includes(entry.name.toLocaleUpperCase('pt-BR')))
      return row ? { ...team, value: row.value, contracts: row.sales, lives: row.lives ?? 0 } : team
    })

    return { kind, fileName: file.name, productionReport, rankings, salesTeams: updatedTeams }
  }

  const rows = pages.flatMap((pageText) => {
    const supervisor = pageText.match(/Relatório de Produção por Equipe\s+(.+?)\s+\(SUPERVISOR/i)?.[1]?.trim()
    const matchedTeam = teams.find((team) =>
      supervisor && (
        supervisor.includes(team.reportName)
        || team.reportName.includes(supervisor)
      ))
    return extractRows(pageText, kind, matchedTeam?.name)
  })

  const rankings = uniqueByName(rows)
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)
    .map((entry, index) => ({ ...entry, position: index + 1, campaign: `Produção ${period}` }))

  return { kind, fileName: file.name, productionReport, rankings }
}
