import defaultTeamLogo from '../assets/team-logos/default-logo.svg'

const logos = import.meta.glob<string>('/src/assets/team-logos/*.{png,jpg,jpeg,svg}', {
  eager: true,
  import: 'default',
})

function normalizeTeamName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/[^a-z0-9]/g, '')
}

export function getLogoForTeam(teamName: string) {
  const normalizedTeamName = normalizeTeamName(teamName)

  for (const [path, logo] of Object.entries(logos)) {
    const fileName = path.split('/').pop()?.replace(/\.[^.]+$/, '')

    if (fileName && normalizeTeamName(fileName) === normalizedTeamName) {
      return logo
    }
  }

  return null
}

export function getTeamLogo(teamName: string) {
  return getLogoForTeam(teamName) ?? defaultTeamLogo
}
