/**
 * Calcul du solde de points du permis de conduire français.
 *
 * Fonction pure, sans dépendance à React : `compute(profile, offenses, stages)`
 * simule chronologiquement tous les événements (obtention, majorations, fin du
 * probatoire, retraits, récupérations, stages) et renvoie le solde à la date de
 * calcul, la chronologie expliquée et les prochaines étapes.
 */

import type { Infraction } from '../data/infractions'
import { addDays, addMonths, addYears, formatDate, type ISODate } from './dates'

/* ------------------------------------------------------------------------ */
/* Constantes réglementaires                                                 */
/* ------------------------------------------------------------------------ */

/** Début du permis probatoire — date confirmée par la Sécurité routière. */
export const PROBATION_START: ISODate = '2004-03-01'

/**
 * Début des majorations annuelles (+2 / +3 points par an) pendant le probatoire.
 * À confirmer sur Légifrance : cette date provient d'une source non officielle.
 */
export const ANNUAL_INCREASE_START: ISODate = '2008-01-01'

export const MAX_POINTS = 12
export const PROBATION_POINTS = 6
/** Plafond des retraits pour des infractions commises simultanément — même lieu, même heure (L223-2). */
export const SIMULTANEOUS_CAP = 8
/** Points maximum rendus par un stage de sensibilisation (R223-8). */
export const STAGE_POINTS = 4

/* ------------------------------------------------------------------------ */
/* Types                                                                     */
/* ------------------------------------------------------------------------ */

export interface Profile {
  /** Date d'obtention du permis (AAAA-MM-JJ). */
  obtention: ISODate
  /** Apprentissage anticipé de la conduite (conduite accompagnée). */
  accompagnee: boolean
  /** Formation complémentaire post-permis suivie. */
  formation: boolean
  /** Date à laquelle on calcule le solde. */
  asOf: ISODate
}

export interface OffenseInput {
  id: string
  infraction: Infraction
  /** Date de l'infraction (commission). */
  date: ISODate
  /** Date de paiement de l'amende ou de condamnation définitive. Par défaut : date de l'infraction. */
  paymentDate?: ISODate | null
  /**
   * Groupe d'infractions commises simultanément (même lieu, même heure).
   * Les infractions partageant le même `groupId` voient leurs retraits
   * cumulés dans la limite de 8 points (L223-2). Par défaut : `id`.
   */
  groupId?: string | null
}

export interface StageInput {
  id: string
  /** Dernier jour du stage de sensibilisation. */
  date: ISODate
}

export type Regime = 'avant-2004' | '2004-2007' | 'depuis-2008'

export type EventKind =
  | 'obtention'
  | 'majoration'
  | 'majoration-refusee'
  | 'fin-probatoire'
  | 'retrait'
  | 'recuperation-1pt'
  | 'reconstitution'
  | 'recuperation-10ans'
  | 'stage'
  | 'stage-sans-effet'
  | 'invalidation'

export interface TimelineEvent {
  id: string
  date: ISODate
  kind: EventKind
  /** Variation du solde (négative pour un retrait). */
  delta: number
  balanceAfter: number
  capAfter: number
  title: string
  explanation: string
  refs: string[]
  /** Événement postérieur à la date de calcul (« prévu »). */
  future: boolean
  /** Alerte à mettre en avant (stage obligatoire en probatoire…). */
  alert?: string
}

export interface ProbationInfo {
  regime: Regime
  probatoire: boolean
  start: ISODate
  /** Fin du probatoire (le plafond passe à 12). `null` sans probatoire. */
  end: ISODate | null
  /** Chemin théorique des points sans infraction, ex. [6, 8, 10, 12]. */
  path: number[]
  /** Probatoire réduit grâce à la formation complémentaire. */
  reducedByFormation: boolean
  /** Raison pour laquelle la formation n'a pas d'effet, le cas échéant. */
  formationNote?: string
  /** En probatoire à la date de calcul. */
  activeAtAsOf: boolean
}

export type Status = 'complet' | 'correct' | 'bas' | 'critique' | 'invalide'

export interface InvalidationInfo {
  date: ISODate
  /** Nouveau permis au plus tôt (6 mois après). */
  earliestNewLicence: ISODate
  /** Nouveau permis au plus tôt en cas de nouvelle perte totale sous 5 ans (1 an). */
  earliestNewLicenceIfRepeat: ISODate
}

