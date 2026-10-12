import type { Result } from '../lib/compute'
import { Gauge } from './Gauge'
import { StatusPill } from './ui'

/** Barre compacte collée en haut sur mobile, visible quand le résultat principal est hors écran. */
export function CompactBar({ result, visible }: { result: Result | null; visible: boolean }) {
  if (!result) return null
  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 top-0 z-40 border-b border-line bg-surface/95 backdrop-blur transition-transform duration-200 lg:hidden ${
        visible ? 'translate-y-0' : 'pointer-events-none -translate-y-full'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <a
        href="#result-title"
        tabIndex={visible ? 0 : -1}
        className="mx-auto flex max-w-6xl items-center gap-3 py-2"
        style={{ paddingLeft: 'max(1rem, env(safe-area-inset-left))', paddingRight: 'max(1rem, env(safe-area-inset-right))' }}
        aria-label={`Solde : ${result.balance} points sur 12. Revenir au résultat.`}
      >
        <span className="num text-2xl leading-none font-medium">
          {result.balance}
          <span className="text-base text-muted"> / 12</span>
        </span>
        <span className="min-w-0 flex-1">
          <Gauge balance={result.balance} cap={result.cap} status={result.status} size="sm" />
        </span>
        <StatusPill status={result.status} small />
      </a>
    </div>
  )
}
