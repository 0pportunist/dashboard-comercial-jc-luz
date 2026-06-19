import { useMemo, useState, type FormEvent } from 'react'
import { ArrowLeft, Bot, LogOut, Send, Sparkles, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BrandLogo } from '../components/BrandLogo'
import { Toast } from '../components/Toast'
import { useAuth } from '../contexts/AuthContext'
import { useDashboardData } from '../contexts/DataContext'
import { useTopOperators } from '../hooks/useTopOperators'
import { handleAssistantQuery } from '../services/assistant'
import { sanitizeHtml } from '../utils/sanitize'

interface ChatMessage {
  id: string
  author: 'user' | 'assistant'
  content: string
}

const initialMessages: ChatMessage[] = [{
  id: 'assistant-welcome',
  author: 'assistant',
  content: sanitizeHtml('Olá! Posso ajudar com dúvidas sobre campanhas, metas, prazos e rotas comerciais.'),
}]

export function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [question, setQuestion] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { campaigns, brokerRankings, supervisorRankings, salesTeams } = useDashboardData()
  const combinedRankings = useMemo(
    () => [...brokerRankings, ...supervisorRankings],
    [brokerRankings, supervisorRankings],
  )
  const topOperators = useTopOperators(combinedRankings)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const content = sanitizeHtml(question.trim())
    if (!content) return

    try {
      const response = handleAssistantQuery(content, {
        campaigns,
        brokerRankings,
        supervisorRankings,
        salesTeams,
        topOperators,
      })
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), author: 'user', content },
        { id: crypto.randomUUID(), author: 'assistant', content: sanitizeHtml(response) },
      ])
      setQuestion('')
    } catch {
      setError('O assistente encontrou um erro interno. Tente novamente.')
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f7fb]">
      {error && <Toast message={error} onClose={() => setError('')} />}
      <header className="bg-navy-950 text-white">
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <BrandLogo color="white" orientation="horizontal" className="w-36 sm:w-44" />
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => navigate('/dashboard')} className="flex h-10 items-center gap-2 rounded-xl bg-white/10 px-3 text-xs font-bold hover:bg-white/15">
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </button>
            <button type="button" onClick={logout} className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 hover:bg-white/15" aria-label="Sair">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1000px] flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-5 flex items-start gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-limebrand text-navy-950 shadow-glow">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-blue-700">Dados internos JC Luz</p>
            <h1 className="mt-1 text-3xl font-black text-navy-950">Assistente de IA</h1>
            <p className="mt-1 text-sm text-slate-500">Assistente baseado em regras para campanhas, metas, rankings, equipes e rotas comerciais.</p>
          </div>
        </div>

        <section className="flex min-h-[560px] flex-1 flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-card">
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
            <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-navy-900 text-white">
              <Bot className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-limebrand" />
            </span>
            <div>
              <p className="text-sm font-black text-navy-950">Assistente comercial</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Disponível</p>
            </div>
          </div>

          <div
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            className="flex-1 space-y-4 overflow-y-auto bg-slate-50/60 p-4 sm:p-6"
          >
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-2.5 ${message.author === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.author === 'assistant' && (
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-navy-900 text-white">
                    <Bot className="h-4 w-4" />
                  </span>
                )}
                <div className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[75%] ${
                  message.author === 'user'
                    ? 'rounded-br-md bg-blue-700 text-white'
                    : 'rounded-bl-md border border-slate-100 bg-white text-slate-600 shadow-sm'
                }`}>
                  {/* Se HTML for necessário no futuro, use dangerouslySetInnerHTML somente com sanitizeHtml(message.content). */}
                  {message.content}
                </div>
                {message.author === 'user' && (
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-100 text-blue-700">
                    <UserRound className="h-4 w-4" />
                  </span>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-slate-100 bg-white p-3 sm:p-4">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {['Quais campanhas estão ativas?', 'Qual campanha termina primeiro?', 'Qual a rota de vendas?', 'Quem lidera o ranking?'].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setQuestion(suggestion)}
                  className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-2 text-[10px] font-bold text-slate-500 transition hover:border-blue-300 hover:text-blue-700"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    event.currentTarget.form?.requestSubmit()
                  }
                }}
                rows={1}
                aria-label="Digite sua pergunta para o assistente"
                placeholder="Pergunte sobre campanhas ou peça uma rota de vendas..."
                className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!question.trim()}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-900 text-white transition-colors duration-200 hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Enviar pergunta"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}
