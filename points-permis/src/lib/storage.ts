/**
 * Sauvegarde locale des saisies (localStorage). Rien n'est envoyé ailleurs.
 * Toutes les lectures/écritures sont protégées : navigation privée, stockage
 * bloqué ou plein ne doivent jamais casser l'application.
 */

import type { Infraction, InfractionClass } from '../data/infractions'
import type { OffenseInput, StageInput } from './compute'
import { isValidISODate, type ISODate } from './dates'

export interface AppState {
  obtention: ISODate | ''
  accompagnee: boolean
  formation: boolean
  /** Date de calcul choisie ; `null` = aujourd'hui. */
  asOf: ISODate | null
  offenses: OffenseInput[]
  stages: StageInput[]
}

export const EMPTY_STATE: AppState = {
  obtention: '',
  accompagnee: false,
  formation: false,
  asOf: null,
  offenses: [],
  stages: [],
}

const KEY = 'mes-points-permis:v1'
export const THEME_KEY = 'mes-points-permis:theme'

const CLASSES: InfractionClass[] = ['D', 1, 2, 3, 4, 5]

function parseInfraction(v: unknown): Infraction | null {
  if (!v || typeof v !== 'object') return null
  const i = v as Record<string, unknown>
  if (typeof i.art !== 'string' || typeof i.title !== 'string') return null
  if (typeof i.pts !== 'number' || !Number.isFinite(i.pts) || i.pts < 0 || i.pts > 12) return null
  if (!CLASSES.includes(i.cls as InfractionClass)) return null
  return { art: i.art, title: i.title, pts: i.pts, cls: i.cls as InfractionClass }
}

function parseOffense(v: unknown): OffenseInput | null {
  if (!v || typeof v !== 'object') return null
  const o = v as Record<string, unknown>
  const infraction = parseInfraction(o.infraction)
  if (!infraction || typeof o.id !== 'string' || !isValidISODate(o.date)) return null
  return {
    id: o.id,
    infraction,
    date: o.date,
    paymentDate: isValidISODate(o.paymentDate) ? o.paymentDate : null,
    groupId: typeof o.groupId === 'string' ? o.groupId : null,
  }
}

function parseStage(v: unknown): StageInput | null {
  if (!v || typeof v !== 'object') return null
  const s = v as Record<string, unknown>
  if (typeof s.id !== 'string' || !isValidISODate(s.date)) return null
  return { id: s.id, date: s.date }
}

export function parseState(raw: unknown): AppState {
  if (!raw || typeof raw !== 'object') return EMPTY_STATE
  const r = raw as Record<string, unknown>
  return {
    obtention: isValidISODate(r.obtention) ? r.obtention : '',
    accompagnee: r.accompagnee === true,
    formation: r.formation === true,
    asOf: isValidISODate(r.asOf) ? r.asOf : null,
    offenses: Array.isArray(r.offenses) ? r.offenses.map(parseOffense).filter((o) => o !== null) : [],
    stages: Array.isArray(r.stages) ? r.stages.map(parseStage).filter((s) => s !== null) : [],
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? parseState(JSON.parse(raw)) : EMPTY_STATE
  } catch {
    return EMPTY_STATE
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* stockage indisponible : on continue sans sauvegarde */
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}

export function loadTheme(): 'light' | 'dark' | null {
  try {
    const t = localStorage.getItem(THEME_KEY)
    return t === 'light' || t === 'dark' ? t : null
  } catch {
    return null
  }
}

export function saveTheme(t: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_KEY, t)
  } catch {
    /* ignore */
  }
}

let counter = 0
export function newId(prefix: string): string {
  counter += 1
  return `${prefix}-${Date.now().toString(36)}-${counter.toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}
