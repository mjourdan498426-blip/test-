import { describe, expect, it } from 'vitest'
import { infractions, infractionKey, type Infraction } from '../data/infractions'
import {
  compute,
  isComputeError,
  probationInfo,
  type OffenseInput,
  type Profile,
  type Result,
  type StageInput,
} from './compute'
import { addMonths, addYears } from './dates'

function inf(art: string, pts: number, cls?: Infraction['cls']): Infraction {
  const found = infractions.find((i) => i.art === art && i.pts === pts && (cls === undefined || i.cls === cls))
  if (!found) throw new Error(`Infraction introuvable : ${art} ${pts}`)
  return found
}

let n = 0
const off = (i: Infraction, date: string, paymentDate?: string): OffenseInput => ({
  id: `o${n++}`,
  infraction: i,
  date,
  paymentDate,
})
const stage = (date: string): StageInput => ({ id: `s${n++}`, date })

function run(
  p: Partial<Profile> & { obtention: string; asOf: string },
  offenses: OffenseInput[] = [],
  stages: StageInput[] = [],
): Result {
  const r = compute({ accompagnee: false, formation: false, ...p }, offenses, stages)
  if (isComputeError(r)) throw new Error(r.error)
  return r
}
const balance = (...args: Parameters<typeof run>) => run(...args).balance

// Infractions types utilisées dans les scénarios
const VITESSE_1PT = inf('R413-14', 1, 4) // 1 point, 4e classe
const CLIGNOTANT = inf('R412-10', 3) // 3 points, 2e classe
const FEU_ROUGE = inf('R412-30', 4) // 4 points, 4e classe
const VITESSE_2PT = inf('R413-14', 2) // 2 points, 4e classe
const ALCOOL_DELIT = inf('L234-1', 6) // délit, 6 points

describe('données', () => {
  it('contient les 72 infractions du barème (+ palier à 1 point découpé)', () => {
    expect(infractions).toHaveLength(73)
  })
  it('a des clés uniques et des valeurs cohérentes', () => {
    expect(new Set(infractions.map(infractionKey)).size).toBe(infractions.length)
    for (const i of infractions) {
      expect([1, 2, 3, 4, 6, 9]).toContain(i.pts)
      if (i.art.startsWith('L')) expect(i.cls).toBe('D')
      else expect(i.cls).not.toBe('D')
    }
  })
  it('applique les classes particulières', () => {
    for (const a of ['R412-6-2', 'R224-6', 'R234-5', 'R413-15']) expect(inf(a, a === 'R412-6-2' ? 3 : 6).cls).toBe(5)
    expect(inf('R412-10', 3).cls).toBe(2)
    expect(inf('R431-1-2', 1).cls).toBe(3)
    expect(inf('R412-6-4', 2).cls).toBe(3)
    expect(infractions.filter((i) => i.art === 'R413-14' && i.pts === 1).map((i) => i.cls).sort()).toEqual([3, 4])
  })
})

describe('permis probatoire sans infraction (depuis 2008)', () => {
  const d0 = '2020-03-15'
  it('6 points au départ', () => expect(balance({ obtention: d0, asOf: d0 })).toBe(6))
  it('8 points à 1 an (pas la veille)', () => {
    expect(balance({ obtention: d0, asOf: '2021-03-14' })).toBe(6)
    expect(balance({ obtention: d0, asOf: '2021-03-15' })).toBe(8)
  })
  it('10 points à 2 ans', () => expect(balance({ obtention: d0, asOf: '2022-03-15' })).toBe(10))
  it('12 points à 3 ans, fin du probatoire', () => {
    const r = run({ obtention: d0, asOf: '2023-03-15' })
    expect(r.balance).toBe(12)
    expect(r.cap).toBe(12)
    expect(r.status).toBe('complet')
    expect(r.probation.path).toEqual([6, 8, 10, 12])
  })
  it('affiche les événements futurs comme prévus', () => {
    const r = run({ obtention: d0, asOf: '2021-06-01' })
    expect(r.events.filter((e) => e.future).map((e) => e.kind)).toEqual(['majoration', 'fin-probatoire'])
  })
})

describe('conduite accompagnée', () => {
  const d0 = '2020-01-10'
  it('9 points à 1 an puis 12 à 2 ans', () => {
    expect(balance({ obtention: d0, accompagnee: true, asOf: '2021-01-10' })).toBe(9)
    expect(balance({ obtention: d0, accompagnee: true, asOf: '2022-01-09' })).toBe(9)
    expect(balance({ obtention: d0, accompagnee: true, asOf: '2022-01-10' })).toBe(12)
  })
})

