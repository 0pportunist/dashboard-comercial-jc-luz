import { useEffect, useState } from 'react'
import { FirebaseError } from 'firebase/app'
import { Chrome, LockKeyhole, ShieldCheck } from 'lucide-react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface LocationState {
  from?: {
    pathname?: string
  }
}

function getSignInErrorMessage(error: unknown) {
  if (!(error instanceof FirebaseError)) {
    return error instanceof Error ? error.message : 'Não foi possível entrar com o Google.'
  }

  const messages: Record<string, string> = {
    'auth/operation-not-allowed': 'O login com Google ainda não foi habilitado no Firebase Authentication.',
    'auth/unauthorized-domain': `O endereço ${window.location.hostname} não está autorizado no Firebase. Adicione-o em Authentication > Settings > Authorized domains.`,
    'auth/popup-blocked': 'O navegador bloqueou a janela de login. Permita pop-ups para este endereço e tente novamente.',
    'auth/popup-closed-by-user': 'A janela de login foi fechada antes da conclusão.',
    'auth/cancelled-popup-request': 'Outra tentativa de login já está em andamento.',
    'auth/network-request-failed': 'Não foi possível acessar o Firebase. Verifique a internet e tente novamente.',
    'auth/invalid-api-key': 'A chave VITE_FIREBASE_API_KEY do arquivo .env não é válida.',
  }

  return messages[error.code] ?? `Falha no login com Google (${error.code}).`
}

export function Login() {
  const { user, loading, signInWithGoogle, isConfigured } = useAuth()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const destination = (location.state as LocationState | null)?.from?.pathname ?? '/dashboard'

  useEffect(() => {
    if (!loading && user) {
      navigate(destination, { replace: true })
    }
  }, [destination, loading, navigate, user])

  if (!loading && user) {
    return <Navigate to={destination} replace />
  }

  async function handleGoogleSignIn() {
    setError('')
    setSubmitting(true)
    try {
      await signInWithGoogle()
    } catch (signInError) {
      setError(getSignInErrorMessage(signInError))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-navy-950 px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(41,121,255,0.24),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(185,239,47,0.16),transparent_35%)]" />
      <section className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl">
        <div className="bg-navy-900 px-7 py-8 text-white">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-limebrand text-navy-950 shadow-glow">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xl font-black tracking-tight">JC LUZ</p>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-limebrand">Dashboard Comercial</p>
            </div>
          </div>
          <h1 className="mt-8 text-3xl font-black tracking-tight">Acesse sua área comercial</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Entre com sua conta Google autorizada para visualizar campanhas, equipe e desempenho.
          </p>
        </div>

        <div className="p-7">
          <div className="flex items-start gap-3 rounded-2xl bg-blue-50 p-4">
            <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
            <p className="text-xs leading-5 text-slate-600">
              O conteúdo exibido será ajustado automaticamente ao seu nível de acesso.
            </p>
          </div>

          {!isConfigured && (
            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs font-semibold leading-5 text-amber-800">
              Firebase ainda não configurado. Preencha as variáveis VITE_FIREBASE_* no arquivo .env.
            </p>
          )}

          {error && (
            <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-semibold leading-5 text-red-700">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={submitting || !isConfigured}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-navy-900 px-4 py-3.5 text-sm font-black text-white transition hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Chrome className="h-5 w-5" />
            {submitting ? 'Entrando...' : 'Entrar com o Google'}
          </button>
        </div>
      </section>
    </main>
  )
}
