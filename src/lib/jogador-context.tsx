'use client'

import { createContext, useContext } from 'react'
import type { Jogador } from './supabase-browser'

type JogadorContextValue = {
  jogador: Jogador | null
  setJogador: (j: Jogador) => void
}

export const JogadorContext = createContext<JogadorContextValue>({
  jogador: null,
  setJogador: () => {},
})

export function useJogador() {
  return useContext(JogadorContext)
}