describe('formation complémentaire', () => {
  it('réduit le probatoire d’un an sans infraction', () => {
    const p = probationInfo({ obtention: '2020-01-10', accompagnee: false, formation: true, asOf: '2020-01-10' })
    expect(p.end).toBe('2022-01-10')
    expect(p.path).toEqual([6, 8, 12])
  })
  it('réduit de 6 mois en conduite accompagnée', () => {
    const p = probationInfo({ obtention: '2020-01-10', accompagnee: true, formation: true, asOf: '2020-01-10' })
    expect(p.end).toBe('2021-07-10')
    expect(p.path).toEqual([6, 9, 12])
  })
  it('sans effet en cas d’infraction', () => {
    const r = run({ obtention: '2020-01-10', formation: true, asOf: '2022-01-10' }, [off(VITESSE_1PT, '2021-05-01')])
    expect(r.probation.end).toBe('2023-01-10')
    expect(r.probation.reducedByFormation).toBe(false)
  })
})

describe('régimes antérieurs', () => {
  it('avant le 1er mars 2004 : 12 points dès le départ', () => {
    const r = run({ obtention: '2004-02-29', asOf: '2004-02-29' })
    expect(r.balance).toBe(12)
    expect(r.probation.probatoire).toBe(false)
  })
  it('entre 2004 et 2007 : 6 points fixes puis 12 au bout de 3 ans', () => {
    const d0 = '2005-06-30'
    expect(balance({ obtention: d0, asOf: '2007-06-29' })).toBe(6)
    expect(balance({ obtention: d0, asOf: '2008-06-29' })).toBe(6)
    expect(balance({ obtention: d0, asOf: '2008-06-30' })).toBe(12)
  })
  it('entre 2004 et 2007 en conduite accompagnée : 2 ans', () => {
    expect(balance({ obtention: '2004-03-01', accompagnee: true, asOf: '2006-03-01' })).toBe(12)
  })
})

describe('récupération d’un point à 6 mois', () => {
  const p = { obtention: '2000-01-01' }
  it('point rendu à paiement + 6 mois', () => {
    const o = [off(VITESSE_1PT, '2024-01-10', '2024-01-31')]
    expect(balance({ ...p, asOf: '2024-07-30' }, o)).toBe(11)
    expect(balance({ ...p, asOf: '2024-07-31' }, o)).toBe(12)
    const r = run({ ...p, asOf: '2024-07-31' }, o)
    expect(r.events.some((e) => e.kind === 'recuperation-1pt')).toBe(true)
  })
  it('bloqué par une nouvelle infraction dans les 6 mois', () => {
    const o = [off(VITESSE_1PT, '2024-01-10', '2024-01-31'), off(VITESSE_2PT, '2024-05-01')]
    const r = run({ ...p, asOf: '2024-08-01' }, o)
    expect(r.balance).toBe(9)
    expect(r.events.some((e) => e.kind === 'recuperation-1pt')).toBe(false)
  })
})

describe('reconstitution du capital', () => {
  const p = { obtention: '2000-01-01' }
  it('2 ans pour une contravention de classe 1 à 3 (veille du jour : pas encore)', () => {
    const o = [off(CLIGNOTANT, '2022-04-01', '2022-04-15')]
    // T = 15/04/2024 + 1 jour
    expect(balance({ ...p, asOf: '2024-04-15' }, o)).toBe(9)
    expect(balance({ ...p, asOf: '2024-04-16' }, o)).toBe(12)
  })
  it('3 ans pour une contravention de 4e classe ou un délit', () => {
    const o = [off(FEU_ROUGE, '2022-04-01', '2022-04-15')]
    expect(balance({ ...p, asOf: '2024-04-16' }, o)).toBe(8)
    expect(balance({ ...p, asOf: '2025-04-15' }, o)).toBe(8)
    expect(balance({ ...p, asOf: '2025-04-16' }, o)).toBe(12)
  })
  it('chaîne : une infraction avant T prolonge le délai depuis le dernier paiement', () => {
    const o = [off(CLIGNOTANT, '2022-04-01', '2022-04-15'), off(CLIGNOTANT, '2023-06-01', '2023-06-10')]
    // La 2e infraction (avant le 16/04/2024) prolonge la chaîne : T = 10/06/2025 + 1 j
    expect(balance({ ...p, asOf: '2024-04-16' }, o)).toBe(6)
    expect(balance({ ...p, asOf: '2025-06-10' }, o)).toBe(6)
    expect(balance({ ...p, asOf: '2025-06-11' }, o)).toBe(12)
  })
  it('chaîne : une infraction de 4e classe dans la chaîne porte le délai à 3 ans', () => {
    const o = [off(FEU_ROUGE, '2022-04-01', '2022-04-15'), off(CLIGNOTANT, '2023-06-01', '2023-06-10')]
    expect(balance({ ...p, asOf: '2025-06-11' }, o)).toBe(5)
    expect(balance({ ...p, asOf: '2026-06-11' }, o)).toBe(12)
  })
  it('une infraction après T ouvre une nouvelle chaîne', () => {
    const o = [off(CLIGNOTANT, '2022-04-01', '2022-04-15'), off(CLIGNOTANT, '2024-05-01')]
    expect(balance({ ...p, asOf: '2024-05-01' }, o)).toBe(9)
    expect(balance({ ...p, asOf: '2026-05-02' }, o)).toBe(12)
  })
})

