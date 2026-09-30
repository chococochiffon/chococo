<script setup lang="ts">
import type { DailyPageViews } from '~/types/api'

// 日別の PV・UU の折れ線グラフ(biscuit の管理画面のアクセス解析と同じ見た目)。
// ポインターの位置(キーボードでは ←→)に近い日付に縦線を合わせ、その日の PV・UU をツールチップに出す。
// 同じ値は下の「表で見る」でも見られる
const props = defineProps<{ daily: DailyPageViews[], label: string }>()

const HEIGHT = 260
const MARGIN = { top: 16, right: 72, bottom: 28, left: 44 }

// 色は検証済みの 2 色(青・オレンジ。色覚の違いでも見分けられ、白い背景に 3:1 以上)
const SERIES = [
  { key: 'views', label: 'PV', color: '#2a78d6' },
  { key: 'unique_visitors', label: 'UU', color: '#eb6834' },
] as const

const plot = ref<HTMLElement | null>(null)
const tooltip = ref<HTMLElement | null>(null)
const width = ref(0)
const activeIndex = ref<number | null>(null)
const tooltipLeft = ref(0)

let observer: ResizeObserver | null = null

onMounted(() => {
  observer = new ResizeObserver(() => {
    width.value = plot.value?.clientWidth ?? 0
  })

  if (plot.value) {
    observer.observe(plot.value)
    width.value = plot.value.clientWidth
  }
})

onBeforeUnmount(() => observer?.disconnect())

const innerWidth = computed(() => Math.max(width.value - MARGIN.left - MARGIN.right, 1))
const innerHeight = HEIGHT - MARGIN.top - MARGIN.bottom

// 0 から最大値までを 4 つ前後に区切る、切りのよい目盛り(1・2・5 × 10 のべき乗の間隔)
const ticks = computed(() => {
  const max = Math.max(0, ...props.daily.map(day => day.views))

  if (max <= 0) {
    return [0, 1]
  }

  const rough = max / 4
  const power = 10 ** Math.floor(Math.log10(rough))
  const step = [1, 2, 5, 10].map(factor => factor * power).find(candidate => candidate >= rough) ?? rough
  const values: number[] = []

  for (let value = 0; value < max + step; value += step) {
    values.push(value)
  }

  return values
})

const yMax = computed(() => ticks.value[ticks.value.length - 1] ?? 1)

function x(index: number): number {
  const count = props.daily.length

  return MARGIN.left + (count <= 1 ? innerWidth.value / 2 : (index / (count - 1)) * innerWidth.value)
}

function y(value: number): number {
  return MARGIN.top + innerHeight - (value / yMax.value) * innerHeight
}

function formatDate(date: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('ja', { timeZone: 'UTC', ...options }).format(new Date(`${date}T00:00:00Z`))
}

const lines = computed(() => SERIES.map(series => ({
  ...series,
  points: props.daily.map((day, index) => `${x(index)},${y(day[series.key])}`).join(' '),
})))

// 横軸の日付(幅に収まる間隔で間引き、最後の日は必ず出す)
const xLabels = computed(() => {
  const count = props.daily.length
  const every = Math.max(1, Math.ceil(count / Math.max(1, Math.floor(innerWidth.value / 64))))

  return props.daily
    .map((day, index) => ({ index, text: formatDate(day.date, { month: 'numeric', day: 'numeric' }), isLast: index === count - 1 }))
    .filter(label => label.isLast || (count - 1 - label.index) % every === 0)
})

// 右端の直接ラベル(最後の日の値)。2 本のラベルが重なるときは上下に少しずらす
const endLabels = computed(() => {
  const last = props.daily[props.daily.length - 1]

  if (!last) {
    return []
  }

  const labels = SERIES.map(series => ({ key: series.key, text: `${series.label} ${last[series.key].toLocaleString()}`, y: y(last[series.key]) }))
  const [first, second] = labels

  if (first && second && Math.abs(first.y - second.y) < 16) {
    const [upper, lower] = first.y <= second.y ? [first, second] : [second, first]
    const middle = (upper.y + lower.y) / 2
    upper.y = middle - 8
    lower.y = middle + 8
  }

  return labels
})

const activeDay = computed(() => (activeIndex.value === null ? null : props.daily[activeIndex.value] ?? null))

async function show(index: number): Promise<void> {
  activeIndex.value = index
  await nextTick()

  // 縦線の横に出し、右端で切れるときは左側に出す
  const tooltipWidth = tooltip.value?.offsetWidth ?? 0
  const left = x(index) + 12
  tooltipLeft.value = left + tooltipWidth > width.value ? x(index) - 12 - tooltipWidth : left
}

function hide(): void {
  activeIndex.value = null
}

function onPointerMove(event: PointerEvent): void {
  const svg = event.currentTarget as SVGSVGElement
  const count = props.daily.length
  const ratio = count <= 1 ? 0 : (event.clientX - svg.getBoundingClientRect().left - MARGIN.left) / innerWidth.value
  show(Math.min(count - 1, Math.max(0, Math.round(ratio * (count - 1)))))
}

function onKeydown(event: KeyboardEvent): void {
  const moves: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1 }
  const move = moves[event.key]

  if (move !== undefined) {
    event.preventDefault()
    show(Math.min(props.daily.length - 1, Math.max(0, (activeIndex.value ?? props.daily.length - 1) + move)))
  }
  else if (event.key === 'Escape') {
    hide()
  }
}
</script>

