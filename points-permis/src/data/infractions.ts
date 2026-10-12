/**
 * Infractions au Code de la route entraînant un retrait de points.
 *
 * Source : barème « Infractions et retrait de points », Code de la route,
 * Légifrance, textes consolidés au 12 octobre 2026 (72 infractions).
 * Intitulés abrégés : seul le texte de l'article fait foi.
 * Code de la route : https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006074228
 *
 * Classes : les délits (articles L) sont de classe 'D'. Les contraventions sont
 * de 4e classe, sauf : 5e classe pour R412-6-2, R224-6, R234-5, R413-15 ;
 * 2e classe pour R412-10 ; 3e classe pour R431-1-2 et R412-6-4.
 * R413-14 (vitesse) est découpé par palier ; le palier à 1 point est de
 * 3e classe si la vitesse maximale autorisée dépasse 50 km/h, de 4e classe sinon.
 * Un excès de moins de 5 km/h ne retire aucun point (R413-14).
 *
 * cls : 'D' = délit ; 1 à 5 = classe de la contravention.
 */

export type InfractionClass = 'D' | 1 | 2 | 3 | 4 | 5

export interface Infraction {
  art: string
  title: string
  pts: number
  cls: InfractionClass
}

export const LEGIFRANCE_CODE_DE_LA_ROUTE =
  'https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006074228'

