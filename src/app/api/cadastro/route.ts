import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nome, condominio, apartamento, email, whatsapp } = body

    if (!nome || !condominio || !apartamento || !email || !whatsapp) {
      return NextResponse.json(
        { error: 'Preencha todos os campos.' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Informe um e-mail válido.' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('cadastros')
      .insert([{ nome, condominio, apartamento, email, whatsapp }])

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar. Tente novamente.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json(
      { error: 'Erro inesperado.' },
      { status: 500 }
    )
  }
}
