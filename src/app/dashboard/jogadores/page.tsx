'use client'

import { useEffect, useState } from 'react'
import { getBrowserSupabase, type Jogador } from '@/lib/supabase-browser'

export default function JogadoresPage() {
  const [jogadores, setJogadores] = useState<Jogador[]>([])
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState<string | null>(null)
  const [busca, setBusca]         = useState('')

  const load = async () => {
    const { data } = await getBrowserSupabase()
      .from('jogadores').select('*').eq('lista_espera', false).order('nome')
    setJogadores(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const toggleAdmin = async (j: Jogador) => {
    setSaving(j.id)
    await getBrowserSupabase().from('jogadores').update({ is_admin: !j.is_admin }).eq('id', j.id)
    await load()
    setSaving(null)
  }

  const filtrado = jogadores.filter(j =>
    j.nome.toLowerCase().includes(busca.toLowerCase()) ||
    j.email.toLowerCase().includes(busca.toLowerCase()) ||
    j.condominio.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="max-w-4xl">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-poppins font-extrabold text-3xl mb-1" style={{ color: 'var(--green-900)' }}>
            Jogadores
          </h1>
          <p style={{ color: 'var(--muted)' }}>
            {jogadores.length} jogador{jogadores.length !== 1 ? 'es' : ''} ativos na plataforma.
          </p>
        </div>
        <input
          type="text"
          placeholder="🔍  Buscar jogador..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#45a35a] transition-all"
          style={{ borderColor: 'var(--line)', background: 'white', minWidth: 220 }}
        />
      </div>

      {loading ? (
        <p style={{ color: 'var(--muted)' }}>Carregando...</p>
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--line)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--line)' }}>
                {['Jogador','Condomínio','Contato','Admin',''].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-poppins text-xs uppercase tracking-wide"
                    style={{ color: 'var(--muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrado.map((j, i) => (
                <tr key={j.id} style={{ borderTop: i > 0 ? '1px solid var(--line)' : 'none' }}
                  className="hover:bg-[#f5f9f0] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: 'var(--lime-soft)', color: 'var(--green-700)' }}>
                        {j.nome.split(' ').map(n => n[0]).slice(0,2).join('')}
                      </div>
                      <div>
                        <p className="font-semibold">{j.nome}</p>
                        <p className="text-xs" style={{ color: 'var(--muted)' }}>{j.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--muted)' }}>
                    {j.condominio}<br />
                    <span className="text-xs">Apto {j.apartamento}</span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted)' }}>{j.whatsapp}</td>
                  <td className="px-4 py-3">
                    {j.is_admin
                      ? <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: 'var(--lime-soft)', color: 'var(--green-700)' }}>Admin</span>
                      : <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: 'var(--bg)', color: 'var(--muted)' }}>Jogador</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleAdmin(j)}
                      disabled={saving === j.id}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:opacity-80 disabled:opacity-40"
                      style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}>
                      {saving === j.id ? '...' : j.is_admin ? 'Remover admin' : 'Tornar admin'}
                    </button>
                  </td>
                </tr>
              ))}
              {filtrado.length === 0 && (
                <tr><td colSpan={5} className="text-center py-10 text-sm" style={{ color: 'var(--muted)' }}>
                  Nenhum jogador encontrado.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
