import { useMemo, useState } from 'react';
import { buildHeatmap, levelOf, LEVEL_COUNT } from '../utils/heatmap';
import './ActivityHeatmap.css';

const DAYS = 30;

// Fluid columns, so the window always fits the card and nothing scrolls
// sideways. Written out because var() is not allowed inside repeat().
const ROW_TEMPLATE = {
  gridTemplateColumns: `var(--heat-label) repeat(${DAYS}, minmax(0, 1fr))`,
};

const shortDate = (key) => {
  const [, month, day] = key.split('-');
  return `${Number(month)}/${Number(day)}`;
};

const longDate = (key) => {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export default function ActivityHeatmap({ history, activities }) {
  const [tip, setTip] = useState(null);

  const { dayKeys, rows, max, combined, combinedMax, total } = useMemo(
    () => buildHeatmap({ history, activities, days: DAYS }),
    [history, activities]
  );

  // One label per day rather than one per cell: Intl formatting is not cheap,
  // and hovering a cell re-renders the whole grid.
  const dayLabels = useMemo(
    () => Object.fromEntries(dayKeys.map(key => [key, longDate(key)])),
    [dayKeys]
  );

  // The combined strip is just another row -- same markup, its own scale.
  const allRows = [
    { ...combined, label: 'All', max: combinedMax, modifier: 'heatmap__row--total' },
    ...rows.map(row => ({ ...row, label: row.name, max, modifier: '' })),
  ];

  const showTip = (event, row, cell) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const breakdown = Object.entries(cell.byIntensity)
      .map(([label, count]) => `${count} ${label}`)
      .join(' · ');

    setTip({
      effort: cell.effort,
      breakdown,
      name: row.name,
      date: dayLabels[cell.key],
      x: Math.min(Math.max(rect.left + rect.width / 2, 100), window.innerWidth - 100),
      y: rect.top,
    });
  };

  const hideTip = () => setTip(null);

  // one tick a week, each centred on its column
  const ticks = dayKeys
    .map((key, i) => ({ key, i }))
    .filter(({ i }) => i % 7 === 0);

  return (
    <section className='heatmap' aria-labelledby='heatmap-title'>
      <h2 className='heatmap__title' id='heatmap-title'>Effort by activity</h2>

      <p className='heatmap__caption'>
        {total} log{total === 1 ? '' : 's'} in the last {DAYS} days.
      </p>

      <div className='heatmap__grid' onMouseLeave={hideTip}>
        <div className='heatmap__row heatmap__row--axis' style={ROW_TEMPLATE}>
          <div className='heatmap__axis'>
            {ticks.map(({ key, i }) => (
              <span
                key={key}
                className='heatmap__tick'
                style={{ left: `${((i + 0.5) / dayKeys.length) * 100}%` }}
              >
                {shortDate(key)}
              </span>
            ))}
          </div>
        </div>

        {allRows.map(row => (
          <div className={`heatmap__row ${row.modifier}`} key={row.name} style={ROW_TEMPLATE}>
            <div className='heatmap__rowLabel' title={row.name}>{row.label}</div>
            {row.cells.map(cell => (
              <div
                key={cell.key}
                className='heatmap__cell'
                data-level={levelOf(cell.effort, row.max)}
                role='img'
                aria-label={`${row.name}, ${dayLabels[cell.key]}: ${cell.effort} effort`}
                tabIndex={cell.effort > 0 ? 0 : undefined}
                onMouseEnter={e => showTip(e, row, cell)}
                onFocus={e => showTip(e, row, cell)}
                onBlur={hideTip}
              />
            ))}
          </div>
        ))}
      </div>

      <div className='heatmap__legend'>
        <span className='heatmap__legendLabel'>Less</span>
        {Array.from({ length: LEVEL_COUNT + 1 }, (_, level) => (
          <span key={level} className='heatmap__swatch' data-level={level} />
        ))}
        <span className='heatmap__legendLabel'>More</span>
        {max > 0 && (
          <span className='heatmap__legendMax'>
            peak {max} per activity · {combinedMax} per day
          </span>
        )}
      </div>

      {tip && (
        <div
          className='heatmap__tip'
          role='status'
          style={{ left: `${tip.x}px`, top: `${tip.y}px` }}
        >
          <span className='heatmap__tipValue'>{tip.effort} effort</span>
          <span className='heatmap__tipMeta'>{tip.name}</span>
          <span className='heatmap__tipMeta'>{tip.date}</span>
          {tip.breakdown && <span className='heatmap__tipMeta'>{tip.breakdown}</span>}
        </div>
      )}
    </section>
  );
}
