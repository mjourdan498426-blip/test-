import type { ReactNode } from 'react'
import type { Status } from '../lib/compute'

export function pointsLabel(n: number): string {
  return `${n} point${Math.abs(n) > 1 ? 's' : ''}`
}

export function signed(n: number): string {
  if (n > 0) return `+${n}`
  if (n < 0) return `−${Math.abs(n)}`
  return '0'
}

/** Référence d'article en police mono. */
export function Art({ children }: { children: ReactNode }) {
  return <span className="font-mono text-[0.85em] whitespace-nowrap">{children}</span>
}

export function Refs({ refs }: { refs: string[] }) {
  return (
    <p className="text-sm text-muted">
      <span className="sr-only">Références : </span>
      {refs.map((r, i) => (
        <span key={r}>
          {i > 0 && ', '}
          <Art>{r}</Art>
        </span>
      ))}
    </p>
  )
}

export const STATUS: Record<Status, { label: string; color: string; soft: string }> = {
  complet: { label: 'Capital complet', color: 'var(--gain)', soft: 'var(--gain-soft)' },
  correct: { label: 'Solde correct', color: 'var(--accent)', soft: 'var(--accent-soft)' },
  bas: { label: 'Solde bas', color: 'var(--warn)', soft: 'var(--warn-soft)' },
  critique: { label: 'Solde critique', color: 'var(--loss)', soft: 'var(--loss-soft)' },
  invalide: { label: 'Permis invalidé', color: 'var(--loss)', soft: 'var(--loss-soft)' },
}

export function StatusPill({ status, small = false }: { status: Status; small?: boolean }) {
  const s = STATUS[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold ${small ? 'px-2 py-0.5 text-sm' : 'px-3 py-1'}`}
      style={{ color: s.color, background: s.soft }}
    >
      <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full" style={{ background: s.color }} />
      {s.label}
    </span>
  )
}

export function SectionTitle({ step, id, children }: { step?: number; id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="flex items-baseline gap-3 text-xl font-semibold sm:text-2xl">
      {step !== undefined && (
        <span className="num text-base text-muted" aria-hidden="true">
          {String(step).padStart(2, '0')}
        </span>
      )}
      {children}
    </h2>
  )
}

export function Chevron() {
  return (
    <svg className="chevron h-5 w-5 flex-none" viewBox="0 0 20 20" aria-hidden="true" fill="none">
      <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
