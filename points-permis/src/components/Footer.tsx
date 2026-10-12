import { useState } from 'react'
import { LEGIFRANCE_CODE_DE_LA_ROUTE } from '../data/infractions'
import { Art } from './ui'

const SOURCES = ['L223-1', 'L223-2', 'L223-5', 'L223-6', 'R223-1', 'R223-3', 'R223-8']

export function Footer({ onClear }: { onClear: () => void }) {
  const [confirming, setConfirming] = useState(false)
  return (
    <footer className="mt-8 space-y-6 border-t border-line pt-6 text-sm text-muted">
      <p className="text-base font-bold text-ink">Estimation indicative : le solde officiel est tenu par le ministère de l'Intérieur.</p>
      <p>
        Pour connaître votre solde officiel, consultez le service Télépoints sur le site de l'ANTS ou demandez un relevé
        d'information intégral en préfecture.
      </p>
      <div>
        <h2 className="text-base font-semibold text-ink">Sources</h2>
        <p className="mt-1">
          Code de la route, articles{' '}
          {SOURCES.map((s, i) => (
            <span key={s}>
              {i > 0 && ', '}
              <Art>{s}</Art>
            </span>
          ))}{' '}
          et l'article propre à chaque infraction, cité dans la liste et la chronologie.{' '}
          <a className="font-bold text-accent underline underline-offset-2" href={LEGIFRANCE_CODE_DE_LA_ROUTE} target="_blank" rel="noopener noreferrer">
            Consulter le Code de la route sur Légifrance
          </a>
          . Barème des infractions : textes consolidés au 12 octobre 2026.
        </p>
      </div>
      <div>
        <h2 className="text-base font-semibold text-ink">Ne sont pas couverts</h2>
        <p className="mt-1">Les permis étrangers, les suspensions et les annulations du permis.</p>
      </div>
      <div>
        <h2 className="text-base font-semibold text-ink">Vos données</h2>
        <p className="mt-1">
          Tout le calcul se fait sur votre appareil. Vos saisies sont enregistrées uniquement dans ce navigateur et ne sont envoyées
          nulle part. L'application fonctionne aussi hors ligne.
        </p>
        {confirming ? (
          <div className="mt-3 rounded-xl border p-3" style={{ borderColor: 'var(--loss)' }} role="alert">
            <p className="font-bold text-ink">Effacer toutes vos saisies ? Cette action est définitive.</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  onClear()
                  setConfirming(false)
                }}
              >
                Oui, tout effacer
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setConfirming(false)}>
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <button type="button" className="btn btn-danger mt-3" onClick={() => setConfirming(true)}>
            Tout effacer
          </button>
        )}
      </div>
    </footer>
  )
}
