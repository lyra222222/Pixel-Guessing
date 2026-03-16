/**
 * CD 商铺数据源，与关卡/答题完全独立
 */
export interface ShopItem {
  id: string
  name: string
  artist: string
  imageUrl: string
  price: number
}

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'shop-1', name: '范特西', artist: '周杰伦', imageUrl: '/assets/collection/1.png', price: 50 },
  { id: 'shop-2', name: '江南', artist: '林俊杰', imageUrl: '/assets/collection/2.png', price: 50 },
  { id: 'shop-3', name: '富士山下', artist: '陈奕迅', imageUrl: '/assets/collection/3.png', price: 50 },
  { id: 'shop-4', name: '花蝴蝶', artist: '蔡依林', imageUrl: '/assets/collection/4.png', price: 50 },
]
