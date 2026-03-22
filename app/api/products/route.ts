import { NextResponse } from 'next/server'
import { products } from '@/data/product'

export async function GET() {
  return NextResponse.json(products)
}