export const infractions: Infraction[] = [
  // Retrait de 9 points
  { art: 'L235-1', title: 'Conduite après usage de stupéfiants et sous l’empire d’un état alcoolique', pts: 9, cls: 'D' },
  // Retrait de 6 points
  { art: 'L234-1', title: 'Conduite sous l’empire d’un état alcoolique (délit)', pts: 6, cls: 'D' },
  { art: 'L234-8', title: 'Refus de se soumettre aux vérifications d’alcoolémie', pts: 6, cls: 'D' },
  { art: 'L235-1', title: 'Conduite après usage de stupéfiants', pts: 6, cls: 'D' },
  { art: 'L235-3', title: 'Refus de se soumettre aux vérifications (stupéfiants)', pts: 6, cls: 'D' },
  { art: 'L237-1', title: 'Conduite en état d’ivresse manifeste ou sous substances', pts: 6, cls: 'D' },
  { art: 'L413-1', title: 'Excès de vitesse de 50 km/h ou plus', pts: 6, cls: 'D' },
  { art: 'L232-3', title: 'Homicide routier, blessures routières, atteintes involontaires', pts: 6, cls: 'D' },
  { art: 'L231-3', title: 'Délit de fuite : omission de s’arrêter après un accident', pts: 6, cls: 'D' },
  { art: 'L233-1', title: 'Refus d’obtempérer à une sommation de s’arrêter', pts: 6, cls: 'D' },
  { art: 'L233-2', title: 'Refus de se soumettre aux vérifications (véhicule, personne)', pts: 6, cls: 'D' },
  { art: 'L224-16', title: 'Conduite malgré suspension ou rétention du permis', pts: 6, cls: 'D' },
  { art: 'L224-17', title: 'Refus de restituer le permis suspendu ou annulé', pts: 6, cls: 'D' },
  { art: 'L224-18', title: 'Fausse déclaration pour obtenir le permis de conduire', pts: 6, cls: 'D' },
  { art: 'L412-1', title: 'Entrave à la circulation (objet faisant obstacle)', pts: 6, cls: 'D' },
  { art: 'L325-3-1', title: 'Obstacle à l’immobilisation ou à la mise en fourrière', pts: 6, cls: 'D' },
  { art: 'L317-2', title: 'Usage d’une plaque d’immatriculation fausse ou supposée', pts: 6, cls: 'D' },
  { art: 'L317-3', title: 'Circulation sans plaque et fausse déclaration d’identité', pts: 6, cls: 'D' },
  { art: 'L317-4', title: 'Plaque ne correspondant pas au véhicule ou à l’utilisateur', pts: 6, cls: 'D' },
  { art: 'L317-4-1', title: 'Usurpation du numéro d’immatriculation d’un autre véhicule', pts: 6, cls: 'D' },
  { art: 'R415-11', title: 'Priorité non respectée au piéton régulièrement engagé', pts: 6, cls: 4 },
  { art: 'R413-15', title: 'Détention d’un détecteur ou perturbateur de contrôles', pts: 6, cls: 5 },
  { art: 'R234-1', title: 'Conduite sous l’empire d’un état alcoolique (contravention)', pts: 6, cls: 4 },
  { art: 'R234-5', title: 'Conduite sans éthylotest antidémarrage imposé par condamnation', pts: 6, cls: 5 },
  { art: 'R224-6', title: 'Violation de la restriction préfectorale (éthylotest antidémarrage)', pts: 6, cls: 5 },
  // Retrait de 4 points
  { art: 'R412-30', title: 'Franchissement d’un feu rouge', pts: 4, cls: 4 },
  { art: 'R412-28', title: 'Circulation en sens interdit', pts: 4, cls: 4 },
  { art: 'R413-14', title: 'Excès de vitesse de 40 à moins de 50 km/h', pts: 4, cls: 4 },
  { art: 'R415-4', title: 'Priorité non respectée en quittant la route sur sa gauche', pts: 4, cls: 4 },
  { art: 'R415-5', title: 'Priorité à droite non respectée', pts: 4, cls: 4 },
  { art: 'R415-6', title: 'Stop non respecté', pts: 4, cls: 4 },
  { art: 'R415-7', title: '« Cédez le passage » non respecté', pts: 4, cls: 4 },
  { art: 'R415-8', title: 'Priorité non respectée sur route à grande circulation', pts: 4, cls: 4 },
  { art: 'R415-9', title: 'Priorité non respectée en débouchant d’un accès non public', pts: 4, cls: 4 },
  { art: 'R415-10', title: 'Priorité non respectée au carrefour à sens giratoire', pts: 4, cls: 4 },
  { art: 'R415-12', title: 'Priorité non respectée aux véhicules prioritaires', pts: 4, cls: 4 },
  { art: 'R416-11', title: 'Circulation sans éclairage ni signalisation de nuit', pts: 4, cls: 4 },
  { art: 'R421-3', title: 'Priorité non respectée à l’insertion sur autoroute', pts: 4, cls: 4 },
  { art: 'R421-6', title: 'Demi-tour sur autoroute', pts: 4, cls: 4 },
  { art: 'R422-3', title: 'Priorité non respectée aux matériels sur voie ferrée', pts: 4, cls: 4 },
  // Retrait de 3 points
  { art: 'R412-12', title: 'Non-respect des distances de sécurité entre véhicules', pts: 3, cls: 4 },
  { art: 'R412-6-1', title: 'Usage du téléphone tenu en main ou port d’écouteurs', pts: 3, cls: 4 },
  { art: 'R412-6-2', title: 'Écran en fonctionnement dans le champ de vision du conducteur', pts: 3, cls: 5 },
  { art: 'R412-1', title: 'Non-port de la ceinture de sécurité par le conducteur', pts: 3, cls: 4 },
  { art: 'R412-1-1', title: 'Passagers transportés hors des places assises prévues', pts: 3, cls: 4 },
  { art: 'R413-14', title: 'Excès de vitesse de 30 à moins de 40 km/h', pts: 3, cls: 4 },
  { art: 'R412-8', title: 'Circulation sur la bande d’arrêt d’urgence', pts: 3, cls: 4 },
  { art: 'R412-9', title: 'Circulation sur la partie gauche de la chaussée', pts: 3, cls: 4 },
  { art: 'R412-10', title: 'Changement de direction ou ralentissement sans avertir', pts: 3, cls: 2 },
  { art: 'R412-11-3', title: 'Circulation inter-files non conforme (deux-roues motorisés)', pts: 3, cls: 4 },
  { art: 'R412-19', title: 'Franchissement d’une ligne continue', pts: 3, cls: 4 },
  { art: 'R414-4', title: 'Dépassement dangereux', pts: 3, cls: 4 },
  { art: 'R414-6', title: 'Dépassement par la droite hors cas autorisés', pts: 3, cls: 4 },
  { art: 'R414-7', title: 'Dépassement gênant la circulation en sens inverse', pts: 3, cls: 4 },
  { art: 'R414-8', title: 'Dépassement par la voie de gauche (chaussée à plus de deux voies)', pts: 3, cls: 4 },
  { art: 'R414-10', title: 'Rabattement sans précaution après un dépassement', pts: 3, cls: 4 },
  { art: 'R414-11', title: 'Dépassement sans visibilité suffisante', pts: 3, cls: 4 },
  { art: 'R411-17', title: 'Non-respect d’une interdiction d’accès à certaines routes', pts: 3, cls: 4 },
  { art: 'R411-21-1', title: 'Non-respect d’une interdiction temporaire de circuler', pts: 3, cls: 4 },
  { art: 'R416-12', title: 'Arrêt ou stationnement de nuit sans les feux requis', pts: 3, cls: 4 },
  { art: 'R417-9', title: 'Arrêt ou stationnement dangereux', pts: 3, cls: 4 },
  { art: 'R316-3-1', title: 'Vitres non conformes (transparence)', pts: 3, cls: 4 },
  { art: 'R431-1', title: 'Non-port du casque (deux-roues motorisés)', pts: 3, cls: 4 },
  { art: 'R221-1-1', title: 'Conduite hors conditions ou restrictions du permis', pts: 3, cls: 4 },
  // Retrait de 2 points
  { art: 'R413-14', title: 'Excès de vitesse de 20 à moins de 30 km/h', pts: 2, cls: 4 },
  { art: 'R414-16', title: 'Accélération lorsqu’on est sur le point d’être dépassé', pts: 2, cls: 4 },
  { art: 'R412-6-4', title: 'Position ou manœuvre acrobatique, caractérisée par l’imprudence', pts: 2, cls: 3 },
  { art: 'R421-5', title: 'Circulation, arrêt ou stationnement sur la bande centrale (autoroute)', pts: 2, cls: 4 },
  // Retrait de 1 point
  { art: 'R413-14', title: 'Excès de vitesse de 5 à moins de 20 km/h (limite supérieure à 50 km/h)', pts: 1, cls: 3 },
  { art: 'R413-14', title: 'Excès de vitesse de 5 à moins de 20 km/h (limite de 50 km/h ou moins)', pts: 1, cls: 4 },
  { art: 'R412-19', title: 'Chevauchement d’une ligne continue', pts: 1, cls: 4 },
  { art: 'R412-22', title: 'Franchissement des lignes de bande d’arrêt d’urgence', pts: 1, cls: 4 },
  { art: 'R431-1-2', title: 'Non-port de gants (deux-roues motorisés)', pts: 1, cls: 3 },
]

/** Identifiant stable d'une entrée (un même article peut avoir plusieurs paliers). */
export function infractionKey(i: Infraction): string {
  return `${i.art}|${i.pts}|${i.cls}`
}

export function classLabel(cls: InfractionClass): string {
  return cls === 'D' ? 'Délit' : `Contravention de ${cls}${cls === 1 ? 're' : 'e'} classe`
}
