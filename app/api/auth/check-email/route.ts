import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ exists: false })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    return NextResponse.json({ exists: !!user })
  } catch (error) {
    console.error('Email checking error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
