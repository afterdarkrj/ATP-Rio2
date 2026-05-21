'use client'

export default function TorneiosPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-poppins font-extrabold text-3xl mb-1" style={{ color: 'var(--green-900)' }}>Torneios</h1>
      <p className="mb-8" style={{ color: 'var(--muted)' }}>Gerencie as chaves e os resultados dos torneios da temporada.</p>
      <div className="bg-white rounded-2xl border p-10 text-center" style={{ borderColor: 'var(--line)' }}>
        <span className="text-5xl block mb-3">🏆</span>
        <p className="font-poppins font-bold text-lg" style={{ color: 'var(--green-700)' }}>Em breve</p>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>O módulo de torneios estará disponível em breve.</p>
      </div>
    </div>
  )
}
