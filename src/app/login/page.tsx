'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getBrowserSupabase } from '@/lib/supabase-browser'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const supabase = getBrowserSupabase()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (authError) {
        setError('E-mail ou senha inválidos. Verifique seus dados.')
        return
      }
      router.push('/dashboard')
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = `w-full px-4 py-3 rounded-xl border-2 bg-white text-[#1d2b1f] placeholder-[#a0b09c]
    focus:outline-none focus:border-[#45a35a] transition-all text-sm`

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(900px 500px at 80% -10%, #e7f6a8, transparent 70%), linear-gradient(160deg, #f3f9ec, #e9f4e3)' }}>

      {/* Bolas decorativas */}
      <span className="float-ball animate-float-1 pointer-events-none" style={{ width: 60, height: 60, top: '12%', right: '10%', position: 'fixed' }} />
      <span className="float-ball animate-float-2 pointer-events-none" style={{ width: 36, height: 36, bottom: '18%', left: '8%', position: 'fixed' }} />

      <div className="w-full max-w-md">
        {/* Logo */}
        <a href="/" className="flex items-center justify-center gap-2.5 mb-8">
          <span className="logo-ball" style={{ width: 32, height: 32 }} />
          <span className="font-poppins font-extrabold text-2xl tracking-tight" style={{ color: 'var(--green-900)' }}>
            ATP<span style={{ color: 'var(--green-500)' }}>-Rio2</span>
          </span>
        </a>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="font-poppins font-bold text-2xl mb-1" style={{ color: 'var(--green-900)' }}>
            Bem-vindo de volta!
          </h1>
          <p className="text-sm mb-7" style={{ color: 'var(--muted)' }}>
            Entre com seu e-mail e senha para acessar a plataforma.
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>E-mail</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={inputCls}
                style={{ borderColor: 'var(--line)' }}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={inputCls}
                style={{ borderColor: 'var(--line)' }}
                required
              />
            </div>

            {error && (
              <div className="text-sm px-4 py-3 rounded-xl font-medium" style={{ background: '#fff0ec', color: '#c0392b' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-poppins font-semibold text-base shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-transform disabled:opacity-60 disabled:cursor-not-allowed mt-1"
              style={{ background: 'linear-gradient(135deg, #45a35a, #2f6b3a)' }}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t text-center" style={{ borderColor: 'var(--line)' }}>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Ainda não tem acesso?{' '}
              <a href="/#cta" className="font-semibold hover:underline" style={{ color: 'var(--green-500)' }}>
                Cadastre-se na próxima rodada
              </a>
            </p>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--muted)' }}>
          © 2026 ATP-Rio2 · Exclusivo para moradores
        </p>
      </div>
    </div>
  )
}
