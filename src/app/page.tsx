'use client'

import { useState, useEffect, useRef } from 'react'

/* ── helpers ── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect() } },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return { ref, visible }
}

function AnimatedCount({ target, suffix = '' }: { target: number; suffix?: string }) {
  const { ref, visible } = useInView(0.6)
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!visible) return
    const dur = 1500
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.round(target * eased))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [visible, target])
  return (
    <span ref={ref} className="block font-poppins font-extrabold text-4xl leading-none" style={{ color: 'var(--green-700)' }}>
      {count.toLocaleString('pt-BR')}{suffix}
    </span>
  )
}

function Reveal({ children, delay = 0, className = '', style = {} }: { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) {
  const { ref, visible } = useInView()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(34px)',
        transition: `opacity .7s cubic-bezier(.2,.7,.2,1) ${delay}ms, transform .7s cubic-bezier(.2,.7,.2,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

const inputCls = 'w-full px-5 py-4 rounded-2xl border-2 border-transparent bg-white text-[#1d2b1f] placeholder-[#a0b09c] focus:border-[#dff24a] focus:outline-none transition-all'

/* ── main page ── */
export default function Home() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [form, setForm]           = useState({ nome: '', condominio: '', apartamento: '', email: '', whatsapp: '' })
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus]       = useState<{ type: 'idle' | 'ok' | 'err'; msg: string }>({
    type: 'idle', msg: 'Cadastro gratuito · exclusivo para moradores',
  })

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const field = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { nome, condominio, apartamento, email, whatsapp } = form
    if (!nome || !condominio || !apartamento || !email || !whatsapp) {
      setStatus({ type: 'err', msg: 'Preencha todos os campos para continuar.' })
      return
    }
    setSubmitting(true)
    try {
      const res  = await fetch('/api/cadastro', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) setStatus({ type: 'err', msg: data.error || 'Erro ao cadastrar.' })
      else {
        setStatus({ type: 'ok', msg: `Tudo certo, ${nome.split(' ')[0]}! Cadastro enviado. Bem-vindo(a) ao ATP-Rio2 🎾` })
        setForm({ nome: '', condominio: '', apartamento: '', email: '', whatsapp: '' })
      }
    } catch {
      setStatus({ type: 'err', msg: 'Erro de conexão. Tente novamente.' })
    } finally {
      setSubmitting(false)
    }
  }

  const ranking = [
    { pos: 1, ico: 'MF', name: 'Marina Ferreira', pts: '2.480', cardCls: 'bg-gradient-to-r from-yellow-50 to-white border border-yellow-200', posColor: '#c79a08', picoBg: 'linear-gradient(135deg,#f4c542,#e0a615)', picoColor: '#fff' },
    { pos: 2, ico: 'DA', name: 'Diego Alves',     pts: '2.310', cardCls: 'bg-[#f5f9f0]', posColor: '#9aa7ab', picoBg: '#9aa7ab', picoColor: '#fff' },
    { pos: 3, ico: 'LC', name: 'Lucas Campos',    pts: '2.155', cardCls: 'bg-[#f5f9f0]', posColor: '#e07a3f', picoBg: '#e07a3f', picoColor: '#fff' },
    { pos: 4, ico: 'PB', name: 'Paula Brito',     pts: '1.990', cardCls: 'bg-[#f5f9f0]', posColor: '#5d6e5b', picoBg: '#45a35a', picoColor: '#fff' },
    { pos: 7, ico: 'VC', name: 'Você',            pts: '1.640', cardCls: 'bg-[#1f3d24]',  posColor: '#fff',    picoBg: '#dff24a', picoColor: '#1f3d24', you: true },
  ]

  return (
    <>
      {/* NAVBAR */}
      <header style={{ position: 'fixed', inset: '0 0 auto 0', zIndex: 50, transition: 'all .3s', padding: scrolled ? '8px 0' : '16px 0', background: scrolled ? 'rgba(255,255,255,.93)' : 'transparent', backdropFilter: scrolled ? 'blur(10px)' : 'none', boxShadow: scrolled ? '0 4px 14px rgba(31,61,36,.08)' : 'none' }}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-2.5">
            <span className="logo-ball" />
            <span className="font-poppins font-extrabold text-xl tracking-tight" style={{ color: 'var(--green-900)' }}>
              ATP<span style={{ color: 'var(--green-500)' }}>-Rio2</span>
            </span>
          </a>

          {/* desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {[['#features','Recursos'],['#how','Como funciona'],['#ranking','Ranking']].map(([h,l]) => (
              <a key={h} href={h} className="font-medium transition-colors hover:text-[#45a35a]" style={{ color: 'var(--ink)' }}>{l}</a>
            ))}
            <a href="#cta" className="px-5 py-2.5 rounded-full text-white font-semibold text-sm shadow-lg hover:-translate-y-0.5 transition-transform"
              style={{ background: 'linear-gradient(135deg, #45a35a, #2f6b3a)' }}>
              Entrar na quadra
            </a>
          </nav>

          {/* mobile toggle */}
          <button onClick={() => setMenuOpen(o => !o)} className="md:hidden flex flex-col gap-1.5 p-1.5" aria-label="Menu">
            {[0,1,2].map(i => (
              <span key={i} className="block w-6 h-0.5 rounded" style={{
                background: 'var(--green-700)',
                transition: 'transform .25s, opacity .2s',
                transform: menuOpen ? (i===0 ? 'translateY(8px) rotate(45deg)' : i===2 ? 'translateY(-8px) rotate(-45deg)' : '') : '',
                opacity:    menuOpen && i===1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>

        {/* mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white shadow-xl px-6 py-4 flex flex-col gap-1">
            {[['#features','Recursos'],['#how','Como funciona'],['#ranking','Ranking']].map(([h,l]) => (
              <a key={h} href={h} onClick={() => setMenuOpen(false)} className="py-3 border-b font-medium" style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}>{l}</a>
            ))}
            <a href="#cta" onClick={() => setMenuOpen(false)} className="mt-2 py-3 text-center rounded-full text-white font-semibold"
              style={{ background: 'linear-gradient(135deg, #45a35a, #2f6b3a)' }}>
              Entrar na quadra
            </a>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="hero" className="relative pt-44 pb-32 overflow-hidden"
        style={{ background: 'radial-gradient(900px 420px at 88% -8%,#e7f6a8,transparent 70%),radial-gradient(700px 420px at 0% 110%,#d9efd2,transparent 70%),linear-gradient(160deg,#f3f9ec,#e9f4e3)' }}>
        <div className="court-lines" />
        <span className="float-ball animate-float-1" style={{ width:70, height:70, top:'20%',  right:'6%',  zIndex:1 }} />
        <span className="float-ball animate-float-2" style={{ width:42, height:42, bottom:'22%',left:'7%',  zIndex:1 }} />
        <span className="float-ball animate-float-3" style={{ width:30, height:30, top:'62%',  right:'44%', zIndex:1 }} />

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center relative" style={{ zIndex:2 }}>
          <div className="animate-fade-up">
            <span className="inline-block bg-white font-semibold text-sm px-4 py-2 rounded-full shadow mb-5" style={{ color:'var(--green-700)' }}>
              🎾 Exclusivo para moradores do Rio2
            </span>
            <h1 className="font-poppins font-extrabold leading-tight tracking-tight mb-5" style={{ fontSize:'clamp(2.3rem,5vw,3.4rem)', color:'var(--green-900)' }}>
              O ranking de tênis do condomínio,{' '}
              <span style={{ background:'linear-gradient(120deg,#45a35a,#2f6b3a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                na palma da mão.
              </span>
            </h1>
            <p className="text-lg mb-8 max-w-md" style={{ color:'var(--muted)' }}>
              Registre partidas, acompanhe sua pontuação e suba no ranking.
              O ATP-Rio2 organiza a disputa oficial dos moradores de forma simples, justa e divertida.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <a href="#cta" className="px-8 py-4 rounded-full text-white font-poppins font-semibold shadow-xl hover:-translate-y-1 transition-transform"
                style={{ background:'linear-gradient(135deg,#45a35a,#2f6b3a)' }}>Criar meu perfil</a>
              <a href="#how" className="px-8 py-4 rounded-full font-poppins font-semibold border hover:-translate-y-1 hover:shadow-md transition-all bg-white"
                style={{ color:'var(--green-700)', borderColor:'var(--line)' }}>Ver como funciona</a>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex">
                {[['MF','#45a35a'],['AC','#e07a3f'],['RS','#5aa9d8'],['+','#1f3d24']].map(([l,bg],i) => (
                  <span key={i} className="w-10 h-10 rounded-full grid place-items-center font-poppins font-bold text-xs text-white border-2"
                    style={{ marginLeft:i?-10:0, background:bg, borderColor:'var(--bg)' }}>{l}</span>
                ))}
              </div>
              <p className="text-sm" style={{ color:'var(--muted)' }}><strong style={{ color:'var(--ink)' }}>128 moradores</strong> já competem na temporada 2026</p>
            </div>
          </div>

          {/* ranking card */}
          <div className="bg-white rounded-3xl p-6 shadow-2xl animate-card-float">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-poppins font-bold text-lg">Ranking ao vivo</h3>
              <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full" style={{ color:'var(--green-700)', background:'var(--lime-soft)' }}>
                <span className="w-2 h-2 rounded-full inline-block animate-pulse-dot" style={{ background:'var(--green-500)' }} />
                Temporada 2026
              </span>
            </div>
            <ul className="flex flex-col gap-2">
              {ranking.map(r => (
                <li key={r.pos} className={`rank-row grid items-center gap-2.5 px-3 py-2.5 rounded-xl ${r.cardCls}`}
                  style={{ gridTemplateColumns:'30px 1fr auto' }}>
                  <span className="font-poppins font-bold text-center text-sm" style={{ color:r.posColor }}>{r.pos}</span>
                  <span className="flex items-center gap-2.5 font-semibold text-sm" style={{ color:r.you?'#fff':'inherit' }}>
                    <span className="w-7 h-7 rounded-full grid place-items-center text-xs font-bold flex-shrink-0"
                      style={{ background:r.picoBg, color:r.picoColor }}>{r.ico}</span>
                    {r.name}
                  </span>
                  <span className="font-poppins font-bold text-sm" style={{ color:r.you?'#dff24a':'var(--green-700)' }}>{r.pts}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-3.5 border-t border-dashed" style={{ borderColor:'var(--line)' }}>
              <span className="text-sm font-semibold" style={{ color:'var(--green-500)' }}>▲ Subiu 2 posições esta semana</span>
            </div>
          </div>
        </div>

        <div className="absolute left-0 right-0 bottom-0 leading-none">
          <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="w-full h-20">
            <path d="M0,40 C320,90 640,0 960,30 C1200,52 1320,80 1440,55 L1440,90 L0,90 Z" fill="var(--bg)" />
          </svg>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16" style={{ background:'var(--bg)' }}>
        <div className="max-w-6xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[{n:128,l:'Moradores ativos'},{n:3,l:'Quadras disponíveis'},{n:940,l:'Partidas registradas',s:'+'},{n:12,l:'Torneios na temporada'}]
            .map((s,i) => (
              <Reveal key={i} delay={i*80} className="bg-white rounded-2xl p-7 text-center border shadow-sm hover:-translate-y-1.5 hover:shadow-md transition-all duration-300"
                style={{ borderColor:'var(--line)' }}>
                <AnimatedCount target={s.n} suffix={s.s} />
                <span className="text-sm font-medium mt-1 block" style={{ color:'var(--muted)' }}>{s.l}</span>
              </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center max-w-xl mx-auto mb-14">
            <span className="font-poppins font-bold text-xs tracking-widest uppercase" style={{ color:'var(--clay)' }}>Recursos</span>
            <h2 className="font-poppins font-extrabold text-4xl tracking-tight mt-3" style={{ color:'var(--green-900)' }}>Tudo que a comunidade precisa para jogar</h2>
            <p className="mt-4" style={{ color:'var(--muted)' }}>Pensado para a rotina dos moradores: rápido, transparente e feito para aproximar quem ama tênis.</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {ico:'📊', t:'Ranking automático',      d:'A pontuação é calculada sozinha a cada partida registrada. Sem planilhas, sem discussão.'},
              {ico:'🎾', t:'Registro de partidas',    d:'Lance o placar em segundos pelo celular. O resultado entra no ranking na hora.'},
              {ico:'🏆', t:'Torneios da temporada',   d:'Chaves automáticas, acompanhamento de jogos e premiação dos campeões.'},
              {ico:'📈', t:'Histórico e estatísticas',d:'Acompanhe sua evolução, aproveitamento e o retrospecto contra cada adversário.'},
              {ico:'🔔', t:'Notificações',            d:'Receba alertas de resultados e mudanças no ranking em tempo real.'},
              {ico:'📱', t:'Acesso pelo celular',     d:'Interface responsiva otimizada para uso direto na quadra, sem app para instalar.'},
            ].map((f,i) => (
              <Reveal key={i} delay={i*70}>
                <div className="feature-card border rounded-2xl p-7 hover:-translate-y-2 hover:shadow-xl hover:border-transparent transition-all duration-300 h-full"
                  style={{ background:'var(--bg)', borderColor:'var(--line)' }}>
                  <div className="w-14 h-14 rounded-xl grid place-items-center text-2xl mb-4" style={{ background:'var(--lime-soft)' }}>{f.ico}</div>
                  <h3 className="font-poppins font-bold text-lg mb-2">{f.t}</h3>
                  <p className="text-sm leading-relaxed" style={{ color:'var(--muted)' }}>{f.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24" style={{ background:'var(--bg)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center max-w-xl mx-auto mb-14">
            <span className="font-poppins font-bold text-xs tracking-widest uppercase" style={{ color:'var(--clay)' }}>Como funciona</span>
            <h2 className="font-poppins font-extrabold text-4xl tracking-tight mt-3" style={{ color:'var(--green-900)' }}>Do cadastro à quadra em 3 passos</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {n:'1', t:'Crie seu perfil',  d:'Confirme que é morador do Rio2 e monte seu perfil em menos de um minuto.'},
              {n:'2', t:'Marque e jogue',   d:'Convide um vizinho e dispute a partida na quadra do condomínio.'},
              {n:'3', t:'Suba no ranking',  d:'Registre o placar e veja sua pontuação atualizar em tempo real.'},
            ].map((s,i) => (
              <Reveal key={i} delay={i*120} className="text-center">
                <span className="w-16 h-16 rounded-full text-white font-poppins font-extrabold text-2xl grid place-items-center mx-auto mb-4 shadow-xl"
                  style={{ background:'linear-gradient(135deg,#45a35a,#2f6b3a)' }}>{s.n}</span>
                <h3 className="font-poppins font-bold text-xl mb-2" style={{ color:'var(--green-900)' }}>{s.t}</h3>
                <p style={{ color:'var(--muted)' }}>{s.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* RANKING */}
      <section id="ranking" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
          <Reveal>
            <span className="font-poppins font-bold text-xs tracking-widest uppercase" style={{ color:'var(--clay)' }}>Ranking oficial</span>
            <h2 className="font-poppins font-extrabold text-4xl tracking-tight mt-3 mb-4" style={{ color:'var(--green-900)' }}>Transparência total na disputa</h2>
            <p className="mb-5" style={{ color:'var(--muted)' }}>
              Todo morador enxerga a mesma tabela, atualizada após cada jogo.
              O sistema premia quem joga com frequência e vence adversários melhor ranqueados.
            </p>
            <ul className="flex flex-col gap-3 mb-7">
              {['Pontuação justa baseada na força do adversário','Ranking geral, masculino, feminino e por faixa etária','Atualização em tempo real, visível para todos']
                .map(t => <li key={t} className="check-item">{t}</li>)}
            </ul>
            <a href="#cta" className="inline-flex px-8 py-4 rounded-full text-white font-poppins font-semibold shadow-xl hover:-translate-y-1 transition-transform"
              style={{ background:'linear-gradient(135deg,#45a35a,#2f6b3a)' }}>Quero entrar no ranking</a>
          </Reveal>
          <Reveal delay={150}>
            <div className="rounded-3xl p-6 shadow-xl border" style={{ background:'var(--bg)', borderColor:'var(--line)' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-poppins font-bold text-lg">Top jogadores · Maio</h3>
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ color:'var(--clay)', background:'var(--clay-soft)' }}>Atualizado hoje</span>
              </div>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>{['#','Jogador','V','Pontos'].map(h => <th key={h} className="text-left pb-2 px-2 font-poppins text-[10px] uppercase tracking-wide" style={{ color:'var(--muted)' }}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {[
                    {pos:1, n:'Marina Ferreira', w:18, p:'2.480', c:'#c79a08'},
                    {pos:2, n:'Diego Alves',     w:16, p:'2.310', c:'#9aa7ab'},
                    {pos:3, n:'Lucas Campos',    w:15, p:'2.155', c:'#e07a3f'},
                    {pos:4, n:'Paula Brito',     w:13, p:'1.990', c:'var(--muted)'},
                    {pos:5, n:'Rafael Souza',    w:12, p:'1.875', c:'var(--muted)'},
                    {pos:6, n:'Camila Nunes',    w:11, p:'1.720', c:'var(--muted)'},
                  ].map(r => (
                    <tr key={r.pos} className="border-t transition-colors hover:bg-[#e7f6a8]" style={{ borderColor:'var(--line)' }}>
                      <td className="px-2 py-3 font-poppins font-bold" style={{ color:r.c }}>{r.pos}</td>
                      <td className="px-2 py-3 font-medium">{r.n}</td>
                      <td className="px-2 py-3 text-right" style={{ color:'var(--muted)' }}>{r.w}</td>
                      <td className="px-2 py-3 text-right font-poppins font-bold" style={{ color:'var(--green-700)' }}>{r.p}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="relative py-24 overflow-hidden"
        style={{ background:'radial-gradient(600px 300px at 85% 20%,rgba(200,232,74,.2),transparent 70%),linear-gradient(135deg,#2f6b3a,#1f3d24)' }}>
        <div className="court-lines" style={{ opacity:.14 }} />
        <Reveal className="max-w-xl mx-auto px-6 text-center relative" style={{ zIndex:2 }}>
          <h2 className="font-poppins font-extrabold text-4xl text-white tracking-tight">Pronto para entrar na quadra?</h2>
          <p className="mt-3 mb-7 text-lg" style={{ color:'rgba(255,255,255,.8)' }}>Junte-se aos moradores do Rio2 e comece a competir na temporada 2026 hoje mesmo.</p>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 text-left">
            <input className={`col-span-2 ${inputCls}`} placeholder="Nome completo"
              value={form.nome}        onChange={field('nome')} />
            <input className={inputCls} placeholder="Condomínio"
              value={form.condominio}  onChange={field('condominio')} />
            <input className={inputCls} placeholder="Apartamento"
              value={form.apartamento} onChange={field('apartamento')} />
            <input type="email" className={inputCls} placeholder="E-mail"
              value={form.email}       onChange={field('email')} />
            <input type="tel"   className={inputCls} placeholder="WhatsApp (com DDD)"
              value={form.whatsapp}    onChange={field('whatsapp')} />
            <button type="submit" disabled={submitting}
              className="col-span-2 mt-1 py-4 rounded-full text-white font-poppins font-semibold text-lg shadow-xl hover:-translate-y-1 active:translate-y-0 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background:'linear-gradient(135deg,#45a35a,#2f6b3a)' }}>
              {submitting ? 'Enviando...' : 'Cadastrar para a próxima rodada'}
            </button>
          </form>
          <p className="mt-4 text-sm font-medium" style={{ color: status.type==='ok' ? '#dff24a' : status.type==='err' ? '#ffd0b6' : 'rgba(255,255,255,.6)' }}>
            {status.msg}
          </p>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer style={{ background:'var(--green-900)', color:'#cfe0cc', padding:'56px 0 24px' }}>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[1.2fr_2fr] gap-10 pb-10 border-b" style={{ borderColor:'rgba(255,255,255,.1)' }}>
          <div>
            <a href="#hero" className="flex items-center gap-2.5 mb-3">
              <span className="logo-ball" />
              <span className="font-poppins font-extrabold text-xl text-white tracking-tight">
                ATP<span style={{ color:'var(--green-500)' }}>-Rio2</span>
              </span>
            </a>
            <p className="text-sm max-w-xs" style={{ color:'#9fb89c' }}>O ranking de tênis dos moradores do condomínio Rio2.</p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[
              {t:'Plataforma',  ls:[['#features','Recursos'],['#how','Como funciona'],['#ranking','Ranking']]},
              {t:'Comunidade',  ls:[['#cta','Participar'],['#ranking','Torneios']]},
              {t:'Contato',     ls:[['#','Administração Rio2'],['#','Comissão de Esportes']]},
            ].map(col => (
              <div key={col.t}>
                <h4 className="font-poppins font-semibold text-white mb-3">{col.t}</h4>
                {col.ls.map(([h,l]) => (
                  <a key={l} href={h} className="block text-sm py-1 transition-colors hover:text-[#dff24a]" style={{ color:'#9fb89c' }}>{l}</a>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 pt-5 flex flex-wrap items-center justify-between gap-2 text-sm" style={{ color:'#88a386' }}>
          <p>© 2026 ATP-Rio2 · Feito para a comunidade do Rio2</p>
          <p>🎾 Bom jogo a todos!</p>
        </div>
      </footer>
    </>
  )
}