describe('infractions simultanées (L223-2)', () => {
  it('même lieu, même heure : cumul plafonné à 8 points', () => {
    const first = off(ALCOOL_DELIT, '2024-02-02')
    const o = [first, { ...off(FEU_ROUGE, '2024-02-02'), groupId: first.id }]
    const r = run({ obtention: '2000-01-01', asOf: '2024-02-03' }, o)
    expect(r.balance).toBe(4)
    expect(r.events.filter((e) => e.kind === 'retrait').map((e) => e.delta)).toEqual([-6, -2])
    expect(r.events.find((e) => e.delta === -2)?.refs).toContain('L223-2')
  })
  it('même jour mais pas simultanées : pas de plafond', () => {
    const o = [off(ALCOOL_DELIT, '2024-02-02'), off(FEU_ROUGE, '2024-02-02')]
    expect(balance({ obtention: '2000-01-01', asOf: '2024-02-03' }, o)).toBe(2)
  })
  it('un retrait isolé de 9 points n’est pas réduit', () => {
    const o = [off(inf('L235-1', 9), '2024-02-02')]
    expect(balance({ obtention: '2000-01-01', asOf: '2024-02-03' }, o)).toBe(3)
  })
})

describe('invalidation', () => {
  it('solde à 0 : permis invalidé, simulation arrêtée', () => {
    const o = [
      off(ALCOOL_DELIT, '2024-01-01'),
      off(ALCOOL_DELIT, '2024-03-01'),
      off(FEU_ROUGE, '2024-05-01'),
    ]
    const r = run({ obtention: '2000-01-01', asOf: '2024-06-01' }, o)
    expect(r.balance).toBe(0)
    expect(r.status).toBe('invalide')
    expect(r.invalidation).toEqual({
      date: '2024-03-01',
      earliestNewLicence: '2024-09-01',
      earliestNewLicenceIfRepeat: '2025-03-01',
    })
    expect(r.events.at(-1)?.kind).toBe('invalidation')
    expect(r.warnings.some((w) => w.includes('1 infraction postérieure'))).toBe(true)
  })
  it('en probatoire, une infraction à 6 points invalide le permis', () => {
    const r = run({ obtention: '2024-01-01', asOf: '2024-06-01' }, [off(ALCOOL_DELIT, '2024-05-01')])
    expect(r.status).toBe('invalide')
  })
})

describe('stages de sensibilisation', () => {
  it('+4 points le lendemain, plafonnés', () => {
    const o = [off(FEU_ROUGE, '2024-01-10')]
    expect(balance({ obtention: '2000-01-01', asOf: '2024-03-01' }, o, [stage('2024-03-01')])).toBe(8)
    expect(balance({ obtention: '2000-01-01', asOf: '2024-03-02' }, o, [stage('2024-03-01')])).toBe(12)
    const o2 = [off(VITESSE_2PT, '2024-01-10')]
    const r = run({ obtention: '2000-01-01', asOf: '2024-03-02' }, o2, [stage('2024-03-01')])
    expect(r.balance).toBe(12)
    expect(r.events.find((e) => e.kind === 'stage')?.delta).toBe(2)
  })
  it('plafonné au capital du probatoire', () => {
    const o = [off(VITESSE_2PT, '2024-03-01')]
    const r = run({ obtention: '2024-01-01', asOf: '2024-05-02' }, o, [stage('2024-05-01')])
    expect(r.balance).toBe(6)
    expect(r.cap).toBe(6)
  })
  it('un seul stage par an : le second est sans effet', () => {
    const o = [off(ALCOOL_DELIT, '2024-01-10'), off(FEU_ROUGE, '2024-01-20')]
    const r = run({ obtention: '2000-01-01', asOf: '2024-12-01' }, o, [stage('2024-03-01'), stage('2024-09-01')])
    expect(r.balance).toBe(6)
    expect(r.events.filter((e) => e.kind === 'stage-sans-effet')).toHaveLength(1)
    expect(balance({ obtention: '2000-01-01', asOf: '2025-03-02' }, o, [stage('2024-03-01'), stage('2025-03-01')])).toBe(10)
  })
})

