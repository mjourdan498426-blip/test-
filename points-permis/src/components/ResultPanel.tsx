import type { ComputeError, NextStep, Result } from '../lib/compute'
import { formatDate, formatShort, type ISODate } from '../lib/dates'
import { Gauge, GaugeLegend } from './Gauge'
import { StatusPill } from './ui'

interface Props {
  result: Result | ComputeError | null
  asOf: ISODate
  isToday: boolean
}

const TONE: Record<NextStep['tone'], string> = {
  info: 'var(--accent)',
  positive: 'var(--gain)',
  warning: 'var(--warn)',
  danger: 'var(--loss)',
}

export function ResultPanel({ result, asOf, isToday }: Props) {
  const when = isToday ? "aujourd'hui" : `au ${formatDate(asOf)}`

  if (!result || 'error' in result) {
    return (
      <section aria-labelledby="result-title" className="card p-5 sm:p-6">
        <h2 id="result-title" className="text-lg font-semibold">
          Mon solde {when}
        </h2>
        <div className="mt-4 flex items-end gap-2" aria-hidden="true">
          <span className="num text-6xl leading-none text-muted">–</span>
          <span className="num pb-1 text-2xl text-muted">/ 12</span>
        </div>
        <div className="mt-4 opacity-60" aria-hidden="true">
          <div className="gauge">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} className="gauge-cell" data-state="empty" />
            ))}
          </div>
        </div>
        <p className="mt-4 text-muted">
          {result && 'error' in result
            ? result.error
            : "Indiquez la date d'obtention de votre permis pour voir votre solde."}
        </p>
      </section>
    )
  }

  const { balance, cap, status, probation, warnings, nextSteps, invalidation } = result

  return (
    <section aria-labelledby="result-title" className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="result-title" className="text-lg font-semibold">
          Mon solde {when}
        </h2>
        <StatusPill status={status} />
      </div>

      <p className="mt-3 flex items-end gap-2" aria-live="polite">
        <span className="num text-6xl leading-none font-medium sm:text-7xl">{balance}</span>
        <span className="num pb-1 text-2xl text-muted">/ 12</span>
        <span className="sr-only"> points</span>
      </p>
      {probation.activeAtAsOf && (
        <p className="mt-1 text-sm text-muted">
          Permis probatoire : plafond actuel de <span className="num">{cap}</span> points.
        </p>
      )}

      <div className="mt-4">
        <Gauge balance={balance} cap={cap} status={status} />
      </div>
      <div className="mt-3">
        <GaugeLegend balance={balance} cap={cap} status={status} />
      </div>

      {invalidation && (
        <div className="mt-5 rounded-xl border-2 p-4" style={{ borderColor: 'var(--loss)', background: 'var(--loss-soft)' }}>
          <h3 className="font-semibold text-loss">Permis invalidé le {formatDate(invalidation.date)}</h3>
          <p className="mt-1 text-sm">
            Le solde est tombé à 0 (<span className="font-mono">L223-5</span>, <span className="font-mono">R223-3</span>). La
            simulation s'arrête à cette date.
          </p>
        </div>
      )}

      {warnings.length > 0 && (
        <ul className="mt-5 space-y-2">
          {warnings.map((w) => (
            <li key={w} className="rounded-xl border p-3 text-sm" style={{ borderColor: 'var(--warn-border)', background: 'var(--warn-soft)' }}>
              <span className="font-bold text-warn">Attention : </span>
              {w}
            </li>
          ))}
        </ul>
      )}

      <h3 className="mt-6 text-base font-semibold">Prochaines étapes</h3>
      <ol className="mt-2 space-y-2.5">
        {nextSteps.map((s, i) => (
          <li key={i} className="flex gap-3 text-[0.95rem]">
            <span aria-hidden="true" className="mt-2 h-2 w-2 flex-none rounded-full" style={{ background: TONE[s.tone] }} />
            <span>
              {s.date && <span className="num mr-1.5 text-sm text-muted">{formatShort(s.date)}</span>}
              {s.text}
            </span>
          </li>
        ))}
      </ol>

      <p className="mt-6 border-t border-line pt-4 text-sm text-muted">
        Estimation indicative : le solde officiel est tenu par le ministère de l'Intérieur.
      </p>
    </section>
  )
}
