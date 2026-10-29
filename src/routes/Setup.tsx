import { Icon } from '../components/Icons'
import { MergePrompt, MergedProperty } from '../components/MergePrompt'
import { PlatformMark } from '../components/ui'
import { useMerge } from '../state/merge'

/** Set up and grow, right after the host connects Airbnb and Booking.com. A second way into the merge flow. */
export function Setup() {
  const published = useMerge((s) => s.published)

  return (
    <div className="page setup">
      <h1 className="page-title">Set up and grow</h1>

      <section className="connected-banner" role="status" aria-labelledby="connected-title">
        <span className="icon-tile ok">
          <Icon.CheckCircle width={22} height={22} />
        </span>
        <div>
          <h2 id="connected-title">Congratulations, you've connected your two properties</h2>
          <p>
            {published
              ? 'Airbnb and Booking.com are connected to Hospitable, and their matching listings are now one property.'
              : 'Airbnb and Booking.com are connected to Hospitable. We noticed that 2 listings look like the same property.'}
          </p>
        </div>
      </section>

      <div className="setup-stack">{published ? <MergedProperty /> : <MergePrompt entry="/setup" />}</div>

      <section className="card setup-channels" aria-labelledby="channels-title">
        <h2 id="channels-title">Connected channels</h2>
        {(['airbnb', 'booking'] as const).map((p) => (
          <div className="channel-row" key={p}>
            <PlatformMark platform={p} />
            <span className="muted">1 listing</span>
            <span className="chip ok">Connected</span>
          </div>
        ))}
      </section>
    </div>
  )
}
