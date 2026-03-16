## Level map node positions

当前关卡选择页 1–10 号圆点的坐标（相对背景图容器，0~1 比例）记录如下，来源于 `src/store/gameStore.ts` 中的 `defaultLevelNodePositions`：

```ts
const defaultLevelNodePositions: Record<string, { x: number; y: number }> = {
  '1': { x: 0.72, y: 0.72 },
  '2': { x: 0.86, y: 0.512 },
  '3': { x: 0.147, y: 0.474 },
  '4': { x: 0.112, y: 0.409 },
  '5': { x: 0.176, y: 0.363 },
  '6': { x: 0.243, y: 0.323 },
  '7': { x: 0.273, y: 0.261 },
  '8': { x: 0.328, y: 0.209 },
  '9': { x: 0.287, y: 0.156 },
  '10': { x: 0.248, y: 0.88 },
}
```

坐标含义：

- `x`: 0 表示容器最左侧，1 表示最右侧
- `y`: 0 表示容器最上方，1 表示最下方

如果以后在 Cursor 里重新调整圆点位置，只要更新 `gameStore.ts` 中这段配置，并同步更新本文件，方便对比版本或恢复旧布局。

