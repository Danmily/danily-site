import { buildHeatmapGrid, type Entry } from '../lib/dailyLog'

const LEVEL_BG: Record<number, string> = {
  0: 'bg-paper-2',
  1: 'bg-blue/25',
  2: 'bg-blue/50',
  3: 'bg-blue/75',
  4: 'bg-blue',
}

export default function Heatmap({
  entries,
  selected,
  onSelect,
}: {
  entries: Entry[]
  selected: string | null
  onSelect: (date: string) => void
}) {
  const grid = buildHeatmapGrid(entries)

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1">
        {grid.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((cell, di) =>
              cell.date ? (
                <button
                  key={di}
                  title={`${cell.date} · ${cell.count} 条`}
                  onClick={() => onSelect(cell.date)}
                  className={`h-3.5 w-3.5 rounded-[3px] ${LEVEL_BG[cell.level]} transition-transform hover:scale-125 ${
                    selected === cell.date ? 'ring-2 ring-coral' : ''
                  }`}
                />
              ) : (
                <div key={di} className="h-3.5 w-3.5" />
              ),
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 font-mono text-[11px] text-ink-soft">
        <span>少</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <span key={l} className={`h-3 w-3 rounded-[3px] ${LEVEL_BG[l]}`} />
        ))}
        <span>多</span>
      </div>
    </div>
  )
}
