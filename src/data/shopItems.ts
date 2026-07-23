import { DEFAULT_LANGUAGE, type GameLanguage } from '@/data/levels'

/**
 * CD 商铺数据源，与关卡/答题完全独立
 */
export interface LocalizedShopItemText {
  name: string
  artist: string
}

export interface ShopItem {
  id: string
  imageUrl: string
  price: number
  localized: Record<GameLanguage, LocalizedShopItemText>
}

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'shop-1',
    imageUrl: '/assets/collection/1.png',
    price: 50,
    localized: {
      'zh-CN': { name: '范特西', artist: '周杰伦' },
      'zh-TW': { name: '范特西', artist: '周杰倫' },
      en: { name: 'Fantasy', artist: 'Jay Chou' },
    },
  },
  {
    id: 'shop-2',
    imageUrl: '/assets/collection/2.png',
    price: 50,
    localized: {
      'zh-CN': { name: '江南', artist: '林俊杰' },
      'zh-TW': { name: '江南', artist: '林俊傑' },
      en: { name: 'River South', artist: 'JJ Lin' },
    },
  },
  {
    id: 'shop-3',
    imageUrl: '/assets/collection/3.png',
    price: 50,
    localized: {
      'zh-CN': { name: '富士山下', artist: '陈奕迅' },
      'zh-TW': { name: '富士山下', artist: '陳奕迅' },
      en: { name: 'Under Mount Fuji', artist: 'Eason Chan' },
    },
  },
  {
    id: 'shop-4',
    imageUrl: '/assets/collection/4.png',
    price: 50,
    localized: {
      'zh-CN': { name: '花蝴蝶', artist: '蔡依林' },
      'zh-TW': { name: '花蝴蝶', artist: '蔡依林' },
      en: { name: 'Butterfly', artist: 'Jolin Tsai' },
    },
  },
]

export function getLocalizedShopItem(
  item: ShopItem,
  language: GameLanguage | null | undefined
): LocalizedShopItemText {
  return item.localized[language ?? DEFAULT_LANGUAGE]
}
