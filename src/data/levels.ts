export interface Level {
  id: string
  title: string
  artist: string
  answer: string
  imageUrl: string
  /** 歌名提示数量：中文题库按字数，英文题库按单词数 */
  length: number
  /** 音乐类型：目前区分国语 / 粤语 */
  language: string
  /** 与 answer 等价的其它正确答案（如别称写法） */
  alternateAnswers?: string[]
}

export type GameLanguage = 'zh-CN' | 'zh-TW' | 'en'

export const LANGUAGE_OPTIONS: { code: GameLanguage; label: string }[] = [
  { code: 'zh-CN', label: '普通话' },
  { code: 'zh-TW', label: '粵語' },
  { code: 'en', label: 'English' },
]

export const DEFAULT_LANGUAGE: GameLanguage = 'zh-CN'

const ZH_CN_LEVELS: Level[] = [
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

const ZH_TW_LEVELS: Level[] = [
  {
    id: '1',
    title: '海闊天空',
    artist: 'Beyond',
    answer: '海闊天空',
    alternateAnswers: ['海阔天空'],
    imageUrl: '/assets/levels/zh-TW/01.png',
    length: 4,
    language: '廣東歌',
  },
  {
    id: '2',
    title: '記憶棉',
    artist: 'MC 張天賦',
    answer: '記憶棉',
    alternateAnswers: ['记忆棉', '記憶綿', '记忆绵'],
    imageUrl: '/assets/levels/zh-TW/02.png',
    length: 3,
    language: '廣東歌',
  },
  {
    id: '3',
    title: '富士山下',
    artist: '陳奕迅',
    answer: '富士山下',
    imageUrl: '/assets/levels/zh-TW/03.png',
    length: 4,
    language: '廣東歌',
  },
  {
    id: '4',
    title: '哪裡只得我共你',
    artist: 'Dear Jane',
    answer: '哪裡只得我共你',
    alternateAnswers: ['哪里只得我共你'],
    imageUrl: '/assets/levels/zh-TW/04.png',
    length: 7,
    language: '廣東歌',
  },
  {
    id: '5',
    title: '櫻花樹下',
    artist: '張敬軒',
    answer: '櫻花樹下',
    alternateAnswers: ['樱花树下'],
    imageUrl: '/assets/levels/zh-TW/05.png',
    length: 4,
    language: '廣東歌',
  },
  {
    id: '6',
    title: '用背脊唱情歌',
    artist: 'Gareth.T 湯令山',
    answer: '用背脊唱情歌',
    alternateAnswers: ['用背脊唱情歌'],
    imageUrl: '/assets/levels/zh-TW/06.png',
    length: 6,
    language: '廣東歌',
  },
  {
    id: '7',
    title: '黑玻璃',
    artist: '洪嘉豪',
    answer: '黑玻璃',
    imageUrl: '/assets/levels/zh-TW/07.png',
    length: 3,
    language: '廣東歌',
  },
  {
    id: '8',
    title: '葡萄成熟時',
    artist: '陳奕迅',
    answer: '葡萄成熟時',
    alternateAnswers: ['葡萄成熟时'],
    imageUrl: '/assets/levels/zh-TW/08.png',
    length: 5,
    language: '廣東歌',
  },
  {
    id: '9',
    title: '隱形遊樂場',
    artist: '張敬軒',
    answer: '隱形遊樂場',
    alternateAnswers: ['隐形游乐场'],
    imageUrl: '/assets/levels/zh-TW/09.png',
    length: 5,
    language: '廣東歌',
  },
  {
    id: '10',
    title: '風生水起',
    artist: '農夫',
    answer: '風生水起',
    alternateAnswers: ['风生水起'],
    imageUrl: '/assets/levels/zh-TW/10.png',
    length: 4,
    language: '廣東歌',
  },
]

const EN_LEVELS: Level[] = [
  {
    id: '1',
    title: 'My Heart Will Go On',
    artist: 'Céline Dion',
    answer: 'My Heart Will Go On',
    alternateAnswers: ['My Heart Will Go On Love Theme from Titanic'],
    imageUrl: '/assets/levels/en/01.png',
    length: 5,
    language: 'English songs',
  },
  {
    id: '2',
    title: 'Umbrella',
    artist: 'Rihanna',
    answer: 'Umbrella',
    alternateAnswers: ['Umbrella feat. Jay-Z'],
    imageUrl: '/assets/levels/en/02.png',
    length: 1,
    language: 'English songs',
  },
  {
    id: '3',
    title: 'Firework',
    artist: 'Katy Perry',
    answer: 'Firework',
    imageUrl: '/assets/levels/en/03.png',
    length: 1,
    language: 'English songs',
  },
  {
    id: '4',
    title: 'Cruel Summer',
    artist: 'Taylor Swift',
    answer: 'Cruel Summer',
    imageUrl: '/assets/levels/en/04.png',
    length: 2,
    language: 'English songs',
  },
  {
    id: '5',
    title: 'Counting Stars',
    artist: 'OneRepublic',
    answer: 'Counting Stars',
    imageUrl: '/assets/levels/en/05.png',
    length: 2,
    language: 'English songs',
  },
  {
    id: '6',
    title: 'Take Me Home, Country Roads',
    artist: 'John Denver',
    answer: 'Take Me Home, Country Roads',
    alternateAnswers: ['Take Me Home Country Roads', 'Country Roads'],
    imageUrl: '/assets/levels/en/06.png',
    length: 5,
    language: 'English songs',
  },
  {
    id: '7',
    title: 'Poker Face',
    artist: 'Lady Gaga',
    answer: 'Poker Face',
    imageUrl: '/assets/levels/en/07.png',
    length: 2,
    language: 'English songs',
  },
  {
    id: '8',
    title: 'Yellow',
    artist: 'Coldplay',
    answer: 'Yellow',
    imageUrl: '/assets/levels/en/08.png',
    length: 1,
    language: 'English songs',
  },
  {
    id: '9',
    title: 'Radioactive',
    artist: 'Imagine Dragons',
    answer: 'Radioactive',
    imageUrl: '/assets/levels/en/09.png',
    length: 1,
    language: 'English songs',
  },
  {
    id: '10',
    title: 'Set Fire to the Rain',
    artist: 'Adele',
    answer: 'Set Fire to the Rain',
    imageUrl: '/assets/levels/en/10.png',
    length: 5,
    language: 'English songs',
  },
]

export const LEVEL_BANKS: Record<GameLanguage, Level[]> = {
  'zh-CN': ZH_CN_LEVELS,
  'zh-TW': ZH_TW_LEVELS,
  en: EN_LEVELS,
}

export const LEVELS = LEVEL_BANKS[DEFAULT_LANGUAGE]

export function getLevelsForLanguage(language: GameLanguage | null): Level[] {
  return LEVEL_BANKS[language ?? DEFAULT_LANGUAGE]
}
