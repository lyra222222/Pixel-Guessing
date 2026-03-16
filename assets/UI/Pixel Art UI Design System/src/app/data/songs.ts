export interface Song {
  id: number;
  title: string;
  artist: string;
  image: string;
}

const images = [
  "https://images.unsplash.com/photo-1760931657876-116605bd9dee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXhlbCUyMGFydCUyMG11c2ljJTIwdmlueWwlMjByZWNvcmQlMjBuZW9ufGVufDF8fHx8MTc3MzIzNTg0MHww&ixlib=rb-4.1.0&q=80&w=600",
  "https://images.unsplash.com/photo-1761682704492-b7ed11edfda7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMGFsYnVtJTIwY292ZXIlMjBjb2xvcmZ1bCUyMG11c2ljfGVufDF8fHx8MTc3MzIzNTg0NXww&ixlib=rb-4.1.0&q=80&w=600",
  "https://images.unsplash.com/photo-1688377051459-aebb99b42bff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwY2l0eSUyMG5pZ2h0JTIwY3liZXJwdW5rfGVufDF8fHx8MTc3MzIzNTg0NXww&ixlib=rb-4.1.0&q=80&w=600",
  "https://images.unsplash.com/photo-1625140233675-912059ebd5f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwdmlueWwlMjByZWNvcmQlMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc3MzIzNTg0Nnww&ixlib=rb-4.1.0&q=80&w=600",
  "https://images.unsplash.com/photo-1651914702499-95ef87a739d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGNvbG9yZnVsJTIwbXVzaWMlMjBhcnQlMjBwb3N0ZXJ8ZW58MXx8fHwxNzczMjM1ODUwfDA&ixlib=rb-4.1.0&q=80&w=600",
  "https://images.unsplash.com/photo-1649676145667-6a07b10a3c99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMHN5bnRod2F2ZSUyMHN1bnNldCUyMHBpeGVsfGVufDF8fHx8MTc3MzIzNTg1MHww&ixlib=rb-4.1.0&q=80&w=600",
  "https://images.unsplash.com/photo-1725612218029-ae9961db0d96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwYXJ0JTIwZ2VvbWV0cmljJTIwbmVvbnxlbnwxfHx8fDE3NzMyMzU4NTF8MA&ixlib=rb-4.1.0&q=80&w=600",
  "https://images.unsplash.com/photo-1592973286472-8f8263a3683c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3AlMjBtdXNpYyUyMGNvbG9yZnVsJTIwcG9ydHJhaXQlMjBzaW5nZXJ8ZW58MXx8fHwxNzczMjM1ODUxfDA&ixlib=rb-4.1.0&q=80&w=600",
  "https://images.unsplash.com/photo-1720293862142-61c1f3deb794?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFycnklMjBuaWdodCUyMHNreSUyMG11c2ljJTIwZHJlYW15fGVufDF8fHx8MTc3MzIzNTg1MXww&ixlib=rb-4.1.0&q=80&w=600",
];

const rawSongs: [string, string][] = [
  ['晴天', '周杰伦'],
  ['七里香', '周杰伦'],
  ['青花瓷', '周杰伦'],
  ['夜曲', '周杰伦'],
  ['稻香', '周杰伦'],
  ['告白气球', '周杰伦'],
  ['等你下课', '周杰伦'],
  ['彩虹', '周杰伦'],
  ['说好不哭', '周杰伦'],
  ['爱在西元前', '周杰伦'],
  ['成都', '赵雷'],
  ['我记得', '赵雷'],
  ['平凡之路', '朴树'],
  ['那些年', '胡夏'],
  ['小幸运', '田馥甄'],
  ['好久不见', '陈奕迅'],
  ['富士山下', '陈奕迅'],
  ['红玫瑰', '陈奕迅'],
  ['十年', '陈奕迅'],
  ['爱情转移', '陈奕迅'],
  ['演员', '薛之谦'],
  ['认真的雪', '薛之谦'],
  ['绅士', '薛之谦'],
  ['你还要我怎样', '薛之谦'],
  ['浪漫手机', '刀郎'],
  ['盛夏的果实', '莫文蔚'],
  ['爱你', '王心凌'],
  ['甜蜜蜜', '邓丽君'],
  ['月亮代表我的心', '邓丽君'],
  ['光年之外', 'G.E.M.'],
  ['泡沫', 'G.E.M.'],
  ['喜欢你', 'G.E.M.'],
  ['红豆', '王菲'],
  ['传奇', '王菲'],
  ['匆匆那年', '王菲'],
  ['后来', '刘若英'],
  ['很爱很爱你', '刘若英'],
  ['突然好想你', '五月天'],
  ['知足', '五月天'],
  ['温柔', '五月天'],
  ['倔强', '五月天'],
  ['小酒窝', '林俊杰'],
  ['江南', '林俊杰'],
  ['曹操', '林俊杰'],
  ['修炼爱情', '林俊杰'],
  ['背对背拥抱', '林俊杰'],
  ['同桌的你', '老狼'],
  ['童年', '罗大佑'],
  ['朋友', '周华健'],
  ['挥着翅膀的女孩', '容祖儿'],
];

export const songs: Song[] = rawSongs.map(([title, artist], index) => ({
  id: index + 1,
  title,
  artist,
  image: images[index % images.length],
}));

export const TOTAL_LEVELS = songs.length;
