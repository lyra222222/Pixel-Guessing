export interface Level {
  id: string
  title: string
  artist: string
  answer: string
  imageUrl: string
  /** 歌名的字数（用于提示） */
  length: number
  /** 音乐类型：目前区分国语 / 粤语 */
  language: '国语' | '粤语'
  /** 与 answer 等价的其它正确答案（如别称写法） */
  alternateAnswers?: string[]
}

export const LEVELS: Level[] = [
  {
    id: '1',
    title: '七里香',
    artist: '周杰伦',
    answer: '七里香',
    imageUrl: '/assets/levels/1.png',
    length: 3,
    language: '国语',
  },
  {
    id: '2',
    title: '双节棍',
    artist: '周杰伦',
    answer: '双节棍',
    alternateAnswers: ['双截棍'],
    imageUrl: '/assets/levels/6.png',
    length: 3,
    language: '国语',
  },
  {
    id: '3',
    title: '舞娘',
    artist: '蔡依林',
    answer: '舞娘',
    imageUrl: '/assets/levels/3.png',
    length: 2,
    language: '国语',
  },
  {
    id: '4',
    title: '青花瓷',
    artist: '周杰伦',
    answer: '青花瓷',
    imageUrl: '/assets/levels/4.png',
    length: 3,
    language: '国语',
  },
  {
    id: '5',
    title: '月亮代表我的心',
    artist: '邓丽君',
    answer: '月亮代表我的心',
    imageUrl: '/assets/levels/5.png',
    length: 7,
    language: '国语',
  },
  {
    id: '6',
    title: '江南',
    artist: '林俊杰',
    answer: '江南',
    imageUrl: '/assets/levels/2.png',
    length: 2,
    language: '国语',
  },
  {
    id: '7',
    title: '富士山下',
    artist: '陈奕迅',
    answer: '富士山下',
    imageUrl: '/assets/levels/7.png',
    length: 4,
    language: '粤语',
  },
  {
    id: '8',
    title: '泡沫',
    artist: '邓紫棋',
    answer: '泡沫',
    imageUrl: '/assets/levels/8.png',
    length: 2,
    language: '国语',
  },
  {
    id: '9',
    title: '吻别',
    artist: '张学友',
    answer: '吻别',
    imageUrl: '/assets/levels/9.png',
    length: 2,
    language: '国语',
  },
  {
    id: '10',
    title: '小幸运',
    artist: '田馥甄',
    answer: '小幸运',
    imageUrl: '/assets/levels/10.png',
    length: 3,
    language: '国语',
  },
]
