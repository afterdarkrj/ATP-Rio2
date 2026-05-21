'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getBrowserSupabase, type Jogador } from '@/lib/supabase-browser'

const NAV_JOGADOR = [
  { href: '/dashboard',           icon: '🏠', label: 'Painel' },
  { href: '/dashboard/ranking',   icon: '📊', label: 'Meu Ranking' },
  { href: '/dashboard/partidas',  icon: '🎾', label: 'Minhas Partidas' },
  { href: '/dashboard/historico', icon: '📈', label: 'Histórico' },
  { href: '/dashboard/perfil',    icon: '👤', label: 'Meu Perfil' },
]

const NAV_ADMIN = [
  { href: '/dashboard/jogadores',  icon: '👥', label: 'Jogadores' },
  { href: '/dashboard/aprovacoes', icon: '✅', label: 'Aprovações' },
  { href: '/dashboard/torneios',   icon: '🏆', label: 'Torneios' },
  { href: '/dashboard/config',     icon: '⚙️', label: 'Configurações' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [jogador, setJogador]     = useState<Jogador | null>(null)
  const [loading, setLoading]     = useState(true)
  const [sideOpen, setSideOpen]   = useState(false)

  useEffect(() => {
    const init = async () => {
      const supabase = getBrowserSupabase()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.replace('/login'); return }

      const { data } = await supabase
        .from('jogadores')
        .select('*')
        .eq('id', session.user.id)
        .single()

      setJogador(data)
      setLoading(false)
    }
    init()
  }, [router])

  const handleLogout = async () => {
    await getBrowserSupabase().auth.signOut()
    router.replace('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="flex flex-col items-center gap-3">
          <span className="logo-ball animate-card-float" style={{ width: 48, height: 48 }} />
          <p className="font-poppins font-semibold" style={{ color: 'var(--green-700)' }}>Carregando...</p>
        </div>
      </div>
    )
  }

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)

  const NavLink = ({ href, icon, label }: { href: string; icon: string; label: string }) => (
    <a
      href={href}
      onClick={() => setSideOpen(false)}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
      style={{
        color:      isActive(href) ? '#1f3d24' : 'rgba(255,255,255,0.75)',
        background: isActive(href) ? '#dff24a' : 'transparent',
        fontWeight: isActive(href) ? 700 : 500,
      }}
      onMouseEnter={e => { if (!isActive(href)) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)' }}
      onMouseLeave={e => { if (!isActive(href)) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
    >
      <span className="text-base w-5 text-center">{icon}</span>
      {label}
    </a>
  )

  const Sidebar = () => (
    <aside className="flex flex-col h-full" style={{ background: 'var(--green-900)', width: 240 }}>
      {/* Logo */}
      <div className="px-5 pt-6 pb-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <a href="/" className="flex items-center gap-2.5">
          <span className="logo-ball" style={{ width: 26, height: 26 }} />
          <span className="font-poppins font-extrabold text-lg text-white tracking-tight">
            ATP<span style={{ color: 'var(--lime)' }}>-Rio2</span>
          </span>
        </a>
      </div>

      {/* Perfil do usuário */}
      <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-poppins font-bold text-sm flex-shrink-0"
            style={{ background: 'var(--lime)', color: 'var(--green-900)' }}>
            {jogador?.nome?.split(' ').map(n => n[0]).slice(0,2).join('') ?? '??'}
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">{jogador?.nome ?? 'Jogador'}</p>
            <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Apto {jogador?.apartamento} · {jogador?.condominio}
            </p>
          </div>
        </div>
        {jogador?.lista_espera && (
          <span className="inline-block mt-2 text-xs font-semibold px-2 py-1 rounded-full"
            style={{ background: 'rgba(224,122,63,0.25)', color: '#f0a070' }}>
            ⏳ Lista de espera
          </span>
        )}
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {/* Seção Jogador */}
        <p className="text-xs font-bold uppercase tracking-widest px-3 mb-1"
          style={{ color: 'rgba(255,255,255,0.35)' }}>Jogador</p>
        {NAV_JOGADOR.map(item => <NavLink key={item.href} {...item} />)}

        {/* Seção Admin — só visível para admins */}
        {jogador?.is_admin && (
          <>
            <div className="my-3 mx-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.12)' }} />
            <p className="text-xs font-bold uppercase tracking-widest px-3 mb-1 flex items-center gap-1.5"
              style={{ color: 'rgba(223,242,74,0.6)' }}>
              <span>⚡</span> Administração
            </p>
            {NAV_ADMIN.map(item => <NavLink key={item.href} {...item} />)}
          </>
        )}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 border-t pt-3" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ color: 'rgba(255,255,255,0.55)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,80,80,0.12)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
          <span className="text-base w-5 text-center">🚪</span>
          Sair
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Sidebar desktop */}
      <div className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-40" style={{ width: 240 }}>
        <Sidebar />
      </div>

      {/* Overlay mobile */}
      {sideOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="flex flex-col" style={{ width: 240 }}><Sidebar /></div>
          <div className="flex-1 bg-black/50" onClick={() => setSideOpen(false)} />
        </div>
      )}

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col md:ml-[240px]">
        {/* Topbar mobile */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b" style={{ borderColor: 'var(--line)' }}>
          <button onClick={() => setSideOpen(true)} className="p-1.5" aria-label="Abrir menu">
            <span className="block w-5 h-0.5 mb-1 rounded" style={{ background: 'var(--green-700)' }} />
            <span className="block w-5 h-0.5 mb-1 rounded" style={{ background: 'var(--green-700)' }} />
            <span className="block w-5 h-0.5 rounded"       style={{ background: 'var(--green-700)' }} />
          </button>
          <span className="font-poppins font-bold" style={{ color: 'var(--green-900)' }}>ATP-Rio2</span>
        </div>

        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
