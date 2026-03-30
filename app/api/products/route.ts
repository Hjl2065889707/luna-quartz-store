import { NextRequest, NextResponse } from 'next/server'
import { products } from '@/data/product'

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')

  let filteredProducts = products

  if (query) {
    const lowerCaseQuery = query.toLowerCase()
    filteredProducts = products.filter((item) => {
      return item.name.toLowerCase().includes(lowerCaseQuery)
    })
  }
  return NextResponse.json(filteredProducts)
}
