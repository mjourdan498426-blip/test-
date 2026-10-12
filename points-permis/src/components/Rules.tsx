import type { ReactNode } from 'react'
import { Art, Chevron, SectionTitle } from './ui'

function Rule({ title, refs, children }: { title: string; refs: string[]; children: ReactNode }) {
  return (
    <details className="border-b border-line last:border-b-0">
      <summary className="flex min-h-12 items-center gap-3 py-3 font-bold">
        <span className="flex-1">{title}</span>
        <Chevron />
      </summary>
      <div className="space-y-3 pb-5 text-[0.95rem]">
        {children}
        <p className="text-sm text-muted">
          Références :{' '}
          {refs.map((r, i) => (
            <span key={r}>
              {i > 0 && ', '}
              <Art>{r}</Art>
            </span>
          ))}
        </p>
      </div>
    </details>
  )
}

function Example({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-surface-2 p-3">
      <p className="text-sm font-bold text-muted">Exemple</p>
      <div className="mt-1">{children}</div>
    </div>
  )
}

export function Rules() {
  return (
    <section aria-labelledby="regles-title" className="card p-5 sm:p-6">
      <SectionTitle step={4} id="regles-title">
        Comprendre les règles
      </SectionTitle>
      <div className="mt-3">
        <Rule title="Le capital de points" refs={['L223-1', 'L223-2', 'R223-1']}>
          <p>
            Le permis compte au maximum <strong>12 points</strong>. Chaque infraction listée par le Code de la route retire un
            nombre fixe de points : de 1 à 6, et jusqu'à 9 pour la conduite après usage de stupéfiants cumulée avec l'alcool.
          </p>
          <Example>
            <p>
              Avec 12 points, un feu rouge (<span className="num">−4</span>) puis, un mois plus tard, un téléphone tenu en main (
              <span className="num">−3</span>) laissent <span className="num">5</span> points.
            </p>
          </Example>
        </Rule>

        <Rule title="Le permis probatoire" refs={['L223-1', 'R223-1', 'L223-6']}>
          <p>
            Depuis le 1er mars 2004, un nouveau permis commence avec <strong>6 points</strong>. Pour un permis obtenu depuis 2008,
            chaque anniversaire sans infraction ajoute 2 points (3 en conduite accompagnée). Une seule infraction bloque toutes les
            majorations suivantes.
          </p>
          <p>
            Le probatoire dure 3 ans (2 ans en conduite accompagnée). La formation complémentaire le raccourcit d'un an (6 mois en
            conduite accompagnée), à condition de n'avoir commis aucune infraction.
          </p>
          <p>
            Pour un permis obtenu entre 2004 et 2007, le capital reste à 6 points pendant tout le probatoire, puis passe à 12 s'il
            n'y a eu aucune infraction.
          </p>
          <Example>
            <p>
              Permis obtenu le 10 septembre 2024, sans conduite accompagnée : <span className="num">6</span> points, puis{' '}
              <span className="num">8</span> le 10/09/2025, <span className="num">10</span> le 10/09/2026 et{' '}
              <span className="num">12</span> le 10/09/2027.
            </p>
          </Example>
          <p>
            Un retrait d'au moins 3 points pendant le probatoire impose un <strong>stage de sensibilisation obligatoire</strong>,
            qui remplace l'amende.
          </p>
        </Rule>

        <Rule title="Les retraits de points" refs={['L223-1', 'L223-2']}>
          <p>
            Les points sont retirés quand l'infraction devient définitive : paiement de l'amende forfaitaire ou condamnation. Le
            solde ne descend jamais sous 0.
          </p>
          <p>
            Plusieurs infractions commises <strong>au même lieu et à la même heure</strong> ne retirent pas plus de{' '}
            <strong>8 points</strong> au total (deux tiers du capital).
          </p>
          <Example>
            <p>
              Lors d'un même contrôle, un délit d'alcoolémie (<span className="num">−6</span>) et un feu rouge (
              <span className="num">−4</span>) retirent <span className="num">8</span> points, et non 10.
            </p>
          </Example>
        </Rule>

        <Rule title="Les quatre façons de récupérer des points" refs={['L223-6', 'R223-8']}>
          <ol className="list-decimal space-y-3 pl-5">
            <li>
              <strong>Un point au bout de 6 mois.</strong> Une infraction qui n'a retiré qu'un point est effacée 6 mois après le
              paiement, s'il n'y a pas de nouvelle infraction dans l'intervalle.
              <Example>
                Excès de vitesse de 10 km/h, amende payée le 15/01/2026 : le point revient le 15/07/2026.
              </Example>
            </li>
            <li>
              <strong>Retour à 12 points après 2 ou 3 ans sans infraction.</strong> Le délai est de 2 ans, ou de 3 ans si l'une
              des infractions est un délit ou une contravention de 4e ou 5e classe. Il court à partir du dernier paiement ; le
              capital revient le lendemain du délai écoulé, et jamais avant la fin du probatoire.
              <Example>
                Clignotant oublié (2e classe), payé le 10/03/2025 : retour à 12 points le 11/03/2027. Un feu rouge (4e classe)
                payé le même jour : le 11/03/2028.
              </Example>
            </li>
            <li>
              <strong>Au bout de 10 ans.</strong> Les points retirés pour une contravention de 1re à 4e classe reviennent 10 ans
              après le paiement, même si d'autres infractions ont suivi.
            </li>
            <li>
              <strong>Un stage de sensibilisation.</strong> Il rend jusqu'à 4 points le lendemain du dernier jour, sans dépasser
              le plafond. Un seul stage par an compte.
              <Example>Avec 7 points sur 12, un stage terminé le 4 mai rend 4 points le 5 mai : solde de 11.</Example>
            </li>
          </ol>
        </Rule>

        <Rule title="L'invalidation du permis" refs={['L223-5', 'R223-3']}>
          <p>
            À 0 point, le permis perd sa validité. Une lettre recommandée (48SI) demande de le <strong>remettre au préfet</strong>{' '}
            dans les 10 jours.
          </p>
          <p>
            Un nouveau permis peut être demandé au plus tôt <strong>6 mois</strong> après la remise, ou <strong>1 an</strong> en
            cas de nouvelle perte totale des points en moins de 5 ans. Il faut d'abord passer un{' '}
            <strong>examen médical et un examen psychotechnique</strong>, puis repasser le code (et la conduite si le permis
            avait moins de 3 ans).
          </p>
          <Example>Permis remis le 1er mars 2026 : nouveau permis possible au plus tôt le 1er septembre 2026.</Example>
        </Rule>
      </div>
    </section>
  )
}