export interface NextStep {
  date?: ISODate
  text: string
  tone: 'info' | 'positive' | 'warning' | 'danger'
}

export interface Result {
  balance: number
  cap: number
  status: Status
  probation: ProbationInfo
  /** Chronologie complète, passée et future. */
  events: TimelineEvent[]
  warnings: string[]
  invalidation: InvalidationInfo | null
  nextSteps: NextStep[]
}

export interface ComputeError {
  error: string
}

/* ------------------------------------------------------------------------ */
/* Probatoire                                                                */
/* ------------------------------------------------------------------------ */

function regimeOf(d0: ISODate): Regime {
  if (d0 < PROBATION_START) return 'avant-2004'
  if (d0 < ANNUAL_INCREASE_START) return '2004-2007'
  return 'depuis-2008'
}

export function probationInfo(profile: Profile, offenseDates: ISODate[] = []): ProbationInfo {
  const d0 = profile.obtention
  const regime = regimeOf(d0)
  const base = { regime, start: d0 }

  if (regime === 'avant-2004') {
    return {
      ...base,
      probatoire: false,
      end: null,
      path: [MAX_POINTS],
      reducedByFormation: false,
      formationNote: profile.formation ? "La formation complémentaire ne concerne pas les permis obtenus avant 2004." : undefined,
      activeAtAsOf: false,
    }
  }

  const fullEnd = addYears(d0, profile.accompagnee ? 2 : 3)

  if (regime === '2004-2007') {
    return {
      ...base,
      probatoire: true,
      end: fullEnd,
      path: [PROBATION_POINTS, MAX_POINTS],
      reducedByFormation: false,
      formationNote: profile.formation
        ? 'La formation complémentaire ne réduit le probatoire que pour les permis obtenus depuis 2008.'
        : undefined,
      activeAtAsOf: profile.asOf < fullEnd,
    }
  }

  let end = fullEnd
  let reducedByFormation = false
  let formationNote: string | undefined
  if (profile.formation) {
    const reducedEnd = profile.accompagnee ? addMonths(d0, 18) : addYears(d0, 2)
    const offenseBeforeEnd = offenseDates.some((d) => d >= d0 && d < reducedEnd)
    if (offenseBeforeEnd) {
      formationNote =
        "La formation complémentaire ne réduit pas le probatoire : une infraction a été commise pendant cette période."
    } else {
      end = reducedEnd
      reducedByFormation = true
    }
  }

  const step = profile.accompagnee ? 3 : 2
  const path = [PROBATION_POINTS]
  for (let k = 1; addYears(d0, k) < end; k++) path.push(path[path.length - 1] + step)
  path.push(MAX_POINTS)

  return {
    ...base,
    probatoire: true,
    end,
    path,
    reducedByFormation,
    formationNote,
    activeAtAsOf: profile.asOf < end,
  }
}

/* ------------------------------------------------------------------------ */
/* Calcul principal                                                          */
/* ------------------------------------------------------------------------ */

interface Candidate {
  date: ISODate
  order: number
  seq: number
  run: () => void
}

interface OffenseState {
  o: OffenseInput
  pay: ISODate
  /** Points retirés après plafond des infractions simultanées. */
  effective: number
  /** Points réellement retirés (le solde ne descend pas sous 0). */
  removed: number
  applied: boolean
  restored: boolean
}

const isHeavy = (o: OffenseInput) => o.infraction.cls === 'D' || o.infraction.cls === 4 || o.infraction.cls === 5

const pts = (n: number) => `${n} point${Math.abs(n) > 1 ? 's' : ''}`

export function statusOf(balance: number, cap: number, invalidated: boolean): Status {
  if (invalidated || balance <= 0) return 'invalide'
  if (balance >= cap) return 'complet'
  if (balance >= 7) return 'correct'
  if (balance >= 4) return 'bas'
  return 'critique'
}

