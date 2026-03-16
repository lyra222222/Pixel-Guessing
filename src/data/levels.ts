export interface Level {
  id: string
  title: string
  artist: string
  answer: string
  imageUrl: string
}

export const LEVELS: Level[] = [
  { id: '1', title: '七里香', artist: '周杰伦', answer: '七里香', imageUrl: '/assets/levels/1.png' },
  { id: '2', title: '江南', artist: '林俊杰', answer: '江南', imageUrl: '/assets/levels/2.png' },
  { id: '3', title: '舞娘', artist: '蔡依林', answer: '舞娘', imageUrl: '/assets/levels/3.png' },
  { id: '4', title: '青花瓷', artist: '周杰伦', answer: '青花瓷', imageUrl: '/assets/levels/4.png' },
  { id: '5', title: '月亮代表我的心', artist: '邓丽君', answer: '月亮代表我的心', imageUrl: '/assets/levels/5.png' },
  { id: '6', title: '双节棍', artist: '周杰伦', answer: '双节棍', imageUrl: '/assets/levels/6.png' },
  { id: '7', title: '富士山下', artist: '陈奕迅', answer: '富士山下', imageUrl: '/assets/levels/7.png' },
  { id: '8', title: '泡沫', artist: '邓紫棋', answer: '泡沫', imageUrl: '/assets/levels/8.png' },
  { id: '9', title: '吻别', artist: '张学友', answer: '吻别', imageUrl: '/assets/levels/9.png' },
  { id: '10', title: '小幸运', artist: '田馥甄', answer: '小幸运', imageUrl: '/assets/levels/10.png' },
]