<template>
  <div>
    <div class="d-flex justify-content-end gap-3 mb-2 small text-body-secondary" aria-hidden="true">
      <span v-for="series in SERIES" :key="series.key" class="d-inline-flex align-items-center gap-1">
        <span class="page-view-chart-key" :style="{ background: series.color }" />{{ series.label }}
      </span>
    </div>

    <div ref="plot" class="page-view-chart position-relative">
      <svg
        v-if="width > 0 && daily.length > 0"
        :width="width"
        :height="HEIGHT"
        :viewBox="`0 0 ${width} ${HEIGHT}`"
        class="page-view-chart-svg"
        role="img"
        :aria-label="label"
        tabindex="0"
        @pointermove="onPointerMove"
        @pointerleave="hide"
        @focus="show(activeIndex ?? daily.length - 1)"
        @blur="hide"
        @keydown="onKeydown"
      >
        <g v-for="tick in ticks" :key="tick">
          <line :x1="MARGIN.left" :x2="MARGIN.left + innerWidth" :y1="y(tick)" :y2="y(tick)" :class="tick === 0 ? 'chart-axis' : 'chart-grid'" />
          <text :x="MARGIN.left - 8" :y="y(tick)" class="chart-tick" text-anchor="end" dominant-baseline="middle">{{ tick.toLocaleString() }}</text>
        </g>
        <text
          v-for="xLabel in xLabels"
          :key="xLabel.index"
          :x="x(xLabel.index)"
          :y="HEIGHT - 8"
          class="chart-tick"
          :text-anchor="xLabel.isLast ? 'end' : 'middle'"
        >{{ xLabel.text }}</text>
        <polyline v-for="line in lines" :key="line.key" :points="line.points" fill="none" :stroke="line.color" class="chart-line" />
        <text
          v-for="endLabel in endLabels"
          :key="endLabel.key"
          :x="MARGIN.left + innerWidth + 8"
          :y="endLabel.y"
          class="chart-end-label"
          dominant-baseline="middle"
        >{{ endLabel.text }}</text>
        <template v-if="activeIndex !== null && activeDay">
          <line :x1="x(activeIndex)" :x2="x(activeIndex)" :y1="MARGIN.top" :y2="MARGIN.top + innerHeight" class="chart-crosshair" />
          <circle v-for="series in SERIES" :key="series.key" :cx="x(activeIndex)" :cy="y(activeDay[series.key])" r="4" :fill="series.color" class="chart-marker" />
        </template>
      </svg>

      <div v-show="activeDay" ref="tooltip" class="page-view-chart-tooltip" :style="{ left: `${tooltipLeft}px`, top: `${MARGIN.top}px` }">
        <template v-if="activeDay">
          <div class="page-view-chart-tooltip-title">{{ formatDate(activeDay.date, { month: 'numeric', day: 'numeric', weekday: 'short' }) }}</div>
          <div v-for="series in SERIES" :key="series.key" class="page-view-chart-tooltip-row">
            <span class="page-view-chart-key" :style="{ background: series.color }" />
            <strong>{{ activeDay[series.key].toLocaleString() }}</strong>
            <span class="text-body-secondary">{{ series.label }}</span>
          </div>
        </template>
      </div>
    </div>

    <details class="mt-2">
      <summary class="small text-body-secondary">表で見る</summary>

      <table class="table table-sm mb-0 mt-2 align-middle">
        <thead>
          <tr>
            <th>日付</th>
            <th class="text-end">PV</th>
            <th class="text-end">UU</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="day in [...daily].reverse()" :key="day.date">
            <td class="text-nowrap small">{{ formatDate(day.date, { month: '2-digit', day: '2-digit', weekday: 'short' }) }}</td>
            <td class="text-end text-nowrap small">{{ day.views.toLocaleString() }}</td>
            <td class="text-end text-nowrap small">{{ day.unique_visitors.toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </details>
  </div>
</template>

<style scoped lang="scss">
.page-view-chart {
  min-height: 260px;
}

.page-view-chart-svg {
  display: block;
  outline: none;
  touch-action: pan-y;

  &:focus-visible {
    outline: 2px solid var(--bs-primary);
    outline-offset: 2px;
    border-radius: 4px;
  }

  .chart-grid {
    stroke: #eef0f2;
    stroke-width: 1;
  }

  .chart-axis {
    stroke: #ced4da;
    stroke-width: 1;
  }

  .chart-tick {
    fill: var(--bs-secondary-color);
    font-size: 11px;
  }

  .chart-end-label {
    fill: var(--bs-body-color);
    font-size: 12px;
    font-weight: 600;
  }

  .chart-line {
    stroke-width: 2;
    stroke-linejoin: round;
    stroke-linecap: round;
  }

  .chart-crosshair {
    stroke: #adb5bd;
    stroke-width: 1;
  }

  // 重なった点の見分けがつくよう、背景色の縁取りを付ける
  .chart-marker {
    stroke: #fff;
    stroke-width: 2;
  }
}

.page-view-chart-tooltip {
  position: absolute;
  z-index: 1;
  min-width: 7rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--bs-border-color);
  border-radius: 0.375rem;
  background: #fff;
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.08);
  font-size: 0.8125rem;
  pointer-events: none;
}

.page-view-chart-tooltip-title {
  margin-bottom: 0.25rem;
  color: var(--bs-secondary-color);
}

.page-view-chart-tooltip-row {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.page-view-chart-key {
  display: inline-block;
  width: 14px;
  height: 2px;
  border-radius: 1px;
}
</style>
