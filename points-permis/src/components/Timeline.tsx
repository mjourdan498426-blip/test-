import type { EventKind, Result } from '../lib/compute'
import { formatShort } from '../lib/dates'
import { Chevron, Refs, SectionTitle, signed } from './ui'

const DOT: Partial<Record<EventKind, string>> = {
  retrait: 'var(--loss)',
  invalidation: 'var(--loss)',
  'majoration-refusee': 'var(--warn)',
  'stage-sans-effet': 'var(--warn)',
}

function deltaStyle(delta: number) {
  if (delta > 0) return { color: 'var(--gain)', background: 'var(--gain-soft)' }
  if (delta < 0) return { color: 'var(--loss)', background: 'var(--loss-soft)' }
  return { color: 'var(--muted)', background: 'var(--surface-2)' }
}

export function Timeline({ result }: { result: Result | null }) {
  const events = result?.events ?? []
  const firstFuture = events.findIndex((e) => e.future)

  return (
    <section aria-labelledby="chrono-title" className="card p-5 sm:p-6">
      <SectionTitle step={3} id="chrono-title">
        Chronologie
      </SectionTitle>
      {events.length === 0 ? (
        <p className="mt-3 text-muted">La chronologie apparaîtra ici une fois la date d'obtention renseignée.</p>
      ) : (
        <>
          <p className="mt-2 text-sm text-muted">
            Trait plein : événements passés. Pointillés : événements prévus, si aucune nouvelle infraction n'est commise.
            Touchez un événement pour lire l'explication.
          </p>
          <ol className="mt-5">
            {events.map((e, i) => (
              <li
                key={e.id}
                className="tl-item pb-4"
                data-future={e.future}
                style={{ ['--dot' as string]: DOT[e.kind] ?? (e.delta > 0 ? 'var(--gain)' : 'var(--accent)') }}
              >
                {i === firstFuture && (
                  <p className="-ml-7 mb-3 flex items-center gap-2 text-sm font-bold text-muted">
                    <span aria-hidden="true" className="h-px flex-1 bg-line" />
                    Date de calcul
                    <span aria-hidden="true" className="h-px flex-1 bg-line" />
                  </p>
                )}
                <span className="tl-dot" aria-hidden="true" />
                <details className="group">
                  <summary className="-mt-1 flex min-h-11 items-start gap-3 rounded-lg py-1">
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                        <time dateTime={e.date} className="num text-muted">
                          {formatShort(e.date)}
                        </time>
                        {e.future && (
                          <span className="rounded-full border border-dashed border-line-strong px-2 text-xs font-bold text-muted">prévu</span>
                        )}
                      </span>
                      <span className="mt-0.5 block font-bold">{e.title}</span>
                      {e.alert && <span className="mt-1 block text-sm font-bold text-warn">Stage obligatoire</span>}
                    </span>
                    <span className="flex flex-none flex-col items-end gap-1">
                      <span className="num rounded-md px-2 py-0.5 font-medium" style={deltaStyle(e.delta)}>
                        {signed(e.delta)}
                      </span>
                      <span className="num text-sm text-muted" aria-label={`Solde après : ${e.balanceAfter} sur 12`}>
                        {e.balanceAfter}/12
                      </span>
                    </span>
                    <span className="mt-1 text-muted">
                      <Chevron />
                    </span>
                  </summary>
                  <div className="mt-1 space-y-1.5 pb-1">
                    <p className="text-[0.95rem]">{e.explanation}</p>
                    {e.alert && (
                      <p className="rounded-lg border p-2.5 text-sm" style={{ borderColor: 'var(--warn-border)', background: 'var(--warn-soft)' }}>
                        {e.alert}
                      </p>
                    )}
                    <Refs refs={e.refs} />
                  </div>
                </details>
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  )
}
