import { useMemo, useState } from 'react';
import { buildHeatmap, levelOf, LEVEL_COUNT } from '../utils/heatmap';
import './ActivityHeatmap.css';

const DAYS = 30;
const LEVELS = Array.from({ length: LEVEL_COUNT }, (_, i) => i + 1);

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

  const showTip = (event, row, cell) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const breakdown = Object.entries(cell.byIntensity)
      .map(([label, count]) => `${count} ${label}`)
      .join(' · ');

    setTip({
      effort: cell.effort,
      logs: cell.logs,
      breakdown,
      name: row.name,
      date: longDate(cell.key),
      x: Math.min(Math.max(rect.left + rect.width / 2, 100), window.innerWidth - 100),
      y: rect.top,
    });
  };

  const hideTip = () => setTip(null);

  // Written out rather than driving the count from a CSS var, so it is never
  // subject to var() substitution inside repeat()
  const rowTemplate = {
    gridTemplateColumns: `var(--heat-label) repeat(${dayKeys.length}, minmax(0, 1fr))`,
  };

  // Every 7th day gets a tick, plus the last day — unless it would crowd the
  // one before it, since the columns are only a few percent of the axis wide
  const last = dayKeys.length - 1;
  const ticks = dayKeys
    .map((key, i) => ({ key, i }))
    .filter(({ i }) => i % 7 === 0 || (i === last && last % 7 >= 4));

  return (
    <section className='heatmap' aria-labelledby='heatmap-title'>
      <div className='heatmap__head'>
        <h2 className='heatmap__title' id='heatmap-title'>Effort by activity</h2>
        {/* <span className='heatmap__range'>{DAYS} days</span> */}
      </div>

      <p className='heatmap__caption'>
        {total} log{total === 1 ? '' : 's'} in the last {DAYS} days.
        {/* {max > 0 && ' The top strip sums every activity; the rows below split it out.'} */}
      </p>

      <div className='heatmap__grid' onMouseLeave={hideTip}>
        <div className='heatmap__row heatmap__row--axis' style={rowTemplate}>
          <div className='heatmap__rowLabel heatmap__corner' />
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

        <div className='heatmap__row heatmap__row--total' style={rowTemplate}>
          <div className='heatmap__rowLabel heatmap__rowLabel--total'>All</div>
          {combined.cells.map(cell => (
            <div
              key={cell.key}
              className='heatmap__cell'
              data-level={levelOf(cell.effort, combinedMax)}
              role='img'
              aria-label={`All activities, ${longDate(cell.key)}: ${cell.effort} effort`}
              tabIndex={cell.effort > 0 ? 0 : undefined}
              onMouseEnter={e => showTip(e, combined, cell)}
              onFocus={e => showTip(e, combined, cell)}
              onBlur={hideTip}
            />
          ))}
        </div>

        {rows.map(row => (
          <div className='heatmap__row' key={row.name} style={rowTemplate}>
            <div className='heatmap__rowLabel' title={row.name}>{row.name}</div>
            {row.cells.map(cell => (
              <div
                key={cell.key}
                className='heatmap__cell'
                data-level={levelOf(cell.effort, max)}
                role='img'
                aria-label={`${row.name}, ${longDate(cell.key)}: ${cell.effort} effort`}
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
        <span className='heatmap__swatch' data-level='0' />
        {LEVELS.map(level => (
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
