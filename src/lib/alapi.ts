const ALAPI_TOKEN = process.env.ALAPI_TOKEN!

export interface BrandPrice {
  name: string
  price: number
  price2: number
  updatetime: string
}

export async function getBrandPrices(): Promise<BrandPrice[]> {
  const url = `https://v3.alapi.cn/api/gold/brand?token=${ALAPI_TOKEN}`
  const res = await fetch(url, { next: { revalidate: 300 } })
  const json = await res.json()
  const list = json?.data ?? []
  return list.map((item: Record<string, unknown>) => ({
    name: item.brand_name as string,
    price: parseFloat(item.price as string),
    price2: parseFloat(item.price_2 as string),
    updatetime: item.ts
      ? new Date((item.ts as number) * 1000).toISOString().slice(0, 10)
      : '',
  }))
}