export function compute(
  profile: Profile,
  offenses: OffenseInput[],
  stages: StageInput[],
): Result | ComputeError {
  const d0 = profile.obtention
  const asOf = profile.asOf
  if (asOf < d0) return { error: "La date de calcul doit être postérieure à la date d'obtention du permis." }

  const warnings: string[] = []

  // Infractions antérieures au permis : ignorées.
  const valid: OffenseInput[] = []
  for (const o of offenses) {
    if (o.date < d0) {
      warnings.push(
        `L'infraction du ${formatDate(o.date)} (${o.infraction.art}) est antérieure à l'obtention du permis : elle est ignorée.`,
      )
    } else valid.push(o)
  }

  const probation = probationInfo(profile, valid.map((o) => o.date))
  const end = probation.end
  const inProbation = (d: ISODate) => end !== null && d < end
  const hasOffenseBefore = (d: ISODate) => valid.some((o) => o.date < d)

  // Plafond de 8 points pour des infractions commises simultanément, c'est-à-dire
  // au même lieu et à la même heure (L223-2), attribué dans l'ordre de saisie.
  // Un retrait isolé supérieur à 8 (L235-1, 9 points) n'est pas réduit : le
  // plafond du groupe vaut 8 ou, s'il est plus grand, le retrait le plus lourd.
  const groupOf = (o: OffenseInput) => o.groupId || o.id
  const groupCap = new Map<string, number>()
  for (const o of valid) {
    const g = groupOf(o)
    groupCap.set(g, Math.max(groupCap.get(g) ?? SIMULTANEOUS_CAP, o.infraction.pts))
  }
  const usedByGroup = new Map<string, number>()
  const states: OffenseState[] = valid.map((o) => {
    const g = groupOf(o)
    const used = usedByGroup.get(g) ?? 0
    const effective = Math.max(0, Math.min(o.infraction.pts, groupCap.get(g)! - used))
    usedByGroup.set(g, used + effective)
    const pay = o.paymentDate && o.paymentDate >= o.date ? o.paymentDate : o.date
    return { o, pay, effective, removed: 0, applied: false, restored: false }
  })

  // --- État de la simulation ---
  let balance = 0
  let cap = 0
  let invalidated: InvalidationInfo | null = null
  const events: TimelineEvent[] = []
  const candidates: Candidate[] = []
  let seq = 0
  const schedule = (date: ISODate, order: number, run: () => void) =>
    candidates.push({ date, order, seq: seq++, run })

  const push = (e: Omit<TimelineEvent, 'id' | 'balanceAfter' | 'capAfter' | 'future'>) => {
    events.push({
      ...e,
      id: `${e.date}-${e.kind}-${events.length}`,
      balanceAfter: balance,
      capAfter: cap,
      future: e.date > asOf,
    })
  }

  // 1. Obtention
  schedule(d0, 0, () => {
    if (probation.regime === 'avant-2004') {
      balance = cap = MAX_POINTS
      push({
        date: d0,
        kind: 'obtention',
        delta: MAX_POINTS,
        title: 'Obtention du permis',
        explanation:
          'Permis obtenu avant le 1er mars 2004 : pas de période probatoire, le capital est de 12 points dès le départ.',
        refs: ['L223-1'],
      })
    } else {
      balance = cap = PROBATION_POINTS
      const fin = end ? formatDate(end) : ''
      push({
        date: d0,
        kind: 'obtention',
        delta: PROBATION_POINTS,
        title: 'Obtention du permis probatoire',
        explanation:
          probation.regime === '2004-2007'
            ? `Permis probatoire : 6 points au départ, sans majoration annuelle. Le capital passera à 12 points le ${fin} s'il n'y a aucune infraction.`
            : `Permis probatoire : 6 points au départ, puis +${profile.accompagnee ? 3 : 2} points à chaque anniversaire sans infraction, jusqu'à 12 points le ${fin}.`,
        refs: ['L223-1', 'R223-1'],
      })
    }
  })

  // 2. Majorations annuelles (permis depuis 2008)
  if (probation.regime === 'depuis-2008' && end) {
    const step = profile.accompagnee ? 3 : 2
    let blockedAnnounced = false
    for (let k = 1; addYears(d0, k) < end; k++) {
      const date = addYears(d0, k)
      schedule(date, 1, () => {
        if (hasOffenseBefore(date)) {
          if (blockedAnnounced) return
          blockedAnnounced = true
          push({
            date,
            kind: 'majoration-refusee',
            delta: 0,
            title: 'Pas de majoration annuelle',
            explanation: `Une infraction a été commise depuis l'obtention du permis : la majoration de ${pts(step)} n'est pas accordée, ni les suivantes. Le plafond reste à ${cap} points jusqu'à la fin du probatoire.`,
            refs: ['R223-1'],
          })
          return
        }
        balance += step
        cap += step
        push({
          date,
          kind: 'majoration',
          delta: step,
          title: `${k}${k === 1 ? 're' : 'e'} année sans infraction`,
          explanation: `Aucune infraction depuis l'obtention : ${pts(step)} sont ajoutés${profile.accompagnee ? ' (conduite accompagnée)' : ''}.`,
          refs: ['R223-1'],
        })
      })
    }
  }

  // 3. Fin du probatoire
  if (end) {
    schedule(end, 2, () => {
      cap = MAX_POINTS
      const clean = !hasOffenseBefore(end)
      const before = balance
      if (clean) balance = MAX_POINTS
      push({
        date: end,
        kind: 'fin-probatoire',
        delta: balance - before,
        title: 'Fin du permis probatoire',
        explanation: clean
          ? `Aucune infraction pendant le probatoire${probation.reducedByFormation ? ' (raccourci grâce à la formation complémentaire)' : ''} : le capital passe à 12 points.`
          : `Le plafond passe à 12 points. Comme une infraction a été commise, le solde reste à ${pts(balance)} : les points manquants reviendront par les voies de récupération.`,
        refs: ['L223-1', 'R223-1'],
      })
    })
  }

  // 4. Retraits, à la date de paiement ou de condamnation
  for (const s of states) {
    const { infraction } = s.o
    schedule(s.pay, 7, () => {
      s.removed = Math.min(s.effective, balance)
      s.applied = true
      balance -= s.removed
      const capped = s.effective < infraction.pts
      const floored = s.removed < s.effective
      let explanation = `${infraction.title} (infraction du ${formatDate(s.o.date)}). Le retrait de ${pts(infraction.pts)} s'applique à la date du paiement de l'amende ou de la condamnation.`
      if (capped)
        explanation += ` Plusieurs infractions commises en même temps et au même lieu : leur total est plafonné à ${groupCap.get(groupOf(s.o))} points, il n'en reste ${s.effective === 0 ? 'aucun' : pts(s.effective)} pour celle-ci.`
      if (floored) explanation += ' Le solde ne peut pas descendre sous 0.'
      const refs = [infraction.art, 'L223-1']
      if (capped) refs.push('L223-2')
      const alert =
        inProbation(s.pay) && s.removed >= 3
          ? "Retrait d'au moins 3 points en probatoire : stage de sensibilisation obligatoire, qui remplace l'amende (L223-6)."
          : undefined
      push({
        date: s.pay,
        kind: 'retrait',
        delta: -s.removed,
        title: `Retrait : ${infraction.title}`,
        explanation,
        refs,
        alert,
      })
      if (balance <= 0 && !invalidated) {
        invalidated = {
          date: s.pay,
          earliestNewLicence: addMonths(s.pay, 6),
          earliestNewLicenceIfRepeat: addYears(s.pay, 1),
        }
        push({
          date: s.pay,
          kind: 'invalidation',
          delta: 0,
          title: 'Permis invalidé',
          explanation:
            'Le solde est à 0 : le permis perd sa validité. Il faut le remettre au préfet. Un nouveau permis peut être passé au plus tôt 6 mois après (1 an en cas de nouvelle perte totale en moins de 5 ans), après un examen médical et psychotechnique.',
          refs: ['L223-5', 'R223-3'],
        })
      }
    })
  }

  // 5. Récupération d'un point au bout de 6 mois
  for (const s of states) {
    if (s.effective !== 1) continue
    const date = addMonths(s.pay, 6)
    const blocked = valid.some((o) => o !== s.o && o.date > s.pay && o.date <= date)
    if (blocked) continue
    schedule(date, 4, () => {
      if (s.restored || s.removed !== 1) return
      s.restored = true
      const before = balance
      balance = Math.min(cap, balance + 1)
      push({
        date,
        kind: 'recuperation-1pt',
        delta: balance - before,
        title: 'Récupération du point retiré',
        explanation: `L'infraction du ${formatDate(s.o.date)} ne retirait qu'un point et aucune nouvelle infraction n'a été commise dans les 6 mois suivant le paiement : le point est rendu.`,
        refs: ['L223-6'],
      })
    })
  }

  // 6. Reconstitution à 12 points (2 ou 3 ans sans nouvelle infraction)
  const sorted = [...states].sort((a, b) => (a.o.date < b.o.date ? -1 : a.o.date > b.o.date ? 1 : 0))
  const reconstitutionDate = (chain: OffenseState[]) => {
    const lastPay = chain.reduce((m, s) => (s.pay > m ? s.pay : m), chain[0].pay)
    const years = chain.some((s) => isHeavy(s.o)) ? 3 : 2
    let t = addDays(addYears(lastPay, years), 1)
    if (end && end > t) t = end
    return { t, years, lastPay }
  }
  const scheduleReconstitution = (chain: OffenseState[]) => {
    const { t, years, lastPay } = reconstitutionDate(chain)
    schedule(t, 3, () => {
      const allRestored = chain.every((s) => s.restored)
      for (const s of chain) s.restored = true
      if (allRestored || balance >= cap) return
      const before = balance
      balance = cap
      const heavy = years === 3
      push({
        date: t,
        kind: 'reconstitution',
        delta: balance - before,
        title: 'Reconstitution du capital',
        explanation: `Aucune nouvelle infraction pendant ${years} ans après le dernier paiement (le ${formatDate(lastPay)})${heavy ? ", délai porté à 3 ans car l'une des infractions est un délit ou une contravention de 4e ou 5e classe" : ''} : le capital revient à ${cap} points.`,
        refs: ['L223-6'],
      })
    })
  }
  let chain: OffenseState[] = []
  for (const s of sorted) {
    if (chain.length && s.o.date >= reconstitutionDate(chain).t) {
      scheduleReconstitution(chain)
      chain = []
    }
    chain.push(s)
  }
  if (chain.length) scheduleReconstitution(chain)

  // 7. Règle des 10 ans (contraventions de classe 1 à 4)
  for (const s of states) {
    const cls = s.o.infraction.cls
    if (cls === 'D' || cls === 5) continue
    const date = addYears(s.pay, 10)
    schedule(date, 5, () => {
      if (s.restored || s.removed === 0) return
      s.restored = true
      const before = balance
      balance = Math.min(cap, balance + s.removed)
      push({
        date,
        kind: 'recuperation-10ans',
        delta: balance - before,
        title: 'Récupération au bout de 10 ans',
        explanation: `Les ${pts(s.removed)} de la contravention du ${formatDate(s.o.date)} sont rendus 10 ans après le paiement, même si d'autres infractions ont suivi.`,
        refs: ['L223-6'],
      })
    })
  }

  // 8. Stages de sensibilisation : +4 points max le lendemain, un par an
  const sortedStages = [...stages].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
  let lastValidStage: ISODate | null = null
  for (const st of sortedStages) {
    if (st.date < d0) {
      warnings.push(`Le stage du ${formatDate(st.date)} est antérieur à l'obtention du permis : il est ignoré.`)
      continue
    }
    const effectiveDate = addDays(st.date, 1)
    const tooSoon = lastValidStage !== null && st.date < addYears(lastValidStage, 1)
    const previous = lastValidStage
    if (!tooSoon) lastValidStage = st.date
    schedule(effectiveDate, 6, () => {
      if (tooSoon) {
        push({
          date: effectiveDate,
          kind: 'stage-sans-effet',
          delta: 0,
          title: 'Stage sans effet',
          explanation: `Un seul stage par an permet de récupérer des points. Le précédent date du ${formatDate(previous!)} : celui-ci ne rend aucun point.`,
          refs: ['L223-6', 'R223-8'],
        })
        return
      }
      const before = balance
      balance = Math.min(cap, balance + STAGE_POINTS)
      const gained = balance - before
      push({
        date: effectiveDate,
        kind: 'stage',
        delta: gained,
        title: 'Stage de sensibilisation',
        explanation:
          gained === STAGE_POINTS
            ? `Stage terminé le ${formatDate(st.date)} : 4 points sont rendus le lendemain.`
            : `Stage terminé le ${formatDate(st.date)} : jusqu'à 4 points, mais sans dépasser le plafond de ${cap} points${gained === 0 ? ' — déjà atteint' : ''}. ${gained === 0 ? 'Aucun point rendu.' : `${pts(gained)} rendu${gained > 1 ? 's' : ''}.`}`,
        refs: ['L223-6', 'R223-8'],
      })
    })
  }

  // --- Exécution chronologique ---
  candidates.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.order - b.order || a.seq - b.seq))
  let snapshot: { balance: number; cap: number; invalidated: boolean } | null = null
  for (const c of candidates) {
    if (c.date > asOf && !snapshot) snapshot = { balance, cap, invalidated: invalidated !== null }
    c.run()
    if (invalidated) break
  }
  if (!snapshot) snapshot = { balance, cap, invalidated: invalidated !== null }

  const invalidationInfo = invalidated as InvalidationInfo | null
  const invalidAtAsOf = snapshot.invalidated
  if (invalidationInfo) {
    const later = candidates.filter((c) => c.date > invalidationInfo.date && c.order === 7).length
    if (later > 0)
      warnings.push(
        `La simulation s'arrête à l'invalidation du ${formatDate(invalidationInfo.date)} : ${later} infraction${later > 1 ? 's' : ''} postérieure${later > 1 ? 's' : ''} n'${later > 1 ? 'ont' : 'a'} pas été prise${later > 1 ? 's' : ''} en compte.`,
      )
  }

  const status = statusOf(snapshot.balance, snapshot.cap, invalidAtAsOf)
  return {
    balance: snapshot.balance,
    cap: snapshot.cap,
    status,
    probation,
    events,
    warnings,
    invalidation: invalidAtAsOf ? invalidationInfo : null,
    nextSteps: nextSteps(profile, probation, events, snapshot, invalidAtAsOf ? invalidationInfo : null, lastValidStageBefore(sortedStages, asOf, d0)),
  }
}

