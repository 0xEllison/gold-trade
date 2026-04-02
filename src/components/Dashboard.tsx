'use client'

import { useEffect, useState, useCallback } from 'react'

interface SpotPrice {
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

interface BrandPrice {
  name: string
  price: number
  price2: number
  updatetime: string
}

function formatPrice(price: number, currency: 'USD' | 'CNY') {
  if (isNaN(price)) return '—'
  const sym = currency === 'USD' ? '$' : '¥'
  return `${sym}${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatChange(last: number, yesterday: number, currency: 'USD' | 'CNY') {
  if (isNaN(last) || isNaN(yesterday) || yesterday === 0) return '—'
  const diff = last - yesterday
  const pct = (diff / yesterday) * 100
  const sym = currency === 'USD' ? '$' : '¥'
  const sign = diff >= 0 ? '+' : ''
  return `${sign}${sym}${Math.abs(diff).toFixed(2)} (${sign}${pct.toFixed(2)}%)`
}

function SpotCard({ item }: { item: SpotPrice }) {
  const diff = item.lastPrice - item.yesdayPrice
  const isUp = diff >= 0
  const changeColor = isUp ? '#22c55e' : '#ef4444'

  return (
    <div
      className="flex-1 rounded-xl p-4 flex flex-col gap-3 overflow-hidden relative"
      style={{ background: '#1a1a1a', border: '1px solid #2e2e2e', minWidth: 0 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-white text-sm font-semibold">{item.name}</span>
        <span className="text-xs font-normal" style={{ color: '#b8b9b6' }}>{item.ticker}</span>
      </div>
      <div className="text-white text-3xl font-bold leading-none">
        {formatPrice(item.lastPrice, item.currency)}
      </div>
      <div className="text-sm" style={{ color: changeColor }}>
        {formatChange(item.lastPrice, item.yesdayPrice, item.currency)}
      </div>
      <div className="flex gap-4">
        <span className="text-xs" style={{ color: '#b8b9b6' }}>
          今日高: {formatPrice(item.highPrice, item.currency)}
        </span>
        <span className="text-xs" style={{ color: '#b8b9b6' }}>
          今日低: {formatPrice(item.lowPrice, item.currency)}
        </span>
      </div>
    </div>
  )
}

function BrandTable({ brands }: { brands: BrandPrice[] }) {
  const updatedAt = brands[0]?.updatetime ?? ''
  return (
    <div className="flex-1 rounded-xl flex flex-col overflow-hidden" style={{ background: '#1a1a1a', border: '1px solid #2e2e2e', minWidth: 0 }}>
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid #2e2e2e' }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#ff8400' }} />
          <span className="text-white text-sm font-semibold">品牌报价</span>
        </div>
        <span className="text-xs" style={{ color: '#666', fontFamily: 'JetBrains Mono, monospace' }}>{updatedAt.slice(0, 10)}</span>
      </div>
      <div className="flex items-center px-5 py-2.5" style={{ background: '#222' }}>
        <span className="flex-1 text-xs font-medium" style={{ color: '#999' }}>品牌</span>
        <span className="flex-1 text-xs font-medium text-right" style={{ color: '#999' }}>零售价(元/g)</span>
        <span className="flex-1 text-xs font-medium text-right" style={{ color: '#999' }}>回购价(元/g)</span>
      </div>
      {brands.map((b, i) => (
        <div
          key={`brand-${i}`}
          className="flex items-center px-5 py-3"
          style={i < brands.length - 1 ? { borderBottom: '1px solid #2e2e2e' } : undefined}
        >
          <span className="flex-1 text-sm text-white" style={{ fontFamily: 'Geist, sans-serif' }}>{b.name}</span>
          <span className="flex-1 text-sm text-right text-white" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{b.price.toFixed(2)}</span>
          <span className="flex-1 text-sm text-right" style={{ color: '#ff8400', fontFamily: 'JetBrains Mono, monospace' }}>{b.price2.toFixed(2)}</span>
        </div>
      ))}
    </div>
  )
}

interface BankRow { name: string; buy: number; sell: number }

const BANK_MOCK: BankRow[] = [
  { name: '工商银行', buy: 0, sell: 0 },
  { name: '建设银行', buy: 0, sell: 0 },
  { name: '中国银行', buy: 0, sell: 0 },
  { name: '农业银行', buy: 0, sell: 0 },
  { name: '交通银行', buy: 0, sell: 0 },
]

function BankTable({ domestic }: { domestic: SpotPrice | undefined }) {
  const today = new Date().toISOString().slice(0, 10)
  return (
    <div className="flex-1 rounded-xl flex flex-col overflow-hidden" style={{ background: '#1a1a1a', border: '1px solid #2e2e2e', minWidth: 0 }}>
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid #2e2e2e' }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#60a5fa' }} />
          <span className="text-white text-sm font-semibold">银行报价</span>
        </div>
        <span className="text-xs" style={{ color: '#666', fontFamily: 'JetBrains Mono, monospace' }}>{today}</span>
      </div>
      <div className="flex items-center px-5 py-2.5" style={{ background: '#222' }}>
        <span className="flex-1 text-xs font-medium" style={{ color: '#999' }}>银行</span>
        <span className="flex-1 text-xs font-medium text-right" style={{ color: '#999' }}>买入价(元/g)</span>
        <span className="flex-1 text-xs font-medium text-right" style={{ color: '#999' }}>卖出价(元/g)</span>
      </div>
      {BANK_MOCK.map((b, i) => (
        <div
          key={`bank-${i}`}
          className="flex items-center px-5 py-3"
          style={i < BANK_MOCK.length - 1 ? { borderBottom: '1px solid #2e2e2e' } : undefined}
        >
          <span className="flex-1 text-sm text-white" style={{ fontFamily: 'Geist, sans-serif' }}>{b.name}</span>
          <span className="flex-1 text-sm text-right" style={{ color: '#60a5fa', fontFamily: 'JetBrains Mono, monospace' }}>—</span>
          <span className="flex-1 text-sm text-right text-white" style={{ fontFamily: 'JetBrains Mono, monospace' }}>—</span>
        </div>
      ))}
    </div>
  )
}

function RecycleTable({ brands }: { brands: BrandPrice[] }) {
  const updatedAt = brands[0]?.updatetime ?? ''
  return (
    <div className="flex-1 rounded-xl flex flex-col overflow-hidden" style={{ background: '#1a1a1a', border: '1px solid #2e2e2e', minWidth: 0 }}>
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid #2e2e2e' }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#a78bfa' }} />
          <span className="text-white text-sm font-semibold">回收报价</span>
        </div>
        <span className="text-xs" style={{ color: '#666', fontFamily: 'JetBrains Mono, monospace' }}>{updatedAt.slice(0, 10)}</span>
      </div>
      <div className="flex items-center px-5 py-2.5" style={{ background: '#222' }}>
        <span className="flex-1 text-xs font-medium" style={{ color: '#999' }}>商家</span>
        <span className="flex-1 text-xs font-medium text-right" style={{ color: '#999' }}>回收价(元/g)</span>
        <span className="flex-1 text-xs font-medium text-right" style={{ color: '#999' }}>品质</span>
      </div>
      {brands.map((b, i) => (
        <div
          key={`recycle-${i}`}
          className="flex items-center px-5 py-3"
          style={i < brands.length - 1 ? { borderBottom: '1px solid #2e2e2e' } : undefined}
        >
          <span className="flex-1 text-sm text-white" style={{ fontFamily: 'Geist, sans-serif' }}>{b.name}</span>
          <span className="flex-1 text-sm text-right" style={{ color: '#a78bfa', fontFamily: 'JetBrains Mono, monospace' }}>{b.price2.toFixed(2)}</span>
          <span className="flex-1 text-sm text-right" style={{ color: '#666', fontFamily: 'Geist, sans-serif' }}>足金99.9</span>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const [spots, setSpots] = useState<SpotPrice[]>([])
  const [brands, setBrands] = useState<BrandPrice[]>([])
  const [updatedAt, setUpdatedAt] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [interval, setRefreshInterval] = useState(60000) // 默认1分钟
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchAll = async () => {
    try {
      const [mRes, bRes] = await Promise.all([
        fetch('/api/market'),
        fetch('/api/brands'),
      ])
      const mJson = await mRes.json()
      const bJson = await bRes.json()
      if (mJson.data) setSpots(mJson.data)
      if (bJson.data) setBrands(bJson.data)
      setUpdatedAt(new Date().toLocaleString('zh-CN'))
    } catch (err) {
      console.error('Failed to fetch data:', err)
    }
  }

  useEffect(() => {
    fetchAll().finally(() => setLoading(false))
    const id = setInterval(fetchAll, interval)
    return () => clearInterval(id)
  }, [interval])

  const domestic = spots.find(s => s.id === 'au-domestic')
  const displayBrands = brands.slice(0, 5)

  return (
    <main className="min-h-screen flex flex-col" style={{ background: '#111111' }}>
      {/* Header + Cards */}
      <section className="flex flex-col gap-6 px-8 py-6" style={{ background: '#111111' }}>
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/tianhe.png" alt="Tianhe" className="h-16" />
            <img src="/tianji.png" alt="Tianji" className="h-16" />
            <div className="flex flex-col gap-1.5">
              <h1 className="text-white text-3xl font-bold" style={{ color: '#ff8400' }}>贵金属行情看板</h1>
              <p className="text-sm" style={{ color: '#b8b9b6' }}>实时行情数据</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {mounted && (
              <>
                <select
                  value={interval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="px-3 py-1.5 rounded-lg text-sm border"
                  style={{ background: '#1a1a1a', color: '#fff', borderColor: '#2e2e2e' }}
                >
                  <option value={10000}>10秒</option>
                  <option value={60000}>1分钟</option>
                  <option value={300000}>5分钟</option>
                </select>
                <span className="text-xs" style={{ color: '#b8b9b6', fontFamily: 'Inter, sans-serif' }}>
                  更新时间: {updatedAt || '—'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Cards row */}
        {loading ? (
          <div className="flex gap-4">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="flex-1 rounded-xl h-32 animate-pulse" style={{ background: '#1a1a1a' }} />
            ))}
          </div>
        ) : (
          <div className="flex gap-4">
            {spots.map(item => <SpotCard key={item.id} item={item} />)}
          </div>
        )}
      </section>

      {/* Tables section */}
      <section className="flex flex-col gap-4 px-8 pb-8" style={{ background: '#111111' }}>
        <div className="flex items-center justify-between">
          <span className="text-white text-lg font-semibold" style={{ fontFamily: 'Geist, sans-serif' }}>国内黄金实物报价</span>
          <span className="text-xs" style={{ color: '#666' }}>数据仅供参考，以各机构实际报价为准</span>
        </div>

        {loading ? (
          <div className="flex gap-4">
            {[0, 1, 2].map(i => (
              <div key={i} className="flex-1 rounded-xl h-72 animate-pulse" style={{ background: '#1a1a1a' }} />
            ))}
          </div>
        ) : (
          <div className="flex gap-4 items-start">
            <BrandTable brands={displayBrands} />
            <BankTable domestic={domestic} />
            <RecycleTable brands={displayBrands} />
          </div>
        )}
      </section>
    </main>
  )
}
