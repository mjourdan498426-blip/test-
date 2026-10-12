import { useId, useState } from 'react'
import { classLabel } from '../data/infractions'
import type { OffenseInput, StageInput } from '../lib/compute'
import { formatDate, formatShort, type ISODate } from '../lib/dates'
import { InfractionSheet } from './InfractionSheet'
import { Art, SectionTitle } from './ui'

interface Props {
  offenses: OffenseInput[]
  stages: StageInput[]
  minDate?: ISODate
  maxDate: ISODate
  disabled: boolean
  onAddOffense: (o: Omit<OffenseInput, 'id'>) => void
  onRemoveOffense: (id: string) => void
  onAddStage: (date: ISODate) => void
  onRemoveStage: (id: string) => void
}

const byDate = <T extends { date: ISODate }>(a: T, b: T) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0)

export function OffensesSection(props: Props) {
  const { offenses, stages, minDate, maxDate, disabled } = props
  const [sheetOpen, setSheetOpen] = useState(false)
  const [stageDate, setStageDate] = useState('')
  const stageId = useId()
  const stageHint = useId()

  const sorted = [...offenses].sort(byDate)
  const groupSize = new Map<string, number>()
  for (const o of offenses) {
    const g = o.groupId || o.id
    groupSize.set(g, (groupSize.get(g) ?? 0) + 1)
  }

  return (
    <section aria-labelledby="infractions-title" className="card p-5 sm:p-6">
      <SectionTitle step={2} id="infractions-title">
        Mes infractions et stages
      </SectionTitle>
      {disabled && <p className="mt-3 text-muted">Renseignez d'abord la date d'obtention du permis.</p>}

      <h3 className="mt-5 font-semibold">
        Infractions <span className="num text-muted">({offenses.length})</span>
      </h3>
      {sorted.length === 0 ? (
        <p className="mt-2 text-muted">Aucune infraction saisie.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {sorted.map((o) => {
            const grouped = (groupSize.get(o.groupId || o.id) ?? 0) > 1
            return (
              <li key={o.id} className="flex items-start gap-3 rounded-xl border border-line p-3">
                <span className="num mt-0.5 flex-none rounded-md px-2 py-0.5 font-medium text-loss" style={{ background: 'var(--loss-soft)' }}>
                  −{o.infraction.pts}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{o.infraction.title}</p>
                  <p className="text-sm text-muted">
                    <Art>{o.infraction.art}</Art> · {classLabel(o.infraction.cls)}
                  </p>
                  <p className="mt-1 text-sm">
                    Le <span className="num">{formatShort(o.date)}</span>
                    {o.paymentDate && o.paymentDate !== o.date && (
                      <>
                        {' '}
                        · payée le <span className="num">{formatShort(o.paymentDate)}</span>
                      </>
                    )}
                  </p>
                  {grouped && <p className="mt-1 text-sm text-muted">Simultanée avec une autre infraction (plafond de 8 points).</p>}
                </div>
                <DeleteButton
                  label={`Supprimer : ${o.infraction.title}, le ${formatDate(o.date)}`}
                  onClick={() => props.onRemoveOffense(o.id)}
                />
              </li>
            )
          })}
        </ul>
      )}
      <button type="button" className="btn btn-primary mt-4 w-full" disabled={disabled} onClick={() => setSheetOpen(true)}>
        <span aria-hidden="true">+</span> Ajouter une infraction
      </button>

      <h3 className="mt-8 font-semibold">
        Stages de sensibilisation <span className="num text-muted">({stages.length})</span>
      </h3>
      {stages.length > 0 && (
        <ul className="mt-3 space-y-2">
          {[...stages].sort(byDate).map((s) => (
            <li key={s.id} className="flex items-center gap-3 rounded-xl border border-line p-3">
              <span className="num flex-none rounded-md px-2 py-0.5 font-medium text-gain" style={{ background: 'var(--gain-soft)' }}>
                +4
              </span>
              <p className="min-w-0 flex-1">
                Stage terminé le <span className="num">{formatShort(s.date)}</span>
              </p>
              <DeleteButton label={`Supprimer le stage du ${formatDate(s.date)}`} onClick={() => props.onRemoveStage(s.id)} />
            </li>
          ))}
        </ul>
      )}
      <form
        className="mt-3"
        onSubmit={(e) => {
          e.preventDefault()
          if (!stageDate) return
          props.onAddStage(stageDate)
          setStageDate('')
        }}
      >
        <label htmlFor={stageId} className="mb-1.5 block font-bold">
          Dernier jour du stage
        </label>
        <div className="flex gap-2">
          <input
            id={stageId}
            type="date"
            className="field min-w-0 flex-1"
            value={stageDate}
            min={minDate}
            aria-describedby={stageHint}
            disabled={disabled}
            onChange={(e) => setStageDate(e.target.value)}
          />
          <button type="submit" className="btn btn-ghost flex-none" disabled={disabled || !stageDate}>
            Ajouter
          </button>
        </div>
        <p id={stageHint} className="mt-1.5 text-sm text-muted">
          Jusqu'à 4 points rendus le lendemain, un stage par an au maximum (<Art>R223-8</Art>).
        </p>
      </form>

      <InfractionSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onAdd={(o) => {
          props.onAddOffense(o)
          setSheetOpen(false)
        }}
        existing={offenses}
        minDate={minDate}
        maxDate={maxDate}
      />
    </section>
  )
}

function DeleteButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="btn -my-1 -mr-1 flex-none p-0 text-muted hover:bg-surface-2 hover:text-loss" onClick={onClick} aria-label={label}>
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
      </svg>
    </button>
  )
}
