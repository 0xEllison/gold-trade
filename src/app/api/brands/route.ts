import { getBrandPrices } from '@/lib/alapi'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  try {
    const data = await getBrandPrices()
    return NextResponse.json({ data, updatedAt: new Date().toISOString() })
  } catch (err) {
    console.error('[api/brands]', err)
    return NextResponse.json({ error: 'Failed to fetch brand prices' }, { status: 500 })
  }
}
