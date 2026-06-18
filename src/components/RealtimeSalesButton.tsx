import { Radio } from 'lucide-react'

interface RealtimeSalesButtonProps {
  onClick: () => void
}

export function RealtimeSalesButton({ onClick }: RealtimeSalesButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[var(--dashboard-action)] px-5 py-4 text-sm font-black text-[var(--dashboard-action-text)] shadow-glow transition hover:-translate-y-0.5 hover:bg-[var(--dashboard-action-hover)]"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-70" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
      </span>
      <Radio className="h-4 w-4" />
      Vendas em tempo real
    </button>
  )
}
