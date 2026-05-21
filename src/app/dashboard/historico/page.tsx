'use client'

export default function HistoricoPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-poppins font-extrabold text-3xl mb-1" style={{ color: 'var(--green-900)' }}>Histórico</h1>
      <p className="mb-8" style={{ color: 'var(--muted)' }}>Seu desempenho completo ao longo das temporadas.</p>
      <div className="bg-white rounded-2xl border p-10 text-center" style={{ borderColor: 'var(--line)' }}>
        <span className="text-5xl block mb-3">📈</span>
        <p className="font-poppins font-bold text-lg" style={{ color: 'var(--green-700)' }}>Em breve</p>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Seu histórico de partidas e evolução aparecerá aqui.</p>
      </div>
    </div>
  )
}
