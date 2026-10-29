import { ReactNode, useCallback, useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icons'
import { Modal } from '../components/Modal'
import { HospitableWordmark, PlatformMark, Swatches } from '../components/ui'
import { FIELD_LABEL, FIELD_SLUG, MATCHING_FIELDS, VARIANT_CONFIG } from '../data/listings'
import { FieldRow, channelRows, directRows, useMerge } from '../state/merge'

const STATUS_LABEL: Record<FieldRow['status'], string> = { changed: 'Changed', same: 'No change', new: 'New' }

function changesLabel(n: number) {
  if (n === 0) return 'No changes'
  return n === 1 ? '1 change' : `${n} changes`
}

type ColumnProps = {
  head: ReactNode
  rows: FieldRow[]
  label: string
  /** Shared across all three cards so they open and close together */
  showMatching: boolean
  onToggleMatching: () => void
}

function ListingColumn({ head, rows, label, showMatching, onToggleMatching }: ColumnProps) {
  const listId = useId()
  const photos = rows.find((r) => r.field === 'photos')?.photos ?? []
  return (
    <section className="pc" aria-label={label}>
      <div className="pc-head">{head}</div>
      <div className="pc-cover" style={{ background: photos[0]?.background }} role="img" aria-label="Cover photo" />
      {rows.map((r) => (
        <div className="fb" key={r.field}>
          <div className="fl">
            <span>{FIELD_LABEL[r.field]}</span>
            <span className={`status ${r.status}`}>{STATUS_LABEL[r.status]}</span>
          </div>
          {r.field === 'photos' ? (
            <div>
              <Swatches photos={r.photos ?? []} />
              <div className="muted" style={{ fontSize: 13 }}>
                {r.value}
              </div>
            </div>
          ) : r.field === 'title' ? (
            <div style={{ fontWeight: 600 }}>{r.value}</div>
          ) : (
            <div>{r.value}</div>
          )}
          {r.was && (
            <div className="was">
              <span className="sr-only">Was: </span>
              {r.was}
            </div>
          )}
        </div>
      ))}
      <div className="fb matching">
        <button
          type="button"
          className="expander"
          aria-expanded={showMatching}
          aria-controls={listId}
          onClick={onToggleMatching}
        >
          <Icon.Chevron className="chev" width={14} height={14} />
          {showMatching ? 'Hide' : 'Show'} {MATCHING_FIELDS.length} matching fields
        </button>
        {showMatching && (
          <dl id={listId} className="match-list">
            {MATCHING_FIELDS.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  )
}

/** 8h, with the 8i publish modal over it */
export function Preview() {
  const navigate = useNavigate()
  const state = useMerge()
  const [modal, setModal] = useState(false)
  const [showMatching, setShowMatching] = useState(false)
  const matchingProps = { showMatching, onToggleMatching: () => setShowMatching((v) => !v) }
  const close = useCallback(() => setModal(false), [])
  const [about, setAbout] = useState(false)
  const closeAbout = useCallback(() => setAbout(false), [])

  const air = channelRows('airbnb', state)
  const book = channelRows('booking', state)
  const direct = directRows(state)
  const count = (rows: FieldRow[]) => rows.filter((r) => r.status === 'changed').length

  const channelHead = (platform: 'airbnb' | 'booking', rows: FieldRow[]) => {
    const n = count(rows)
    return (
      <>
        <div className="pc-logo">
          <PlatformMark platform={platform} size="card" />
        </div>
        <span className="meta">
          {n > 0 ? <span className="chip warn">Goes live right away</span> : <span className="chip neutral">Stays as it is</span>}
          <span className="muted" style={{ fontSize: 13 }}>
            {changesLabel(n)}
          </span>
        </span>
      </>
    )
  }

  const backToReview = () =>
    navigate(state.lead === 'fields' ? `/merge/review/${FIELD_SLUG[VARIANT_CONFIG[state.variant].fields[0]]}` : '/merge/combine')

  return (
    <>
      <div className="page">
        <h1 className="page-title">Preview every listing before it goes live</h1>
        <p className="page-lead">
          This is exactly what guests will see on each channel, including the fields that are not changing.
        </p>

        <div className="preview-cols">
          <ListingColumn label="Airbnb" head={channelHead('airbnb', air)} rows={air} {...matchingProps} />
          <ListingColumn label="Booking.com" head={channelHead('booking', book)} rows={book} {...matchingProps} />
          <ListingColumn
            label="Hospitable Direct Booking"
            head={
              <>
                <div className="pc-logo">
                  <HospitableWordmark />
                  <span className="chip purple-soft">New listing</span>
                </div>
                <h2>Your direct booking site</h2>
                <span className="meta">
                  <button type="button" className="link-btn with-icon" onClick={() => setAbout(true)}>
                    <Icon.Help width={15} height={15} />
                    What is this?
                  </button>
                </span>
              </>
            }
            rows={direct}
            {...matchingProps}
          />
        </div>
      </div>

      <div className="footer-bar">
        <button type="button" className="btn" onClick={backToReview}>
          Back to review
        </button>
        <span className="group">
          <span className="footer-note">Updates Airbnb, Booking.com and your direct booking site</span>
          <button type="button" className="btn primary" onClick={() => setModal(true)}>
            Apply changes
          </button>
        </span>
      </div>

      {about && (
        <Modal
          title="What is a direct booking site?"
          onClose={closeAbout}
          actions={
            <button type="button" className="btn primary" onClick={closeAbout}>
              Got it
            </button>
          }
        >
          <div className="dialog-row">
            <span className="icon-tile">
              <Icon.Cursor />
            </span>
            <div>
              <h3>Your own booking website</h3>
              <p>
                Hospitable gives this property a listing on your own direct booking site, so guests can book with you
                without going through Airbnb or Booking.com.
              </p>
            </div>
          </div>
          <div className="dialog-row">
            <span className="icon-tile">
              <Icon.Sparkle />
            </span>
            <div>
              <h3>Built from your choices</h3>
              <p>
                Based on what you chose for your two listings, Hospitable picks the best version of each field, like
                the title, description and photos, to show on your direct booking site.
              </p>
            </div>
          </div>
          <div className="dialog-row">
            <span className="icon-tile">
              <Icon.Settings />
            </span>
            <div>
              <h3>You stay in control</h3>
              <p>You can edit or turn off your direct booking site at any time from Direct bookings.</p>
            </div>
          </div>
        </Modal>
      )}

      {modal && (
        <Modal
          title="Good to know before you publish"
          onClose={close}
          actions={
            <>
              <button type="button" className="btn" onClick={close}>
                Cancel
              </button>
              <button
                type="button"
                className="btn primary"
                onClick={() => {
                  state.publish()
                  navigate('/properties')
                }}
              >
                Publish changes
              </button>
            </>
          }
        >
          <div className="dialog-row">
            <span className="icon-tile">
              <Icon.Upload />
            </span>
            <div>
              <h3>What happens now</h3>
              <p>Your changes go live on both platforms, Airbnb and Booking.com.</p>
            </div>
          </div>
          <div className="dialog-row">
            <span className="icon-tile">
              <Icon.ShieldCheck />
            </span>
            <div>
              <h3>From here on</h3>
              <p>
                Hospitable is the one place to manage your bookings and your listing content. Edits made directly on
                Airbnb or Booking.com may be locked or overwritten.
              </p>
            </div>
          </div>
          <div className="dialog-row">
            <span className="icon-tile">
              <Icon.Undo />
            </span>
            <div>
              <h3>If you change your mind</h3>
              <p>You can always unmerge these two listings in the properties panel.</p>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
