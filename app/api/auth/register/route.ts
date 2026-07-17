import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, password, country, state } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password is required!' },
        { status: 400 },
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'This email is already registered' },
        { status: 400 },
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        country,
        state,
      },
      select: {
        id: true,
        email: true,
        name: true,
        country: true,
        state: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Unexpected registration error:', error)

    return NextResponse.json(
      { error: 'Sorry, something went wrong. Please try again later.' },
      { status: 500 },
    )
  }
}
