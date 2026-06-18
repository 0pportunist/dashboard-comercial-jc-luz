export type DashboardTheme = 'default' | 'supermed'

function normalizeThemeTarget(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
}

export function isSupermedSelection(value: string) {
  return normalizeThemeTarget(value).includes('supermed')
}

export function resolveDashboardTheme(...selectedValues: string[]): DashboardTheme {
  return selectedValues.some(isSupermedSelection) ? 'supermed' : 'default'
}
