import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { connect } from '../../../../lib/mongoose'
import UserModel from '../../../../lib/models/user'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing fields' },
        { status: 400 }
      )
    }

    await connect()

    const existing = await UserModel.findOne({ email }).lean()

    if (existing) {
      return NextResponse.json(
        { error: 'User exists' },
        { status: 400 }
      )
    }

    // 🔐 Async hash (NEVER use hashSync in production)
    const hashedPassword = await hash(password, 10)

    const user = await UserModel.create({
      email,
      password: hashedPassword
    })

    const response = NextResponse.json({ ok: true })

    response.headers.set(
      'Set-Cookie',
      `session=${user._id.toString()}; Path=/; HttpOnly; SameSite=Lax`
    )

    return response

  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}