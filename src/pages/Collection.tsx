import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Store, LayoutGrid } from 'lucide-react'
import { PixelPanel } from '@/components/PixelPanel'
import { useGameState } from '@/hooks/useGameState'
import { SHOP_ITEMS } from '@/data/shopItems'
import { purchaseShopItem } from '@/store/gameStore'

type Tab = 'shop' | 'mine'

export default function Collection() {
  const [tab, setTab] = useState<Tab>('shop')
  const { score, purchasedShopIds } = useGameState()
  const myItems = SHOP_ITEMS.filter((item) => purchasedShopIds.includes(item.id))

  return (
    <div className="min-h-dvh bg-navy">
      <div className="p-4">
        <PixelPanel compact>
          <div className="flex items-center justify-between">
            <span className="font-pixel text-lg text-neonCyan">
              积分：<strong>{score}</strong>
            </span>
            <Link to="/" className="btn-pixel btn-pixel-sm">
              <Home className="h-5 w-5 flex-shrink-0" />
              返回首页
            </Link>
          </div>
        </PixelPanel>
      </div>

      <div className="px-4 pb-4">
        <PixelPanel className="overflow-hidden">
          <div className="mb-4 flex border-b-2 border-[var(--border)] -mx-1 px-1">
            <button
              type="button"
              onClick={() => setTab('shop')}
              className={`font-pixel flex flex-1 items-center justify-center gap-2 py-3 text-lg ${
                tab === 'shop'
                  ? 'border-b-4 border-neonCyan text-neonCyan'
                  : 'text-text-muted hover:text-[var(--text)]'
              }`}
            >
              <Store className="h-5 w-5 flex-shrink-0" />
              CD 商铺
            </button>
            <button
              type="button"
              onClick={() => setTab('mine')}
              className={`font-pixel flex flex-1 items-center justify-center gap-2 py-3 text-lg ${
                tab === 'mine'
                  ? 'border-b-4 border-neonPink text-neonPink'
                  : 'text-text-muted hover:text-[var(--text)]'
              }`}
            >
              <LayoutGrid className="h-5 w-5 flex-shrink-0" />
              我的 CD 架
            </button>
          </div>

          <div
            className="page-bg min-h-[60dvh] flex-1 rounded-lg"
            style={{ backgroundImage: 'url(/assets/cd_shop.png)' }}
          >
            {tab === 'shop' && (
              <motion.div
                className="grid grid-cols-2 gap-4 p-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {SHOP_ITEMS.map((item) => {
                  const owned = purchasedShopIds.includes(item.id)
                  const canBuy = score >= item.price && !owned
                  return (
                    <PixelPanel key={item.id} compact className="p-3">
                  <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="mx-auto mb-2 h-24 w-24 rounded object-cover"
                    />
                    <p className="font-pixel text-center font-bold text-white">
                      {item.name}
                    </p>
                    <p className="font-pixel text-center text-sm text-text-muted">
                      {item.artist}
                    </p>
                    {owned ? (
                      <p className="font-pixel mt-2 text-center text-neonCyan">
                        已拥有
                      </p>
                    ) : (
                      <button
                        type="button"
                        disabled={!canBuy}
                        onClick={() => purchaseShopItem(item.id, item.price)}
                        className="btn-pixel btn-pixel-sm mt-2 w-full disabled:opacity-50"
                      >
                        {item.price} 积分兑换
                      </button>
                    )}
                  </PixelPanel>
                )
              })}
              </motion.div>
            )}

            {tab === 'mine' && (
              <motion.div
                className="flex flex-col items-center p-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {myItems.length === 0 ? (
                  <p className="font-pixel mt-12 text-center text-text-muted">
                    暂无唱片，去 CD 商铺用积分兑换
                  </p>
                ) : (
                  <div className="grid w-full grid-cols-2 gap-4">
                    {myItems.map((item) => (
                      <PixelPanel key={item.id} compact className="flex flex-col items-center">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="mb-0 h-48 w-48 object-cover"
                        />
                        <p className="font-pixel mb-1.5 text-center font-bold text-white">
                          {item.name}
                        </p>
                        <p className="font-pixel mb-1.5 text-center text-sm text-text-muted">
                          {item.artist}
                        </p>
                      </PixelPanel>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </PixelPanel>
      </div>
    </div>
  )
}
