import { STATUS } from './ui'
import type { Status } from '../lib/compute'

interface Props {
  balance: number
  cap: number
  status: Status
  size?: 'lg' | 'sm'
}

const MAX = 12

/**
 * Jauge de 12 cases : points acquis (pleins), points récupérables jusqu'au
 * plafond actuel (pointillés), points pas encore accessibles en probatoire
 * (hachurés).
 */
export function Gauge({ balance, cap, status, size = 'lg' }: Props) {
  const recoverable = Math.max(0, cap - balance)
  const locked = Math.max(0, MAX - cap)
  const color = STATUS[status].color
  const label =
    `Solde : ${balance} points sur ${MAX}.` +
    (recoverable ? ` ${recoverable} point${recoverable > 1 ? 's' : ''} à récupérer.` : '') +
    (locked ? ` ${locked} point${locked > 1 ? 's' : ''} pas encore accessible${locked > 1 ? 's' : ''} (probatoire).` : '')

  return (
    <div role="img" aria-label={label} className={size === 'sm' ? 'w-28' : ''}>
      <div className="gauge" style={{ gap: size === 'sm' ? 2 : undefined }}>
        {Array.from({ length: MAX }, (_, i) => {
          const state = i < balance ? 'on' : i < cap ? 'recoverable' : 'locked'
          return (
            <span
              key={i}
              className="gauge-cell"
              data-state={state}
              style={{
                ['--cell-color' as string]: color,
                borderRadius: size === 'sm' ? 2 : undefined,
                borderWidth: size === 'sm' && state !== 'on' ? 1 : undefined,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

export function GaugeLegend({ balance, cap, status }: Omit<Props, 'size'>) {
  const recoverable = Math.max(0, cap - balance)
  const locked = Math.max(0, MAX - cap)
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
      <li className="flex items-center gap-2">
        <span className="legend-swatch" style={{ background: STATUS[status].color }} aria-hidden="true" />
        <span>
          <span className="num">{balance}</span> acquis
        </span>
      </li>
      {recoverable > 0 && (
        <li className="flex items-center gap-2">
          <span className="legend-swatch gauge-cell" data-state="recoverable" aria-hidden="true" />
          <span>
            <span className="num">{recoverable}</span> à récupérer
          </span>
        </li>
      )}
      {locked > 0 && (
        <li className="flex items-center gap-2">
          <span className="legend-swatch gauge-cell" data-state="locked" aria-hidden="true" />
          <span>
            <span className="num">{locked}</span> pas encore accessible{locked > 1 ? 's' : ''}
          </span>
        </li>
      )}
    </ul>
  )
}
