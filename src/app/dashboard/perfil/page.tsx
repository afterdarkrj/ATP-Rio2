'use client'

import { useEffect, useState } from 'react'
import { getBrowserSupabase } from '@/lib/supabase-browser'
import { useJogador } from '@/lib/jogador-context'

type FormData = {
  nome: string
  condominio: string
  apartamento: string
  whatsapp: string
}

export default function PerfilPage() {
  const { jogador, setJogador } = useJogador()

  const [form, setForm]     = useState<FormData>({
    nome:        jogador?.nome        ?? '',
    condominio:  jogador?.condominio  ?? '',
    apartamento: jogador?.apartamento ?? '',
    whatsapp:    jogador?.whatsapp    ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ type: 'idle' | 'ok' | 'err'; msg: string }>({ type: 'idle', msg: '' })

  useEffect(() => {
    if (jogador) {
      setForm({
        nome:        jogador.nome,
        condominio:  jogador.condominio,
        apartamento: jogador.apartamento,
        whatsapp:    jogador.whatsapp,
      })
    }
  }, [jogador])

  const field = (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(f => ({ ...f, [key]: e.target.value }))
      setStatus({ type: 'idle', msg: '' })
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { nome, condominio, apartamento, whatsapp } = form
    if (!nome || !condominio || !apartamento || !whatsapp) {
      setStatus({ type: 'err', msg: 'Preencha todos os campos.' })
      return
    }
    if (!jogador) return
    setSaving(true)
    const { error } = await getBrowserSupabase()
      .from('jogadores')
      .update({ nome, condominio, apartamento, whatsapp })
      .eq('id', jogador.id)

    if (error) {
      setStatus({ type: 'err', msg: 'Erro ao salvar. Tente novamente.' })
    } else {
      setJogador({ ...jogador, nome, condominio, apartamento, whatsapp })
      setStatus({ type: 'ok', msg: 'Dados atualizados com sucesso!' })
    }
    setSaving(false)
  }

  const inputCls = 'w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#45a35a] transition-all bg-white'

  return (
    <div className="max-w-lg">
      <div className="mb-7">
        <h1 className="font-poppins font-extrabold text-3xl mb-1" style={{ color: 'var(--green-900)' }}>
          Meu Perfil
        </h1>
        <p style={{ color: 'var(--muted)' }}>Atualize seus dados cadastrais a qualquer momento.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-6 flex flex-col gap-4"
        style={{ borderColor: 'var(--line)' }}>

        <div>
          <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
            Nome completo
          </label>
          <input
            className={inputCls}
            style={{ borderColor: 'var(--line)' }}
            value={form.nome}
            onChange={field('nome')}
            placeholder="Seu nome completo"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
              Condomínio
            </label>
            <input
              className={inputCls}
              style={{ borderColor: 'var(--line)' }}
              value={form.condominio}
              onChange={field('condominio')}
              placeholder="Ex: Front Lake"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
              Apartamento
            </label>
            <input
              className={inputCls}
              style={{ borderColor: 'var(--line)' }}
              value={form.apartamento}
              onChange={field('apartamento')}
              placeholder="Ex: 101"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
            E-mail
          </label>
          <input
            type="email"
            className={inputCls}
            style={{ borderColor: 'var(--line)', background: 'var(--bg)', color: 'var(--muted)', cursor: 'not-allowed' }}
            value={jogador?.email ?? ''}
            disabled
            readOnly
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
            WhatsApp (com DDD)
          </label>
          <input
            type="tel"
            className={inputCls}
            style={{ borderColor: 'var(--line)' }}
            value={form.whatsapp}
            onChange={field('whatsapp')}
            placeholder="Ex: 21999999999"
          />
        </div>

        {status.msg && (
          <p className="text-sm font-medium px-3 py-2 rounded-lg"
            style={{
              color:      status.type === 'ok' ? 'var(--green-700)' : '#c0392b',
              background: status.type === 'ok' ? 'var(--lime-soft)' : '#fff0ec',
            }}>
            {status.type === 'ok' ? '✓ ' : '⚠ '}{status.msg}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-1 py-3 rounded-xl text-white font-poppins font-semibold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #45a35a, #2f6b3a)' }}>
          {saving ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </form>
    </div>
  )
}
