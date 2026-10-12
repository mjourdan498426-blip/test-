import { useId } from 'react'
import type { ProbationInfo } from '../lib/compute'
import { formatDate, type ISODate } from '../lib/dates'
import { SectionTitle } from './ui'

interface Props {
  obtention: ISODate | ''
  accompagnee: boolean
  formation: boolean
  asOf: ISODate
  isToday: boolean
  today: ISODate
  probation: ProbationInfo | null
  onChange: (patch: { obtention?: ISODate | ''; accompagnee?: boolean; formation?: boolean; asOf?: ISODate | null }) => void
}

function YesNo({ name, legend, hint, value, onChange }: { name: string; legend: string; hint?: string; value: boolean; onChange: (v: boolean) => void }) {
  const labelId = useId()
  const hintId = useId()
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <div className="min-w-0 flex-1 basis-48">
        <p id={labelId} className="font-bold">
          {legend}
        </p>
        {hint && (
          <p id={hintId} className="text-sm text-muted">
            {hint}
          </p>
        )}
      </div>
      <div className="segmented" role="radiogroup" aria-labelledby={labelId} aria-describedby={hint ? hintId : undefined}>
        <label>
          <input type="radio" name={name} checked={value} onChange={() => onChange(true)} />
          Oui
        </label>
        <label>
          <input type="radio" name={name} checked={!value} onChange={() => onChange(false)} />
          Non
        </label>
      </div>
    </div>
  )
}

export function ProfileSection({ obtention, accompagnee, formation, asOf, isToday, today, probation, onChange }: Props) {
  const ids = { d0: useId(), asOf: useId(), asOfHint: useId() }
  return (
    <section aria-labelledby="profil-title" className="card p-5 sm:p-6">
      <SectionTitle step={1} id="profil-title">
        Mon permis
      </SectionTitle>

      <div className="mt-5 space-y-5">
        <div>
          <label htmlFor={ids.d0} className="mb-1.5 block font-bold">
            Date d'obtention du permis
          </label>
          <input
            id={ids.d0}
            type="date"
            className="field"
            value={obtention}
            min="1950-01-01"
            max={today}
            onChange={(e) => onChange({ obtention: e.target.value })}
          />
        </div>

        <YesNo
          name="accompagnee"
          legend="Conduite accompagnée"
          hint="Apprentissage anticipé de la conduite (AAC)"
          value={accompagnee}
          onChange={(v) => onChange({ accompagnee: v })}
        />
        <YesNo
          name="formation"
          legend="Formation complémentaire"
          hint="Formation post-permis, entre 6 et 12 mois après l'obtention"
          value={formation}
          onChange={(v) => onChange({ formation: v })}
        />

        <div>
          <label htmlFor={ids.asOf} className="mb-1.5 block font-bold">
            Date de calcul
          </label>
          <div className="flex gap-2">
            <input
              id={ids.asOf}
              type="date"
              className="field min-w-0 flex-1"
              value={asOf}
              min={obtention || undefined}
              aria-describedby={ids.asOfHint}
              onChange={(e) => onChange({ asOf: e.target.value || null })}
            />
            {!isToday && (
              <button type="button" className="btn btn-ghost flex-none" onClick={() => onChange({ asOf: null })}>
                Aujourd'hui
              </button>
            )}
          </div>
          <p id={ids.asOfHint} className="mt-1.5 text-sm text-muted">
            Aujourd'hui par défaut. Choisissez une date future pour simuler l'évolution de votre solde.
          </p>
        </div>

        {probation && <ProbationCard probation={probation} />}
      </div>
    </section>
  )
}

function ProbationCard({ probation }: { probation: ProbationInfo }) {
  const { probatoire, end, path, activeAtAsOf, reducedByFormation, formationNote, regime } = probation
  const title = !probatoire
    ? 'Hors période probatoire'
    : activeAtAsOf
      ? `Permis probatoire jusqu'au ${formatDate(end!)}`
      : `Probatoire terminé le ${formatDate(end!)}`

  return (
    <div className="rounded-xl border border-line bg-surface-2 p-4" aria-live="polite">
      <p className="font-display font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted">
        {regime === 'avant-2004' && 'Permis obtenu avant le 1er mars 2004 : 12 points dès le départ.'}
        {regime === '2004-2007' && 'Permis obtenu entre 2004 et 2007 : 6 points fixes pendant le probatoire, puis 12 sans infraction.'}
        {regime === 'depuis-2008' &&
          `Points ajoutés à chaque anniversaire sans infraction${reducedByFormation ? ', probatoire raccourci par la formation complémentaire' : ''}.`}
      </p>
      <p className="mt-3 flex flex-wrap items-center gap-1.5" aria-label={`Chemin des points : ${path.join(', puis ')}`}>
        {path.map((p, i) => (
          <span key={i} className="flex items-center gap-1.5" aria-hidden="true">
            {i > 0 && <span className="text-muted">→</span>}
            <span className="num rounded-md border border-line bg-surface px-2 py-0.5 font-medium">{p}</span>
          </span>
        ))}
      </p>
      {formationNote && <p className="mt-3 text-sm text-warn">{formationNote}</p>}
    </div>
  )
}
