import { ReactNode, useEffect } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { highlightDiff } from '../components/diff'
import { Icon } from '../components/Icons'
import { OptionCard, PhotoPicker, PhotoTile, PlatformMark } from '../components/ui'
import {
  AIRBNB_DESCRIPTION_LIMIT,
  AIRBNB_TITLE_LIMIT,
  FIELD_LABEL,
  FIELD_SLUG,
  FieldKey,
  PROPERTY_SHORT_NAME,
  Photo,
  Platform,
  VARIANT_CONFIG,
  getListings,
} from '../data/listings'
import { FieldChoice, SUGGESTED, isFieldReady, isStepDone, selectedPhotos, unionPhotos, useMerge } from '../state/merge'

type Choice = Exclude<FieldChoice, null>
type Option = { value: Choice; title: string; note?: string }

const SLUG_TO_FIELD = Object.fromEntries(Object.entries(FIELD_SLUG).map(([k, v]) => [v, k])) as Record<string, FieldKey>

/** 8d to 8g, and the single-conflict variant 8k */
export function FieldReview() {
  const { slug = 'title' } = useParams()
  const navigate = useNavigate()
  const state = useMerge()
  const { fields, setChoice, setCustom, setSelectedPhotos, markVisited } = state
  // A ?variant= in the URL wins on first render, before QueryControls has stored it
  const urlVariant = useSearchParams()[0].get('variant')
  const variant = urlVariant === 'single' || urlVariant === 'full' ? urlVariant : state.variant
  const config = VARIANT_CONFIG[variant]
  const field = SLUG_TO_FIELD[slug]
  const valid = !!field && config.fields.includes(field)

  useEffect(() => {
    if (valid) markVisited(field)
  }, [valid, field, markVisited])

  if (!valid) return <Navigate to={`/merge/review/${FIELD_SLUG[config.fields[0]]}`} replace />

  const listings = getListings(variant)
  const A = listings.airbnb
  const B = listings.booking
  const index = config.fields.indexOf(field)
  const isLast = index === config.fields.length - 1
  const next = config.fields[index + 1]
  const prev = config.fields[index - 1]
  const choice = fields[field].choice as FieldChoice
  const custom = field === 'title' || field === 'description' ? fields[field].custom : ''
  const ready = isFieldReady(fields, field)
  const doneCount = config.fields.filter((f) => isStepDone(state, f)).length
  const showOriginals = choice === null || choice === 'keep'

  /* ----- Per-field content ----- */

  let subtitle = 'Differences are highlighted. Choose what each platform should show.'
  let options: Option[] = []
  let preview: Record<Platform, { count: string; over?: boolean; body: ReactNode }>
  let extra: ReactNode = null
  let expand: ReactNode = null

  if (field === 'title' || field === 'description') {
    const limit = field === 'title' ? AIRBNB_TITLE_LIMIT : AIRBNB_DESCRIPTION_LIMIT
    const noun = field === 'title' ? 'title' : 'description'
    const [hA, hB] = highlightDiff(A[field], B[field])
    const resolved = (p: Platform): string =>
      choice === 'airbnb' ? A[field] : choice === 'booking' ? B[field] : choice === 'mix' ? custom : listings[p][field]
    const body = (p: Platform): ReactNode => {
      if (showOriginals) return p === 'airbnb' ? hA : hB
      if (choice === 'mix' && !custom.trim()) return <span className="placeholder">Your new {noun} appears here</span>
      return resolved(p)
    }
    const aLen = resolved('airbnb').length
    preview = {
      airbnb: { count: `${aLen} of ${limit} characters`, over: aLen > limit, body: body('airbnb') },
      booking: { count: `${resolved('booking').length} characters`, body: body('booking') },
    }
    options = [
      { value: 'airbnb', title: "Use Airbnb's on both" },
      {
        value: 'booking',
        title: "Use Booking.com's on both",
        note: B[field].length > limit ? `${B[field].length} characters. Airbnb allows ${limit}` : undefined,
      },
      { value: 'mix', title: 'Write a new combined version' },
      { value: 'keep', title: 'Keep different per channel', note: 'Nothing changes' },
    ]
    const len = custom.length
    const inputId = `new-${field}`
    const Control = field === 'title' ? 'input' : 'textarea'
    expand = (
      <div className="field-input">
        <label htmlFor={inputId}>New {noun}</label>
        <Control
          id={inputId}
          {...(field === 'title' ? { type: 'text' } : { rows: 4 })}
          value={custom}
          placeholder={`Enter the ${noun} both platforms will use`}
          aria-describedby={`${inputId}-meta`}
          aria-invalid={len > limit || undefined}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setCustom(field, e.target.value)}
        />
        <div className="meta" id={`${inputId}-meta`}>
          <span className={len > limit ? 'warn' : undefined} aria-live="polite">
            {len > limit ? `${len} characters. Airbnb allows ${limit}` : `${len} of ${limit} characters`}
          </span>
          {custom !== SUGGESTED[field] && (
            <button type="button" className="link-btn with-icon" onClick={() => setCustom(field, SUGGESTED[field])}>
              <Icon.Sparkle width={15} height={15} />
              Start from our suggestion
            </button>
          )}
        </div>
      </div>
    )
  } else if (field === 'cleaningFee') {
    subtitle = 'Fees change what guests pay. Choose what each platform should charge.'
    const fee = (p: Platform) =>
      choice === 'airbnb' ? A.cleaningFee.amount : choice === 'booking' ? B.cleaningFee.amount : listings[p].cleaningFee.amount
    const body = (p: Platform) => (showOriginals ? <mark className="diff" style={{ color: 'inherit' }}>{fee(p)} EUR</mark> : `${fee(p)} EUR`)
    preview = {
      airbnb: { count: 'Cleaning fee', body: body('airbnb') },
      booking: { count: 'Cleaning fee', body: body('booking') },
    }
    extra = (
      <div className="callout">
        <b>We never pick a fee for you.</b>
        Fees change what guests pay, so there is no suggested version here.
      </div>
    )
    options = [
      { value: 'airbnb', title: "Use Airbnb's on both", note: `${A.cleaningFee.amount} EUR` },
      { value: 'booking', title: "Use Booking.com's on both", note: `${B.cleaningFee.amount} EUR` },
      { value: 'keep', title: 'Keep different per channel', note: 'Nothing changes' },
    ]
  } else {
    subtitle = 'Choose which photos each platform should show.'
    const union = unionPhotos(A.photos, B.photos)
    const picked = selectedPhotos(fields)
    const set = (p: Platform): Photo[] =>
      choice === 'airbnb' ? A.photos : choice === 'booking' ? B.photos : choice === 'mix' ? picked : listings[p].photos
    const tiles = (p: Platform) =>
      choice === 'mix' && !picked.length ? (
        <div className="value">
          <span className="placeholder">The photos you pick appear here</span>
        </div>
      ) : (
        <div className="tiles">
          {set(p).map((ph, i) => (
            <PhotoTile key={ph.id} photo={ph} cover={i === 0} />
          ))}
        </div>
      )
    preview = {
      airbnb: { count: `${set('airbnb').length} photos`, body: tiles('airbnb') },
      booking: { count: `${set('booking').length} photos`, body: tiles('booking') },
    }
    options = [
      { value: 'airbnb', title: "Use Airbnb's set on both", note: `${A.photos.length} photos` },
      { value: 'booking', title: "Use Booking.com's set on both", note: `${B.photos.length} photos` },
      {
        value: 'mix',
        title: 'Pick photos for both',
        note: `Choose from all ${union.length} photos`,
      },
      { value: 'keep', title: 'Keep different per channel', note: 'Nothing changes' },
    ]
    const sources = (id: string) => {
      const inA = A.photos.some((x) => x.id === id)
      const inB = B.photos.some((x) => x.id === id)
      return inA && inB ? 'On both' : inA ? 'Airbnb only' : 'Booking.com only'
    }
    expand = (
      <PhotoPicker
        photos={union}
        selected={fields.photos.selected}
        onChange={setSelectedPhotos}
        caption={sources}
      />
    )
  }

  const nextLabel = isLast
    ? variant === 'single'
      ? 'Preview changes'
      : 'Next: Preview changes'
    : `Next: ${FIELD_LABEL[next]}`

  return (
    <>
      <header className="review-head">
        <h1>Review: {PROPERTY_SHORT_NAME}</h1>
        <div className="right">
          <span className="muted" aria-live="polite">
            {doneCount} of {config.fields.length} done
          </span>
          <Link to={state.entry} className="btn">
            Save and finish later
          </Link>
        </div>
      </header>

      <div className="review-body">
        <nav className="steps" aria-label="Fields to review">
          <ol>
            {config.fields.map((f, i) => {
              const done = isStepDone(state, f)
              const cur = f === field
              return (
                <li key={f}>
                  <Link
                    to={`/merge/review/${FIELD_SLUG[f]}`}
                    className={`step${cur ? ' cur' : ''}${done ? ' done' : ''}`}
                    aria-current={cur ? 'step' : undefined}
                  >
                    <span className="n" aria-hidden="true">
                      {done ? '✓' : i + 1}
                    </span>
                    {FIELD_LABEL[f]}
                    {done && <span className="sr-only">, done</span>}
                  </Link>
                </li>
              )
            })}
          </ol>
          <div className="steps-note">
            {config.matching} other fields already match. Calendars stay unsynced until you finish.
          </div>
        </nav>

        <main className="review-main" key={field}>
          <div>
            <h2 className="step-title">{FIELD_LABEL[field]}</h2>
            <p className="subtitle">{subtitle}</p>
          </div>

          <div className="preview-grid" aria-live="polite">
            {(['airbnb', 'booking'] as const).map((p) => (
              <section className="card preview-card" key={p} aria-label={`${p === 'airbnb' ? 'Airbnb' : 'Booking.com'} preview`}>
                <div className="head">
                  <PlatformMark platform={p} />
                  <span className={`count${preview[p].over ? ' over' : ''}`}>
                    {preview[p].over && <Icon.Warning width={14} height={14} style={{ verticalAlign: '-2px', marginRight: 4 }} />}
                    {preview[p].count}
                  </span>
                </div>
                {field === 'photos' ? (
                  preview[p].body
                ) : (
                  <div className={`value${field === 'cleaningFee' ? ' fee' : ''}`}>{preview[p].body}</div>
                )}
              </section>
            ))}
          </div>

          {extra}

          <fieldset className="radiogroup">
            <legend className="sr-only">{FIELD_LABEL[field]}</legend>
            {options.map((o) => (
              <OptionCard
                key={o.value}
                name={field}
                value={o.value}
                checked={choice === o.value}
                onSelect={() => setChoice(field, o.value)}
                title={o.title}
                note={o.note}
              >
                {o.value === 'mix' ? expand : null}
              </OptionCard>
            ))}
          </fieldset>
        </main>
      </div>

      <div className="footer-bar">
        <button
          type="button"
          className="btn"
          onClick={() => navigate(prev ? `/merge/review/${FIELD_SLUG[prev]}` : '/merge/combine')}
        >
          Back
        </button>
        <button
          type="button"
          className="btn primary"
          disabled={!ready}
          onClick={() => navigate(isLast ? '/merge/preview' : `/merge/review/${FIELD_SLUG[next]}`)}
        >
          {nextLabel}
        </button>
      </div>
    </>
  )
}
