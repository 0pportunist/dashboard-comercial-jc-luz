import { AlertCircle, CheckCircle2, X } from 'lucide-react'

interface ToastProps {
  message: string
  tone?: 'error' | 'success'
  onClose: () => void
}

export function Toast({ message, tone = 'error', onClose }: ToastProps) {
  const success = tone === 'success'

  return (
    <div
      role={success ? 'status' : 'alert'}
      aria-live="assertive"
      className={`fixed right-4 top-4 z-[100] flex max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-2xl ${
        success
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : 'border-red-200 bg-red-50 text-red-800'
      }`}
    >
      {success ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /> : <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />}
      <p className="flex-1 text-sm font-semibold leading-5">{message}</p>
      <button type="button" onClick={onClose} aria-label="Fechar mensagem" className="rounded-lg p-1 transition hover:bg-black/5">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