function lastValidStageBefore(stages: StageInput[], asOf: ISODate, d0: ISODate): ISODate | null {
  let last: ISODate | null = null
  for (const st of stages) {
    if (st.date < d0 || st.date > asOf) continue
    if (last === null || st.date >= addYears(last, 1)) last = st.date
  }
  return last
}

function nextSteps(
  profile: Profile,
  probation: ProbationInfo,
  events: TimelineEvent[],
  snap: { balance: number; cap: number },
  invalidation: InvalidationInfo | null,
  lastStage: ISODate | null,
): NextStep[] {
  const steps: NextStep[] = []
  const asOf = profile.asOf

  if (invalidation) {
    steps.push({
      tone: 'danger',
      text: 'Remettez votre permis au préfet dans les 10 jours suivant la réception de la lettre recommandée (lettre 48SI).',
    })
    steps.push({
      tone: 'info',
      text: `Nouveau permis possible au plus tôt le ${formatDate(invalidation.earliestNewLicence)} (6 mois après), ou le ${formatDate(invalidation.earliestNewLicenceIfRepeat)} en cas de nouvelle perte totale en moins de 5 ans.`,
    })
    steps.push({
      tone: 'info',
      text: "Avant de repasser le permis : examen médical et examen psychotechnique, à vos frais.",
    })
    return steps
  }

  // Stage obligatoire récent en probatoire
  const recentAlert = [...events]
    .reverse()
    .find((e) => !e.future && e.alert && e.date >= addMonths(asOf, -4))
  if (recentAlert)
    steps.push({
      tone: 'warning',
      text: "Stage de sensibilisation obligatoire : il doit être suivi dans les 4 mois après la lettre recommandée. Il remplace l'amende et rend jusqu'à 4 points.",
    })

  for (const e of events.filter((e) => e.future && e.delta > 0).slice(0, 3)) {
    steps.push({ date: e.date, tone: 'positive', text: `${e.title} : +${pts(e.delta)}.` })
  }

  if (probation.activeAtAsOf && probation.end && !events.some((e) => e.future && e.kind === 'fin-probatoire' && e.delta > 0))
    steps.push({ tone: 'info', text: `Fin du permis probatoire le ${formatDate(probation.end)}.` })

  if (snap.balance < snap.cap) {
    const next = lastStage ? addYears(lastStage, 1) : asOf
    const gain = Math.min(STAGE_POINTS, snap.cap - snap.balance)
    steps.push({
      tone: 'info',
      text:
        next > asOf
          ? `Un nouveau stage de sensibilisation ne rendra des points qu'à partir du ${formatDate(next)} (un stage par an).`
          : `Un stage de sensibilisation volontaire peut vous rendre ${pts(gain)} dès le lendemain du stage.`,
    })
  } else {
    steps.push({ tone: 'positive', text: 'Votre capital est au maximum possible aujourd’hui : aucune démarche nécessaire.' })
  }
  return steps
}

export function isComputeError(r: Result | ComputeError): r is ComputeError {
  return 'error' in r
}
