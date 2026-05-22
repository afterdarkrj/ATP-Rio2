'use client'

import { useEffect, useState } from 'react'
import { getBrowserSupabase, type Jogador } from '@/lib/supabase-browser'

export default function DashboardPage() {
  const [jogador, setJogador] = useState<Jogador | null>(null)

  useEffect(() => {
    const load = async () => {
      const supabase = getBrowserSupabase()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const { data } = await supabase.from('jogadores').select('*').eq('id', session.user.id).single()
      setJogador(data)
    }
    load()
  }, [])

  const stats = [
    { icon: '🎾', label: 'Partidas jogadas', value: '—' },
    { icon: '🏆', label: 'Vitórias',          value: '—' },
    { icon: '📊', label: 'Posição no ranking', value: '—' },
    { icon: '⭐', label: 'Pontuação',          value: '—' },
  ]

  return (
    <div className="max-w-4xl">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="font-poppins font-extrabold text-3xl mb-1" style={{ color: 'var(--green-900)' }}>
          Olá, {jogador?.nome?.split(' ')[0] ?? '...'} 👋
        </h1>
        <p style={{ color: 'var(--muted)' }}>
          Bem-vindo ao seu painel do ATP-Rio2. Temporada 2026.
        </p>
      </div>

      {/* Alerta lista de espera */}
      {jogador?.lista_espera && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl border"
          style={{ background: '#fff8f0', borderColor: '#f0c090', color: '#9a5010' }}>
          <span className="text-xl mt-0.5">⏳</span>
          <div>
            <p className="font-semibold text-sm">Cadastro em análise</p>
            <p className="text-sm mt-0.5 opacity-80">
              Seu cadastro está na lista de espera. A comissão de esportes irá aprová-lo em breve.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border" style={{ borderColor: 'var(--line)' }}>
            <span className="text-2xl block mb-2">{s.icon}</span>
            <p className="font-poppins font-bold text-2xl" style={{ color: 'var(--green-700)' }}>{s.value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Atividade recente */}
      <div className="bg-white rounded-2xl border p-6" style={{ borderColor: 'var(--line)' }}>
        <h2 className="font-poppins font-bold text-lg mb-4" style={{ color: 'var(--green-900)' }}>
          Atividade recente
        </h2>
        <div className="flex flex-col items-center justify-center py-10 gap-2" style={{ color: 'var(--muted)' }}>
          <span className="text-4xl">🎾</span>
          <p className="font-medium text-sm">Nenhuma partida registrada ainda.</p>
          <p className="text-xs">Jogue sua primeira partida e registre o placar!</p>
        </div>
      </div>
    </div>
  )
}
