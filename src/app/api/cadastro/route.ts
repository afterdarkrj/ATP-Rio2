import { NextResponse } from 'next/server'
import { getSupabase, getSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nome, condominio, apartamento, email, whatsapp, password } = body

    if (!nome || !condominio || !apartamento || !email || !whatsapp || !password) {
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

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter no mínimo 6 caracteres.' },
        { status: 400 }
      )
    }

    const { data: authData, error: authError } = await getSupabaseAdmin()
      .auth.admin.createUser({ email, password, email_confirm: true })

    if (authError) {
      if (authError.message.includes('already been registered')) {
        return NextResponse.json(
          { error: 'Este e-mail já está cadastrado.' },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: 'Erro ao criar conta. Tente novamente.' },
        { status: 500 }
      )
    }

    const { error } = await getSupabase()
      .from('jogadores')
      .insert([{ id: authData.user.id, nome, condominio, apartamento, email, whatsapp, lista_espera: true }])

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
