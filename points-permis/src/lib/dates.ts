/**
 * Dates « civiles » manipulées en UTC, au format ISO court (AAAA-MM-JJ).
 * Aucune dépendance : les ajouts de mois/années ramènent au dernier jour
 * du mois si nécessaire (31 janvier + 1 mois → 28 ou 29 février).
 */

export type ISODate = string

const DAY_MS = 86_400_000

export function isValidISODate(s: unknown): s is ISODate {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false
  const [y, m, d] = s.split('-').map(Number)
  return m >= 1 && m <= 12 && d >= 1 && d <= daysInMonth(y, m - 1)
}

function daysInMonth(year: number, month0: number): number {
  return new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate()
}

function toParts(d: ISODate): [number, number, number] {
  const [y, m, day] = d.split('-').map(Number)
  return [y, m - 1, day]
}

function fromUTC(ms: number): ISODate {
  return new Date(ms).toISOString().slice(0, 10)
}

export function toUTC(d: ISODate): number {
  const [y, m, day] = toParts(d)
  return Date.UTC(y, m, day)
}

export function addDays(d: ISODate, n: number): ISODate {
  return fromUTC(toUTC(d) + n * DAY_MS)
}

export function addMonths(d: ISODate, n: number): ISODate {
  const [y, m, day] = toParts(d)
  const total = y * 12 + m + n
  const ny = Math.floor(total / 12)
  const nm = total - ny * 12
  return fromUTC(Date.UTC(ny, nm, Math.min(day, daysInMonth(ny, nm))))
}

export function addYears(d: ISODate, n: number): ISODate {
  return addMonths(d, n * 12)
}

export function todayISO(now: Date = new Date()): ISODate {
  // Date locale de l'usager, exprimée comme date civile.
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]

/** « 1er mars 2004 », « 12 juin 2026 ». */
export function formatDate(d: ISODate): string {
  const [y, m, day] = toParts(d)
  return `${day === 1 ? '1er' : day} ${MONTHS[m]} ${y}`
}

/** « 01/03/2004 » — forme compacte. */
export function formatShort(d: ISODate): string {
  const [y, m, day] = toParts(d)
  return `${String(day).padStart(2, '0')}/${String(m + 1).padStart(2, '0')}/${y}`
}
