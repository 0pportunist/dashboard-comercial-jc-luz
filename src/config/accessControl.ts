import { brokerRankings } from '../data/rankings'
import { salesTeams } from '../data/teams'
import type { AccessProfile, AuthRole } from '../types'

type EmailMap = Record<string, string>

function parseEmailMap(value: string | undefined): EmailMap {
  if (!value) return {}

  try {
    const parsed = JSON.parse(value) as EmailMap
    return Object.fromEntries(
      Object.entries(parsed).map(([email, target]) => [email.toLocaleLowerCase(), target]),
    )
  } catch {
    console.warn('Mapa de acesso por e-mail inválido. Use um objeto JSON.')
    return {}
  }
}

function normalizeName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .trim()
}

function isAuthRole(value: unknown): value is AuthRole {
  return value === 'admin' || value === 'supervisor' || value === 'corretor'
}

const adminEmails = new Set(
  (import.meta.env.VITE_ADMIN_EMAILS || 'chsmluz@gmail.com')
    .split(',')
    .map((email: string) => email.trim().toLocaleLowerCase())
    .filter(Boolean),
)

const supervisorEmailMap = parseEmailMap(import.meta.env.VITE_SUPERVISOR_EMAIL_MAP)
const brokerEmailMap = parseEmailMap(import.meta.env.VITE_BROKER_EMAIL_MAP)

interface ResolveAccessInput {
  email: string | null
  claims: Record<string, unknown>
}

export function resolveAccessProfile({ email, claims }: ResolveAccessInput): AccessProfile {
  const normalizedEmail = email?.trim().toLocaleLowerCase() ?? ''
  const claimRole = claims.role

  if (isAuthRole(claimRole)) {
    return {
      role: claimRole,
      teamId: typeof claims.teamId === 'string' ? claims.teamId : undefined,
      brokerName: typeof claims.brokerName === 'string' ? claims.brokerName : undefined,
      source: 'claim',
    }
  }

  if (adminEmails.has(normalizedEmail)) {
    return { role: 'admin', source: 'email-map' }
  }

  const mappedTeamId = supervisorEmailMap[normalizedEmail]
  if (mappedTeamId && salesTeams.some((team) => team.id === mappedTeamId)) {
    return { role: 'supervisor', teamId: mappedTeamId, source: 'email-map' }
  }

  const mappedBrokerName = brokerEmailMap[normalizedEmail]
  if (
    mappedBrokerName
    && brokerRankings.some((broker) => normalizeName(broker.name) === normalizeName(mappedBrokerName))
  ) {
    return { role: 'corretor', brokerName: mappedBrokerName, source: 'email-map' }
  }

  return { role: 'corretor', source: 'default' }
}
