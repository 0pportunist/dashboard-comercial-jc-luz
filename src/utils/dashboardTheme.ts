export type DashboardTheme = 'default' | 'supermed' | 'qualicorp'

function normalizeThemeTarget(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
}

export function isSupermedSelection(value: string) {
  return normalizeThemeTarget(value).includes('supermed')
}

const qualicorpAliases = [
  'qualicorp',
  'qualicorp administradora de beneficios',
  'qualicorp adm de beneficios',
  'administradora qualicorp',
]

export function isQualicorpSelection(value: string) {
  const normalized = normalizeThemeTarget(value).replace(/\./g, '')
  return qualicorpAliases.some((alias) => normalized.includes(alias))
}

export function resolveDashboardTheme(...selectedValues: string[]): DashboardTheme {
  if (selectedValues.some(isSupermedSelection)) return 'supermed'
  if (selectedValues.some(isQualicorpSelection)) return 'qualicorp'
  return 'default'
}
