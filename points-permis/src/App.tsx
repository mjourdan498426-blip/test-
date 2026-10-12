import { useEffect, useMemo, useRef, useState } from 'react'
import { compute, probationInfo, type Result } from './lib/compute'
import { isValidISODate, todayISO } from './lib/dates'
import { clearState, EMPTY_STATE, loadState, newId, saveState, type AppState } from './lib/storage'
import { CompactBar } from './components/CompactBar'
import { Footer } from './components/Footer'
import { OffensesSection } from './components/OffensesSection'
import { ProfileSection } from './components/ProfileSection'
import { ResultPanel } from './components/ResultPanel'
import { Rules } from './components/Rules'
import { ThemeToggle } from './components/ThemeToggle'
import { Timeline } from './components/Timeline'

export default function App() {
  const [state, setState] = useState<AppState>(loadState)
  const [today] = useState(() => todayISO())
  const asOf = state.asOf ?? today
  const hasD0 = isValidISODate(state.obtention)

  useEffect(() => saveState(state), [state])

  const result = useMemo(() => {
    if (!hasD0) return null
    return compute(
      { obtention: state.obtention, accompagnee: state.accompagnee, formation: state.formation, asOf },
      state.offenses,
      state.stages,
    )
  }, [hasD0, state, asOf])
  const okResult: Result | null = result && !('error' in result) ? result : null

  const probation = useMemo(() => {
    if (okResult) return okResult.probation
    if (!hasD0) return null
    return probationInfo(
      { obtention: state.obtention, accompagnee: state.accompagnee, formation: state.formation, asOf },
      state.offenses.map((o) => o.date),
    )
  }, [okResult, hasD0, state, asOf])

  // Barre compacte : visible quand le panneau de résultat sort de l'écran (mobile).
  const resultRef = useRef<HTMLDivElement>(null)
  const [resultHidden, setResultHidden] = useState(false)
  useEffect(() => {
    const el = resultRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([entry]) => setResultHidden(!entry.isIntersecting && entry.boundingClientRect.top < 0), {
      threshold: 0,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const update = (patch: Partial<AppState>) => setState((s) => ({ ...s, ...patch }))

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-surface focus:p-3">
        Aller au contenu
      </a>
      <CompactBar result={okResult} visible={resultHidden} />

      <div
        className="mx-auto max-w-6xl"
        style={{
          paddingLeft: 'max(1rem, env(safe-area-inset-left))',
          paddingRight: 'max(1rem, env(safe-area-inset-right))',
          paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
        }}
      >
        <header className="flex items-center justify-between gap-3 pb-4" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
          <div className="flex min-w-0 items-center gap-3">
            <svg viewBox="0 0 32 32" className="h-9 w-9 flex-none" aria-hidden="true">
              <rect width="32" height="32" rx="8" fill="var(--accent)" />
              {Array.from({ length: 6 }, (_, i) => (
                <rect key={i} x={5 + i * 3.8} y="10" width="2.6" height="12" rx="1" fill="var(--on-accent)" opacity={i < 4 ? 1 : 0.4} />
              ))}
            </svg>
            <div className="min-w-0">
              <h1 className="text-xl font-bold sm:text-2xl">Mes points de permis</h1>
              <p className="text-sm text-muted">Calcul pédagogique du solde, articles à l'appui</p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <main id="main" className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-6">
          <div className="lg:col-start-2 lg:row-span-3 lg:row-start-1">
            <div ref={resultRef} className="lg:sticky lg:top-6">
              <ResultPanel result={result} asOf={asOf} isToday={asOf === today} />
            </div>
          </div>
          <div className="space-y-4 lg:col-start-1 lg:row-start-1 lg:space-y-6">
            <ProfileSection
              obtention={state.obtention}
              accompagnee={state.accompagnee}
              formation={state.formation}
              asOf={asOf}
              isToday={asOf === today}
              today={today}
              probation={probation}
              onChange={(p) => {
                const patch: Partial<AppState> = {}
                if (p.obtention !== undefined) patch.obtention = isValidISODate(p.obtention) ? p.obtention : ''
                if (p.accompagnee !== undefined) patch.accompagnee = p.accompagnee
                if (p.formation !== undefined) patch.formation = p.formation
                if (p.asOf !== undefined) patch.asOf = p.asOf && isValidISODate(p.asOf) && p.asOf !== today ? p.asOf : null
                update(patch)
              }}
            />
            <OffensesSection
              offenses={state.offenses}
              stages={state.stages}
              minDate={hasD0 ? state.obtention : undefined}
              maxDate={asOf > today ? asOf : today}
              disabled={!hasD0}
              onAddOffense={(o) => update({ offenses: [...state.offenses, { ...o, id: newId('inf') }] })}
              onRemoveOffense={(id) => update({ offenses: state.offenses.filter((o) => o.id !== id) })}
              onAddStage={(date) => update({ stages: [...state.stages, { id: newId('stage'), date }] })}
              onRemoveStage={(id) => update({ stages: state.stages.filter((s) => s.id !== id) })}
            />
          </div>
          <div className="lg:col-start-1 lg:row-start-2">
            <Timeline result={okResult} />
          </div>
          <div className="lg:col-start-1 lg:row-start-3">
            <Rules />
          </div>
        </main>

        <Footer
          onClear={() => {
            clearState()
            setState(EMPTY_STATE)
          }}
        />
      </div>
    </>
  )
}
