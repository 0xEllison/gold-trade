import { getGoldMarket } from '@/lib/alapi'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const data = await getGoldMarket('SH')
    return NextResponse.json({ data })
  } catch (err) {
    console.error('[api/gold-sh]', err)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
