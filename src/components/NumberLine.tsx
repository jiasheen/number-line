import { LINE_MAX, LINE_MIN, getTicks, toPercent } from '../lib/numberLine'
import './NumberLine.css'

interface NumberLineProps {
  position: number
  target: number
}

export function NumberLine({ position, target }: NumberLineProps) {
  return (
    <div
      className="number-line"
      role="img"
      aria-label={`Number line ${LINE_MIN} to ${LINE_MAX}. Marker on ${position}, target ${target}.`}
    >
      <div className="number-line__axis" />

      {getTicks().map((n) => (
        <div
          key={n}
          aria-hidden="true"
          className={`number-line__tick${n % 2 === 1 ? ' number-line__tick--odd' : ''}`}
          style={{ left: `${toPercent(n)}%` }}
        >
          <span className="number-line__mark" />
          <span className="number-line__label">{n}</span>
        </div>
      ))}

      <div
        className="number-line__token"
        style={{ left: `${toPercent(position)}%` }}
      />
    </div>
  )
}
