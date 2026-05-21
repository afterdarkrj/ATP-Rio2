'use client'

import { useEffect, useState } from 'react'
import { getBrowserSupabase, type Jogador } from '@/lib/supabase-browser'

export default function AprovacoesPage() {
  const [lista, setLista]       = useState<Jogador[]>([])
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState<string | null>(null)

  const load = async () => {
    const { data } = await getBrowserSupabase().from('jogadores').select('*').eq('lista_espera', true).order('created_at')
    setLista(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const aprovar = async (id: string) => {
    setSaving(id)
    await getBrowserSupabase().from('jogadores').update({ lista_espera: false }).eq('id', id)
    await load()
    setSaving(null)
  }

  const rejeitar = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este cadastro?')) return
    setSaving(id)
    await getBrowserSupabase().from('jogadores').delete().eq('id', id)
    await load()
    setSaving(null)
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-7">
        <h1 className="font-poppins font-extrabold text-3xl mb-1" style={{ color: 'var(--green-900)' }}>
          Aprovações
        </h1>
        <p style={{ color: 'var(--muted)' }}>Jogadores aguardando aprovação para entrar na plataforma.</p>
      </div>

      {loading ? (
        <p style={{ color: 'var(--muted)' }}>Carregando...</p>
      ) : lista.length === 0 ? (
        <div className="bg-white rounded-2xl border p-10 text-center" style={{ borderColor: 'var(--line)' }}>
          <span className="text-4xl block mb-2">✅</span>
          <p className="font-semibold" style={{ color: 'var(--green-700)' }}>Nenhum cadastro pendente!</p>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Todos os jogadores foram aprovados.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {lista.map(j => (
            <div key={j.id} className="bg-white rounded-2xl border p-5 flex items-center justify-between gap-4"
              style={{ borderColor: 'var(--line)' }}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-poppins font-bold text-sm flex-shrink-0"
                  style={{ background: 'var(--lime-soft)', color: 'var(--green-700)' }}>
                  {j.nome.split(' ').map(n => n[0]).slice(0,2).join('')}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{j.nome}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>
                    {j.condominio} · Apto {j.apartamento} · {j.email}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                    📱 {j.whatsapp}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => aprovar(j.id)}
                  disabled={saving === j.id}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #45a35a, #2f6b3a)' }}>
                  {saving === j.id ? '...' : '✓ Aprovar'}
                </button>
                <button
                  onClick={() => rejeitar(j.id)}
                  disabled={saving === j.id}
                  className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5 disabled:opacity-50"
                  style={{ background: '#fff0ec', color: '#c0392b' }}>
                  ✕ Rejeitar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
