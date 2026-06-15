import { useState, type FormEvent } from 'react'
import { Eye, EyeOff, LockKeyhole } from 'lucide-react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { BrandLogo } from '../components/BrandLogo'
import { Toast } from '../components/Toast'
import { useAuth } from '../contexts/AuthContext'

interface LocationState {
  from?: {
    pathname?: string
  }
}

export function LoginPage() {
  const { isAuthenticated, isConfigured, login } = useAuth()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const destination = (location.state as LocationState | null)?.from?.pathname ?? '/dashboard'

  if (isAuthenticated) {
    return <Navigate to={destination} replace />
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (login(password)) {
      navigate(destination, { replace: true })
      return
    }

    setError(isConfigured ? 'Senha incorreta.' : 'Defina VITE_ADMIN_PASSWORD no arquivo .env e reinicie o servidor.')
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-navy-950 px-4 py-10">
      {error && <Toast message={error} onClose={() => setError('')} />}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(41,121,255,0.24),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(185,239,47,0.16),transparent_35%)]" />
      <section className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl">
        <div className="bg-navy-900 px-7 py-8 text-white">
          <div>
            <BrandLogo
              color="white"
              orientation="horizontal"
              className="w-48"
            />
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-limebrand">
              Dashboard Comercial
            </p>
          </div>
          <h1 className="mt-8 text-3xl font-black tracking-tight">Acesso administrativo</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Digite a senha de administrador para acessar campanhas, equipes e desempenho.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-7">
          <div className="flex items-start gap-3 rounded-2xl bg-blue-50 p-4">
            <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
            <p className="text-xs leading-5 text-slate-600">
              O acesso não é salvo. Ao atualizar ou fechar a aba, a senha será solicitada novamente.
            </p>
          </div>

          <label className="mt-6 block">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Senha</span>
            <span className="relative mt-2 block">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                autoFocus
                required
                placeholder="Digite a senha administrativa"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-4 pr-12 text-sm font-semibold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-navy-900"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </span>
          </label>

          <button
            type="submit"
            disabled={!password}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-navy-900 px-4 py-3.5 text-sm font-black text-white transition hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LockKeyhole className="h-5 w-5" />
            Entrar
          </button>
        </form>
      </section>
    </main>
  )
}
