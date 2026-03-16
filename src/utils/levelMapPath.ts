/**
 * S 形路径：从左下到右上，沿沙滩小路中心线均匀取点
 * 使用三次贝塞尔曲线生成 S 形，再等距采样
 */
function cubicBezier(
  t: number,
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number }
): { x: number; y: number } {
  const u = 1 - t
  const uu = u * u
  const uuu = uu * u
  const tt = t * t
  const ttt = tt * t
  return {
    x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
    y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
  }
}

/** 曲线起点（左下）、终点（右上）及两个控制点 -> S 形 */
const S_CURVE = {
  p0: { x: 0.16, y: 0.86 }, // 起点：左下，对应关卡 1
  p1: { x: 0.16, y: 0.52 }, // 左中
  p2: { x: 0.84, y: 0.48 }, // 右中
  p3: { x: 0.84, y: 0.14 }, // 终点：右上，对应最后一关
}

/** 在 [0,1] 上等距取 count 个 t 值（含 0 和 1） */
function sampleT(count: number): number[] {
  if (count <= 1) return [0.5]
  const out: number[] = []
  for (let i = 0; i < count; i++) {
    out.push(i / (count - 1))
  }
  return out
}

export interface PathPoint {
  x: number // 0~1，相对容器宽度
  y: number // 0~1，相对容器高度
}

/**
 * 沿 S 形路径生成均匀等距的关卡节点位置（百分比）
 * @param levelCount 关卡数量（如 8）
 */
export function getLevelPathPoints(levelCount: number): PathPoint[] {
  const ts = sampleT(levelCount)
  return ts.map((t) => cubicBezier(t, S_CURVE.p0, S_CURVE.p1, S_CURVE.p2, S_CURVE.p3))
}
