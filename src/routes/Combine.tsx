import { useNavigate } from 'react-router-dom'
import { OptionCard, PlatformMark } from '../components/ui'
import { BOOKING_PROPERTY_NAME, FIELD_LABEL, VARIANT_CONFIG, getListings } from '../data/listings'
import { Lead, useMerge } from '../state/merge'

function listFields(labels: string[]) {
  if (labels.length <= 1) return labels.join('')
  return `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}`
}

/** 8c */
export function Combine() {
  const navigate = useNavigate()
  const lead = useMerge((s) => s.lead)
  const setLead = useMerge((s) => s.setLead)
  const variant = useMerge((s) => s.variant)
  const { fields, matching } = VARIANT_CONFIG[variant]
  const differ = fields.length
  const hasFee = fields.includes('cleaningFee')

  const what: Record<Lead, { title: string; points: string[]; result: string }> = {
    airbnb: {
      title: 'If Airbnb leads',
      points: [
        `Hospitable names the property after Airbnb: "${getListings('full').airbnb.title}", with the Airbnb cover photo.`,
        'Calendar, pricing and inbox merge into one for both platforms.',
        "Every field that differs takes Airbnb's version, except cleaning fee, which stays as it is on each channel.",
      ],
      result: 'Airbnb stays as it is. Booking.com may change.',
    },
    booking: {
      title: 'If Booking.com leads',
      points: [
        `Hospitable names the property after Booking.com: "${BOOKING_PROPERTY_NAME}", with the Booking.com cover photo.`,
        'Calendar, pricing and inbox merge into one for both platforms.',
        "Every field that differs takes Booking.com's version, except cleaning fee, which stays as it is on each channel.",
      ],
      result: 'Booking.com stays as it is. Airbnb may change.',
    },
    fields: {
      title: 'If you decide field by field',
      points: [
        `You see ${listFields(fields.map((f) => FIELD_LABEL[f]))} side by side, ${differ} ${
          differ === 1 ? 'field that differs' : 'fields that differ'
        } and ${matching} that match.`,
        "We recommend a Hospitable Direct Booking version written from both listings, but nothing is pre-selected. Pick it, either platform's, or keep each as it is.",
        ...(hasFee ? ['Cleaning fee is always your call. We never pick a fee for you.'] : []),
      ],
      result: 'Nothing changes on either platform until you preview.',
    },
  }
  const ex = what[lead]
  const isFields = lead === 'fields'

  return (
    <>
      <div className="page">
        <h1 className="page-title">How should we combine them?</h1>
        <p className="page-lead">
          Choose a lead listing as the foundation for every platform, or decide field by field. Nothing is published to
          Airbnb or Booking.com until you preview, and you can change the lead listing at any time in your property
          preferences.
        </p>

        <div className="combine">
          <fieldset className="radiogroup">
            <legend className="sr-only">How to combine</legend>
            <OptionCard
              large
              name="lead"
              value="airbnb"
              checked={lead === 'airbnb'}
              onSelect={() => setLead('airbnb')}
              top={<PlatformMark platform="airbnb" />}
              title={
                <>
                  Make Airbnb the lead listing <span className="chip purple small">Recommended</span>
                </>
              }
              note="Airbnb sets the property name and cover photo. Best when Airbnb is your main channel."
            />
            <OptionCard
              large
              name="lead"
              value="booking"
              checked={lead === 'booking'}
              onSelect={() => setLead('booking')}
              top={<PlatformMark platform="booking" />}
              title="Make Booking.com the lead listing"
              note="Booking.com sets the property name and cover photo."
            />
            <OptionCard
              large
              name="lead"
              value="fields"
              checked={lead === 'fields'}
              onSelect={() => setLead('fields')}
              title="Decide content field by field"
              note="Compare each field and choose what every platform shows."
            />
          </fieldset>

          <section className="card what" aria-live="polite" aria-labelledby="what-title">
            <div className="eyebrow">What happens</div>
            <div className="swap-in" key={lead}>
              <h2 id="what-title">{ex.title}</h2>
              <ul>
                {ex.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <div className="result">{ex.result}</div>
            </div>
          </section>
        </div>
      </div>

      <div className="footer-bar">
        <button type="button" className="btn" onClick={() => navigate('/merge/match')}>
          Back
        </button>
        <span className="group">
          <button
            type="button"
            className="btn primary"
            onClick={() => navigate(isFields ? '/merge/review/title' : '/merge/preview')}
          >
            {isFields ? 'Review differences' : 'Preview changes'}
          </button>
        </span>
      </div>
    </>
  )
}