describe('règle des 10 ans', () => {
  it('rend les points d’une contravention 10 ans après le paiement', () => {
    // Des infractions à 1 point tous les 2 ans et demi empêchent toute
    // reconstitution (elles sont elles-mêmes rendues au bout de 6 mois).
    const o = [
      off(FEU_ROUGE, '2010-01-01'),
      off(VITESSE_1PT, '2012-07-01'),
      off(VITESSE_1PT, '2015-01-01'),
      off(VITESSE_1PT, '2017-07-01'),
      off(VITESSE_1PT, '2019-12-01'),
    ]
    expect(balance({ obtention: '2000-01-01', asOf: '2019-12-31' }, o)).toBe(7)
    expect(balance({ obtention: '2000-01-01', asOf: '2020-01-01' }, o)).toBe(11)
    const r = run({ obtention: '2000-01-01', asOf: '2020-01-01' }, o)
    expect(r.events.find((e) => e.kind === 'recuperation-10ans')?.delta).toBe(4)
    expect(r.events.some((e) => e.kind === 'reconstitution')).toBe(false)
  })
  it('ne s’applique pas aux délits', () => {
    const o = [
      off(ALCOOL_DELIT, '2010-01-01'),
      off(VITESSE_1PT, '2012-07-01'),
      off(VITESSE_1PT, '2015-01-01'),
      off(VITESSE_1PT, '2017-07-01'),
      off(VITESSE_1PT, '2019-12-01'),
    ]
    const r = run({ obtention: '2000-01-01', asOf: '2020-01-02' }, o)
    expect(r.events.some((e) => e.kind === 'recuperation-10ans' && e.date === '2020-01-01')).toBe(false)
  })
})

describe('infraction pendant le probatoire', () => {
  const d0 = '2020-01-01'
  const o = [off(FEU_ROUGE, '2020-06-01')]
  it('alerte stage obligatoire et majorations bloquées', () => {
    const r = run({ obtention: d0, asOf: '2021-06-01' }, o)
    expect(r.balance).toBe(2)
    expect(r.cap).toBe(6)
    expect(r.events.find((e) => e.kind === 'retrait')?.alert).toMatch(/stage de sensibilisation obligatoire/)
    expect(r.events.some((e) => e.kind === 'majoration')).toBe(false)
  })
  it('fin du probatoire : plafond à 12, solde inchangé, puis reconstitution', () => {
    expect(run({ obtention: d0, asOf: '2023-01-01' }, o)).toMatchObject({ balance: 2, cap: 12 })
    // Reconstitution : 01/06/2020 + 3 ans + 1 jour
    expect(balance({ obtention: d0, asOf: '2023-06-01' }, o)).toBe(2)
    expect(balance({ obtention: d0, asOf: '2023-06-02' }, o)).toBe(12)
  })
  it('la reconstitution n’intervient pas avant la fin du probatoire', () => {
    const o2 = [off(VITESSE_2PT, '2020-02-01')]
    // 01/02/2020 + 3 ans + 1 j = 02/02/2023 > fin du probatoire 01/01/2023 → 02/02/2023
    expect(balance({ obtention: d0, asOf: '2023-02-01' }, o2)).toBe(4)
    expect(balance({ obtention: d0, asOf: '2023-02-02' }, o2)).toBe(12)
    const o3 = [off(CLIGNOTANT, '2020-02-01')]
    // 2 ans + 1 j = 02/02/2022 < fin du probatoire : T = 01/01/2023
    expect(balance({ obtention: d0, asOf: '2022-12-31' }, o3)).toBe(3)
    expect(balance({ obtention: d0, asOf: '2023-01-01' }, o3)).toBe(12)
  })
})

describe('cas particuliers', () => {
  it('ignore une infraction antérieure au permis, avec un avertissement', () => {
    const r = run({ obtention: '2020-01-01', asOf: '2021-01-01' }, [off(FEU_ROUGE, '2019-12-31')])
    expect(r.balance).toBe(8)
    expect(r.warnings[0]).toMatch(/antérieure à l'obtention/)
  })
  it('refuse une date de calcul antérieure à l’obtention', () => {
    const r = compute({ obtention: '2020-01-01', asOf: '2019-01-01', accompagnee: false, formation: false }, [], [])
    expect(isComputeError(r)).toBe(true)
  })
  it('le paiement par défaut est la date de l’infraction', () => {
    const r = run({ obtention: '2000-01-01', asOf: '2024-01-10' }, [off(FEU_ROUGE, '2024-01-10')])
    expect(r.balance).toBe(8)
  })
})

describe('dates', () => {
  it('gère la fin de mois', () => {
    expect(addMonths('2024-01-31', 1)).toBe('2024-02-29')
    expect(addMonths('2023-01-31', 1)).toBe('2023-02-28')
    expect(addMonths('2024-08-31', 6)).toBe('2025-02-28')
    expect(addMonths('2024-03-31', 1)).toBe('2024-04-30')
    expect(addYears('2024-02-29', 1)).toBe('2025-02-28')
    expect(addMonths('2024-05-15', -4)).toBe('2024-01-15')
  })
})
