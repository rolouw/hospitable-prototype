import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icons'
import { PlatformMark } from '../components/ui'
import { LOCATION, getListings } from '../data/listings'
import { useMerge } from '../state/merge'

/** 8b */
export function Match() {
  const navigate = useNavigate()
  const setMatched = useMerge((s) => s.setMatched)
  const variant = useMerge((s) => s.variant)
  const entry = useMerge((s) => s.entry)
  const listings = getListings(variant)

  return (
    <>
      <div className="page">
        <h1 className="page-title">We think these two listings are the same property</h1>
        <p className="page-lead">
          Both listings share the same address in {LOCATION}. If they are the same, Hospitable can keep one calendar, one
          price and one inbox for this property. Nothing changes on either platform yet.
        </p>

        <div className="match-grid">
          {(['airbnb', 'booking'] as const).map((p) => {
            const l = listings[p]
            return (
              <article className="card listing-card" key={p} aria-label={`${p === 'airbnb' ? 'Airbnb' : 'Booking.com'} listing`}>
                <div className="pc-logo">
                  <PlatformMark platform={p} size="lg" />
                </div>
                <span className="photo" style={{ background: l.photos[0].background }} role="img" aria-label="Cover photo" />
                <div>
                  <div className="title">{l.title}</div>
                  <div className="subtitle">{l.address}</div>
                </div>
                <dl className="traits">
                  <div>
                    <dt>Property type</dt>
                    <dd>{l.propertyType}</dd>
                  </div>
                  <div>
                    <dt>Photos</dt>
                    <dd>{l.photos.length}</dd>
                  </div>
                  <div>
                    <dt>Guests</dt>
                    <dd>{l.guests}</dd>
                  </div>
                </dl>
              </article>
            )
          })}
        </div>

        <section className="question" aria-labelledby="q-title">
          <h2 id="q-title">Are these the same property?</h2>
          <div className="actions">
            <button
              type="button"
              className="btn primary"
              onClick={() => {
                setMatched(true)
                navigate('/merge/combine')
              }}
            >
              Yes, they are the same
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setMatched(false)
                navigate(entry)
              }}
            >
              No, keep them separate
            </button>
          </div>
        </section>
      </div>

      <div className="footer-bar">
        <span className="footer-note with-icon">
          <Icon.Info />
          Both listings stay as separate properties until you confirm.
        </span>
        <button type="button" className="btn" onClick={() => navigate(entry)}>
          Not now
        </button>
      </div>
    </>
  )
}
