import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LOCATION, getListings } from '../data/listings'
import { Entry, mergedProperty, useMerge } from '../state/merge'
import { Icon } from './Icons'
import { PlatformMark } from './ui'

/** The "2 listings look like the same property" prompt. Review now starts the merge flow from `entry`. */
export function MergePrompt({ entry }: { entry: Entry }) {
  const navigate = useNavigate()
  const setEntry = useMerge((s) => s.setEntry)
  const [toast, setToast] = useState(false)
  const { airbnb, booking } = getListings('full')

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(false), 3200)
    return () => clearTimeout(t)
  }, [toast])

  return (
    <>
      <section className="prompt" aria-labelledby="prompt-title">
        <div className="prompt-head">
          <Icon.Warning stroke="var(--warn-text)" style={{ flex: 'none' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 id="prompt-title">2 listings look like the same property</h2>
            <p>
              Airbnb and Booking.com share an address in {LOCATION}. Review the differences to get one calendar, one price
              and one inbox. Nothing changes until you confirm.
            </p>
          </div>
        </div>
        {[airbnb, booking].map((l) => (
          <div className="prow" key={l.platform}>
            <span className="thumb" style={{ background: l.photos[0].background }} role="img" aria-label="Photo" />
            <span className="name">{l.title}</span>
            <PlatformMark platform={l.platform} size="sm" />
          </div>
        ))}
        <div className="prompt-actions">
          <button type="button" className="btn" onClick={() => setToast(true)}>
            Remind me later
          </button>
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              setEntry(entry)
              navigate('/merge/match')
            }}
          >
            Review now
          </button>
        </div>
      </section>

      {toast && (
        <div className="toast" role="status">
          We will remind you later. Nothing has changed.
        </div>
      )}
    </>
  )
}

/** Shown in place of the prompt once the listings are merged */
export function MergedProperty() {
  const lead = useMerge((s) => s.lead)
  const fields = useMerge((s) => s.fields)
  const variant = useMerge((s) => s.variant)
  const { name, cover } = mergedProperty({ lead, fields, variant })

  return (
    <>
      <section className="success-banner" role="status">
        <Icon.CheckCircle stroke="var(--ok-text)" style={{ flex: 'none', marginTop: 1 }} />
        <div>
          <h2>Your two listings are now one property</h2>
          <p>
            Airbnb and Booking.com now share one calendar, one price and one inbox. You can unmerge them at any time in
            the properties panel.
          </p>
        </div>
      </section>
      <section className="plist" aria-label="Merged property">
        <div className="plist-head">Two listings</div>
        <div className="prow">
          <span className="thumb" style={{ background: cover.background }} role="img" aria-label={`${cover.label}, cover photo`} />
          <span className="name">{name}</span>
          <span className="chip purple">New</span>
          <span className="logos">
            <PlatformMark platform="airbnb" size="sm" />
            <PlatformMark platform="booking" size="sm" />
          </span>
        </div>
      </section>
    </>
  )
}
