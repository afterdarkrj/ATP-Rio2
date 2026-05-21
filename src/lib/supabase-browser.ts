import { createBrowserClient } from '@supabase/ssr'

let _client: ReturnType<typeof createBrowserClient> | null = null

export function getBrowserSupabase() {
  if (_client) return _client
  _client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
  return _client
}

export type Jogador = {
  id: string
  nome: string
  email: string
  condominio: string
  apartamento: string
  whatsapp: string
  is_admin: boolean
  lista_espera: boolean
  created_at: string
}
