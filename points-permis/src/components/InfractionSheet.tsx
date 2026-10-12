import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { classLabel, infractionKey, infractions, type Infraction } from '../data/infractions'
import type { OffenseInput } from '../lib/compute'
import { formatDate, type ISODate } from '../lib/dates'
import { Art } from './ui'

interface Props {
  open: boolean
  onClose: () => void
  onAdd: (o: Omit<OffenseInput, 'id'>) => void
  existing: OffenseInput[]
  minDate?: ISODate
  maxDate: ISODate
}

const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, ' ')
    .toLowerCase()

const GROUPS = [9, 6, 4, 3, 2, 1]

export function InfractionSheet({ open, onClose, onAdd, existing, minDate, maxDate }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Infraction | null>(null)
  const [date, setDate] = useState('')
  const [payment, setPayment] = useState('')
  const [groupWith, setGroupWith] = useState('')
  const ids = { title: useId(), search: useId(), date: useId(), pay: useId(), payHint: useId(), group: useId(), groupHint: useId() }

  useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    if (open && !d.open) {
      setQuery('')
      setSelected(null)
      setDate('')
      setPayment('')
      setGroupWith('')
      d.showModal()
    } else if (!open && d.open) d.close()
  }, [open])

  const filtered = useMemo(() => {
    const q = normalize(query.trim())
    const words = q.split(/\s+/).filter(Boolean)
    const list = words.length
      ? infractions.filter((i) => {
          const hay = normalize(`${i.title} ${i.art} ${i.pts} points`)
          return words.every((w) => hay.includes(w))
        })
      : infractions
    return GROUPS.map((pts) => ({ pts, items: list.filter((i) => i.pts === pts) })).filter((g) => g.items.length)
  }, [query])

  const count = filtered.reduce((n, g) => n + g.items.length, 0)
  const sameDay = date ? existing.filter((o) => o.date === date) : []
  const dateValid = !!date && (!minDate || date >= minDate)
  const paymentValid = !payment || payment >= date
  const canAdd = !!selected && dateValid && paymentValid

  const submit = () => {
    if (!selected || !canAdd) return
    const partner = sameDay.find((o) => o.id === groupWith)
    onAdd({
      infraction: selected,
      date,
      paymentDate: payment || null,
      groupId: partner ? partner.groupId || partner.id : null,
    })
  }

  return (
    <dialog
      ref={dialogRef}
      className="sheet"
      aria-labelledby={ids.title}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose()
      }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 pt-3 pb-3">
        <div aria-hidden="true" className="absolute top-1.5 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-line md:hidden" />
        <h2 id={ids.title} className="text-lg font-semibold">
          {selected ? "Détails de l'infraction" : 'Choisir une infraction'}
        </h2>
        <button type="button" className="btn btn-ghost px-3" onClick={onClose}>
          Fermer
        </button>
      </div>

      {!selected ? (
        <>
          <div className="border-b border-line px-4 py-3">
            <label htmlFor={ids.search} className="sr-only">
              Rechercher une infraction
            </label>
            <input
              id={ids.search}
              type="search"
              className="field"
              placeholder="Rechercher : feu rouge, vitesse, R412-30…"
              enterKeyHint="search"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <p className="mt-1.5 text-sm text-muted" aria-live="polite">
              {count} infraction{count > 1 ? 's' : ''}
            </p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4">
            {filtered.map((g) => (
              <section key={g.pts} aria-labelledby={`grp-${g.pts}`}>
                <h3
                  id={`grp-${g.pts}`}
                  className="sticky top-0 z-10 -mx-4 bg-surface px-4 pt-4 pb-2 text-sm font-bold tracking-wide text-muted uppercase"
                >
                  Retrait de <span className="num">{g.pts}</span> point{g.pts > 1 ? 's' : ''}
                </h3>
                <ul className="space-y-1.5">
                  {g.items.map((i) => (
                    <li key={infractionKey(i)}>
                      <button
                        type="button"
                        className="flex min-h-11 w-full items-center gap-3 rounded-xl border border-line px-3 py-2.5 text-left hover:bg-surface-2"
                        onClick={() => setSelected(i)}
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block">{i.title}</span>
                          <span className="block text-sm text-muted">
                            <Art>{i.art}</Art> · {classLabel(i.cls)}
                          </span>
                        </span>
                        <span className="num flex-none rounded-md px-2 py-0.5 font-medium text-loss" style={{ background: 'var(--loss-soft)' }}>
                          −{i.pts}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            {count === 0 && <p className="py-8 text-center text-muted">Aucune infraction ne correspond à « {query} ».</p>}
          </div>
          <div className="safe-bottom border-t border-line px-4 pt-3">
            <button type="button" className="btn btn-ghost w-full" onClick={onClose}>
              Annuler
            </button>
          </div>
        </>
      ) : (
        <>
          <form
            id="offense-form"
            className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4"
            onSubmit={(e) => {
              e.preventDefault()
              submit()
            }}
          >
            <div className="rounded-xl border border-line bg-surface-2 p-3">
              <p className="font-bold">{selected.title}</p>
              <p className="mt-0.5 text-sm text-muted">
                <Art>{selected.art}</Art> · {classLabel(selected.cls)} ·{' '}
                <span className="num text-loss">−{selected.pts}</span> point{selected.pts > 1 ? 's' : ''}
              </p>
            </div>

            <div>
              <label htmlFor={ids.date} className="mb-1.5 block font-bold">
                Date de l'infraction
              </label>
              <input
                id={ids.date}
                type="date"
                className="field"
                required
                value={date}
                min={minDate}
                max={maxDate}
                onChange={(e) => setDate(e.target.value)}
              />
              {date && minDate && date < minDate && (
                <p className="mt-1.5 text-sm text-warn">Cette date est antérieure à l'obtention du permis : l'infraction serait ignorée.</p>
              )}
            </div>

            <div>
              <label htmlFor={ids.pay} className="mb-1.5 block font-bold">
                Date de paiement ou de condamnation <span className="font-normal text-muted">(facultatif)</span>
              </label>
              <input
                id={ids.pay}
                type="date"
                className="field"
                value={payment}
                min={date || minDate}
                aria-describedby={ids.payHint}
                onChange={(e) => setPayment(e.target.value)}
              />
              <p id={ids.payHint} className="mt-1.5 text-sm text-muted">
                Les points sont retirés à cette date (<Art>L223-1</Art>). Sans réponse, on retient la date de l'infraction.
              </p>
              {!paymentValid && <p className="mt-1.5 text-sm text-loss">Le paiement ne peut pas précéder l'infraction.</p>}
            </div>

            {sameDay.length > 0 && (
              <div>
                <label htmlFor={ids.group} className="mb-1.5 block font-bold">
                  Commise au même lieu et à la même heure qu'une autre ?
                </label>
                <select
                  id={ids.group}
                  className="field"
                  value={groupWith}
                  aria-describedby={ids.groupHint}
                  onChange={(e) => setGroupWith(e.target.value)}
                >
                  <option value="">Non, infraction distincte</option>
                  {sameDay.map((o) => (
                    <option key={o.id} value={o.id}>
                      Oui, avec : {o.infraction.title} ({o.infraction.art})
                    </option>
                  ))}
                </select>
                <p id={ids.groupHint} className="mt-1.5 text-sm text-muted">
                  Des infractions simultanées ne retirent pas plus de 8 points au total (<Art>L223-2</Art>).
                </p>
              </div>
            )}
            {date && <p className="text-sm text-muted">Infraction du {formatDate(date)}.</p>}
          </form>
          <div className="safe-bottom flex gap-3 border-t border-line px-4 pt-3">
            <button type="button" className="btn btn-ghost flex-none" onClick={() => setSelected(null)}>
              Retour
            </button>
            <button type="submit" form="offense-form" className="btn btn-primary flex-1" disabled={!canAdd}>
              Ajouter
            </button>
          </div>
        </>
      )}
    </dialog>
  )
}
