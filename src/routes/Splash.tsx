import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HospitableMark, Icon } from '../components/Icons'
import { useMerge } from '../state/merge'

/** Presenter start screen. Picks an entry point, or clears every choice to start over. */
export function Splash() {
  const navigate = useNavigate()
  const reset = useMerge((s) => s.reset)
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    if (!cleared) return
    const t = setTimeout(() => setCleared(false), 3200)
    return () => clearTimeout(t)
  }, [cleared])

  return (
    <main className="splash">
      <div className="splash-inner">
        <div className="splash-logo">
          <HospitableMark size={44} />
          <span>hospitable</span>
        </div>
        <p className="splash-sub">Merge duplicate listings prototype</p>

        <h1 className="sr-only">Choose where to start</h1>
        <div className="splash-options">
          <button type="button" className="splash-opt" onClick={() => navigate('/setup')}>
            <span className="splash-icon">
              <Icon.Grow />
            </span>
            <span className="splash-text">
              <b>Start from Set up and grow</b>
              <span>Right after the host connects Airbnb and Booking.com</span>
            </span>
            <Icon.Chevron width={16} height={16} />
          </button>
          <button type="button" className="splash-opt" onClick={() => navigate('/properties')}>
            <span className="splash-icon">
              <Icon.Properties />
            </span>
            <span className="splash-text">
              <b>Start from Properties</b>
              <span>From the prompt on the properties list</span>
            </span>
            <Icon.Chevron width={16} height={16} />
          </button>
          <button
            type="button"
            className="splash-opt subtle"
            onClick={() => {
              reset()
              setCleared(true)
            }}
          >
            <span className="splash-icon">
              <Icon.Undo />
            </span>
            <span className="splash-text">
              <b>Start from beginning</b>
              <span>Clear every choice made so far, then pick a starting point</span>
            </span>
          </button>
        </div>

        <p className="splash-status" role="status">
          {cleared ? 'All choices cleared. Pick a starting point.' : ''}
        </p>
      </div>
    </main>
  )
}
