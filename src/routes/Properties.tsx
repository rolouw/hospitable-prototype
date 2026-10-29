import { MergePrompt, MergedProperty } from '../components/MergePrompt'
import { useMerge } from '../state/merge'

/** 8a before publish, 8j after */
export function Properties() {
  const published = useMerge((s) => s.published)
  return (
    <div className="props">
      <nav className="subnav" aria-label="Properties sections">
        <h2>Properties</h2>
        <a href="#" aria-current="page" onClick={(e) => e.preventDefault()}>
          All
        </a>
        <a href="#" onClick={(e) => e.preventDefault()}>
          Needs review
          {!published && (
            <span className="chip warn" aria-label="2 need review">
              2
            </span>
          )}
        </a>
        {['New properties', 'Draft properties', 'Muted properties'].map((l) => (
          <a key={l} href="#" onClick={(e) => e.preventDefault()}>
            {l}
          </a>
        ))}
        <h3>Room types</h3>
        {['Entire home', 'Shared room', 'Private room'].map((l) => (
          <a key={l} href="#" onClick={(e) => e.preventDefault()}>
            {l}
          </a>
        ))}
      </nav>

      <main className="props-main">
        <h1>All</h1>

        {published ? <MergedProperty /> : <MergePrompt entry="/properties" />}
      </main>

    </div>
  )
}
