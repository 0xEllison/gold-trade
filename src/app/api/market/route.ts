import { getSpotPrices } from '@/lib/nowapi'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  try {
    const data = await getSpotPrices()
    return NextResponse.json({ data, updatedAt: new Date().toISOString() })
  } catch (err) {
    console.error('[api/market]', err)
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 })
  }
}
