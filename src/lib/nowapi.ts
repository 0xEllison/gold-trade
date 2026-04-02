export interface SpotPrice {
  id: string
  name: string
  ticker: string
  lastPrice: number
  buyPrice: number
  sellPrice: number
  highPrice: number
  lowPrice: number
  yesdayPrice: number
  uptime: string
  currency: 'USD' | 'CNY'
  unit: string
}

async function fetchGold(goldid: string) {
  const BASE = process.env.NOWAPI_BASE_URL || 'https://sapi.k780.com/'
  const APPKEY = process.env.NOWAPI_APPKEY!
  const SIGN = process.env.NOWAPI_SIGN!
  const url = `${BASE}?app=finance.gold_price&goldid=${goldid}&version=3&appkey=${APPKEY}&sign=${SIGN}&format=json`
  const res = await fetch(url, { next: { revalidate: 60 } })
  const json = await res.json()
  return json?.result?.dtList?.[goldid] ?? null
}

async function fetchFutures(ftsIdS: string) {
  const BASE = process.env.NOWAPI_BASE_URL || 'https://sapi.k780.com/'
  const APPKEY = process.env.NOWAPI_APPKEY!
  const SIGN = process.env.NOWAPI_SIGN!
  const url = `${BASE}?app=quote.futures&ftsIdS=${ftsIdS}&appkey=${APPKEY}&sign=${SIGN}&format=json`
  const res = await fetch(url, { next: { revalidate: 60 } })
  const json = await res.json()
  return json?.result?.dtList?.[ftsIdS] ?? null
}

export async function getSpotPrices(): Promise<SpotPrice[]> {
  const [xauusd, xagusd, auDom, comex] = await Promise.all([
    fetchGold('1201'),
    fetchGold('1203'),
    fetchGold('1053'),
    fetchFutures('31001'),
  ])

  const results: SpotPrice[] = []

  if (xauusd) {
    results.push({
      id: 'xauusd-spot',
      name: '伦敦金现货',
      ticker: 'XAU/USD',
      lastPrice: parseFloat(xauusd.last_price),
      buyPrice: parseFloat(xauusd.buy_price),
      sellPrice: parseFloat(xauusd.sell_price),
      highPrice: parseFloat(xauusd.high_price),
      lowPrice: parseFloat(xauusd.low_price),
      yesdayPrice: parseFloat(xauusd.yesy_price),
      uptime: xauusd.uptime,
      currency: 'USD',
      unit: 'oz',
    })
  }

  if (xagusd) {
    results.push({
      id: 'xagusd-spot',
      name: '伦敦银现货',
      ticker: 'XAG/USD',
      lastPrice: parseFloat(xagusd.last_price),
      buyPrice: parseFloat(xagusd.buy_price),
      sellPrice: parseFloat(xagusd.sell_price),
      highPrice: parseFloat(xagusd.high_price),
      lowPrice: parseFloat(xagusd.low_price),
      yesdayPrice: parseFloat(xagusd.yesy_price),
      uptime: xagusd.uptime,
      currency: 'USD',
      unit: 'oz',
    })
  }

  if (comex) {
    results.push({
      id: 'comex-gc-main',
      name: 'COMEX黄金期货',
      ticker: 'GC',
      lastPrice: parseFloat(comex.lastPrice ?? comex.last_price),
      buyPrice: parseFloat(comex.buy ?? comex.bid ?? 0),
      sellPrice: parseFloat(comex.sell ?? comex.ask ?? 0),
      highPrice: parseFloat(comex.highPrice ?? comex.high_price),
      lowPrice: parseFloat(comex.lowPrice ?? comex.low_price),
      yesdayPrice: parseFloat(comex.yesyPrice ?? comex.yesy_price),
      uptime: comex.upTime ?? comex.uptime ?? '',
      currency: 'USD',
      unit: 'oz',
    })
  }

  if (auDom) {
    results.push({
      id: 'au-domestic',
      name: '国内现货',
      ticker: 'CNY/g',
      lastPrice: parseFloat(auDom.last_price),
      buyPrice: parseFloat(auDom.buy_price),
      sellPrice: parseFloat(auDom.sell_price),
      highPrice: parseFloat(auDom.high_price),
      lowPrice: parseFloat(auDom.low_price),
      yesdayPrice: parseFloat(auDom.yesy_price),
      uptime: auDom.uptime,
      currency: 'CNY',
      unit: 'g',
    })
  }

  return results
}
