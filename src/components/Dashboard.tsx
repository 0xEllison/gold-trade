'use client'

import { useEffect, useState } from 'react'

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

// 字体随视口宽度缩放
const fs = {
  xs:    'clamp(10px, 0.7vw, 16px)',
  sm:    'clamp(11px, 0.85vw, 18px)',
  base:  'clamp(12px, 0.95vw, 20px)',
  lg:    'clamp(13px, 1.1vw, 24px)',
  xl:    'clamp(15px, 1.3vw, 28px)',
  '2xl': 'clamp(17px, 1.5vw, 32px)',
  '3xl': 'clamp(22px, 2vw, 44px)',
  // 表格专用（放大 20%）
  tblXs: 'clamp(12px, 0.84vw, 19.2px)',
  tblSm: 'clamp(13.2px, 1.02vw, 21.6px)',
}

// 间距随视口缩放
const sp = {
  xs:  'clamp(4px,  0.4vw, 10px)',
  sm:  'clamp(6px,  0.6vw, 14px)',
  md:  'clamp(8px,  0.8vw, 18px)',
  lg:  'clamp(10px, 1vw,   22px)',
  xl:  'clamp(12px, 1.2vw, 28px)',
  px:  'clamp(16px, 2vw,   48px)',
  py:  'clamp(10px, 1.2vh, 28px)',
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
  const changeColor = diff >= 0 ? '#22c55e' : '#ef4444'

  return (
    <div style={{
      flex: 1, minWidth: 0,
      background: '#1a1a1a', border: '1px solid #2e2e2e',
      borderRadius: 'clamp(8px, 0.8vw, 16px)',
      padding: sp.xl,
      display: 'flex', flexDirection: 'column',
      gap: sp.sm, overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#fff', fontSize: fs.base, fontWeight: 600 }}>{item.name}</span>
        <span style={{ color: '#b8b9b6', fontSize: fs.xs }}>{item.ticker}</span>
      </div>
      <div style={{ color: '#fff', fontSize: fs['3xl'], fontWeight: 700, lineHeight: 1 }}>
        {formatPrice(item.lastPrice, item.currency)}
      </div>
      <div style={{ color: changeColor, fontSize: fs.sm }}>
        {formatChange(item.lastPrice, item.yesdayPrice, item.currency)}
      </div>
      <div style={{ display: 'flex', gap: sp.lg }}>
        <span style={{ color: '#b8b9b6', fontSize: fs.xs }}>
          今日高: {formatPrice(item.highPrice, item.currency)}
        </span>
        <span style={{ color: '#b8b9b6', fontSize: fs.xs }}>
          今日低: {formatPrice(item.lowPrice, item.currency)}
        </span>
      </div>
    </div>
  )
}

function TableShell({ dot, title, date, cols, children }: {
  dot: string; title: string; date: string
  cols: [string, string, string]
  children: React.ReactNode
}) {
  return (
    <div style={{
      flex: 1, minWidth: 0,
      background: '#1a1a1a', border: '1px solid #2e2e2e',
      borderRadius: 'clamp(8px, 0.8vw, 16px)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* 表头 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: `${sp.lg} ${sp.px}`,
        borderBottom: '1px solid #2e2e2e', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: dot, display: 'inline-block', flexShrink: 0 }} />
          <span style={{ color: '#fff', fontSize: fs.base, fontWeight: 600 }}>{title}</span>
        </div>
        <span style={{ color: '#666', fontSize: fs.tblXs, fontFamily: 'JetBrains Mono, monospace' }}>{date}</span>
      </div>
      {/* 列标题 */}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: `${sp.sm} ${sp.px}`,
        background: '#222', flexShrink: 0,
      }}>
        <span style={{ flex: 1, color: '#999', fontSize: fs.tblXs, fontWeight: 500 }}>{cols[0]}</span>
        <span style={{ flex: 1, color: '#999', fontSize: fs.tblXs, fontWeight: 500, textAlign: 'right' }}>{cols[1]}</span>
        <span style={{ flex: 1, color: '#999', fontSize: fs.tblXs, fontWeight: 500, textAlign: 'right' }}>{cols[2]}</span>
      </div>
      {/* 数据行区域 flex-1 均分高度 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}

function TableRow({ cells, last }: { cells: [React.ReactNode, React.ReactNode, React.ReactNode]; last: boolean }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex', alignItems: 'center',
      padding: `0 clamp(12px, 1.2vw, 28px)`,
      borderBottom: last ? 'none' : '1px solid #2e2e2e',
      minHeight: 0,
    }}>
      {cells[0]}
      {cells[1]}
      {cells[2]}
    </div>
  )
}

function BrandTable({ brands }: { brands: BrandPrice[] }) {
  return (
    <TableShell
      dot="#ff8400" title="品牌报价"
      date={brands[0]?.updatetime?.slice(0, 10) ?? ''}
      cols={['品牌', '零售价(元/g)', '回购价(元/g)']}
    >
      {brands.map((b, i) => (
        <TableRow key={i} last={i === brands.length - 1} cells={[
          <span style={{ flex: 1, color: '#fff', fontSize: fs.tblSm }}>{b.name}</span>,
          <span style={{ flex: 1, color: '#fff', fontSize: fs.tblSm, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace' }}>{b.price.toFixed(2)}</span>,
          <span style={{ flex: 1, color: '#ff8400', fontSize: fs.tblSm, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace' }}>{b.price2.toFixed(2)}</span>,
        ]} />
      ))}
    </TableShell>
  )
}

const BANKS = ['工商银行', '建设银行', '中国银行', '农业银行', '交通银行']

function BankTable() {
  const [today, setToday] = useState('')
  useEffect(() => setToday(new Date().toISOString().slice(0, 10)), [])
  return (
    <TableShell
      dot="#60a5fa" title="银行报价"
      date={today}
      cols={['银行', '买入价(元/g)', '卖出价(元/g)']}
    >
      {BANKS.map((name, i) => (
        <TableRow key={i} last={i === BANKS.length - 1} cells={[
          <span style={{ flex: 1, color: '#fff', fontSize: fs.tblSm }}>{name}</span>,
          <span style={{ flex: 1, color: '#60a5fa', fontSize: fs.tblSm, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace' }}>—</span>,
          <span style={{ flex: 1, color: '#fff', fontSize: fs.tblSm, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace' }}>—</span>,
        ]} />
      ))}
    </TableShell>
  )
}

function RecycleTable({ brands }: { brands: BrandPrice[] }) {
  return (
    <TableShell
      dot="#a78bfa" title="回收报价"
      date={brands[0]?.updatetime?.slice(0, 10) ?? ''}
      cols={['商家', '回收价(元/g)', '品质']}
    >
      {brands.map((b, i) => (
        <TableRow key={i} last={i === brands.length - 1} cells={[
          <span style={{ flex: 1, color: '#fff', fontSize: fs.tblSm }}>{b.name}</span>,
          <span style={{ flex: 1, color: '#a78bfa', fontSize: fs.tblSm, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace' }}>{b.price2.toFixed(2)}</span>,
          <span style={{ flex: 1, color: '#666', fontSize: fs.tblXs, textAlign: 'right' }}>足金99.9</span>,
        ]} />
      ))}
    </TableShell>
  )
}

export default function Dashboard() {
  const [spots, setSpots] = useState<SpotPrice[]>([])
  const [brands, setBrands] = useState<BrandPrice[]>([])
  const [updatedAt, setUpdatedAt] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(60000)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const fetchAll = async () => {
    try {
      const [mRes, bRes] = await Promise.all([fetch('/api/market'), fetch('/api/brands')])
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
    const id = setInterval(fetchAll, refreshInterval)
    return () => clearInterval(id)
  }, [refreshInterval])

  const displayBrands = brands.slice(0, 5)

  return (
    <main style={{
      height: '100vh', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      background: '#111111',
    }}>
      {/* ── 上半区：Header + Cards ── */}
      <section style={{
        flexShrink: 0,
        display: 'flex', flexDirection: 'column',
        gap: sp.xl,
        padding: `${sp.py} ${sp.px}`,
      }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.lg }}>
            <img src="/tianhe.png" alt="Tianhe" style={{ height: 'clamp(40px, 4vw, 80px)' }} />
            <img src="/tianji.png" alt="Tianji" style={{ height: 'clamp(40px, 4vw, 80px)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
              <h1 style={{ color: '#ff8400', fontSize: fs['2xl'], fontWeight: 700, margin: 0 }}>贵金属行情看板</h1>
              <p style={{ color: '#b8b9b6', fontSize: fs.xs, margin: 0 }}>实时行情数据</p>
            </div>
          </div>
          {mounted && (
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.lg }}>
              <select
                value={refreshInterval}
                onChange={e => setRefreshInterval(Number(e.target.value))}
                style={{
                  background: '#1a1a1a', color: '#fff',
                  border: '1px solid #2e2e2e',
                  borderRadius: 8, fontSize: fs.xs,
                  padding: `${sp.xs} ${sp.sm}`, cursor: 'pointer',
                }}
              >
                <option value={10000}>10秒</option>
                <option value={60000}>1分钟</option>
                <option value={300000}>5分钟</option>
              </select>
              <span style={{ color: '#b8b9b6', fontSize: fs.xs }}>更新时间: {updatedAt || '—'}</span>
            </div>
          )}
        </div>

        {/* Cards row */}
        <div style={{ display: 'flex', gap: sp.lg }}>
          {loading
            ? [0,1,2,3].map(i => (
                <div key={i} style={{
                  flex: 1, borderRadius: 12, height: 'clamp(100px, 12vh, 180px)',
                  background: '#1a1a1a', animation: 'pulse 1.5s infinite',
                }} />
              ))
            : spots.map(item => <SpotCard key={item.id} item={item} />)
          }
        </div>
      </section>

      {/* ── 下半区：Tables ── */}
      <section style={{
        flex: 1, minHeight: 0,
        display: 'flex', flexDirection: 'column',
        gap: sp.md,
        padding: `0 ${sp.px} ${sp.py}`,
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <span style={{ color: '#fff', fontSize: fs.lg, fontWeight: 600 }}>国内黄金实物报价</span>
          <span style={{ color: '#666', fontSize: fs.xs }}>数据仅供参考，以各机构实际报价为准</span>
        </div>

        <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: sp.lg }}>
          {loading
            ? [0,1,2].map(i => (
                <div key={i} style={{ flex: 1, borderRadius: 12, background: '#1a1a1a' }} />
              ))
            : <>
                <BrandTable brands={displayBrands} />
                <BankTable />
                <RecycleTable brands={displayBrands} />
              </>
          }
        </div>
      </section>
    </main>
  )
}
