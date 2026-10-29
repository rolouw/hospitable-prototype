import { ReactNode, useId } from 'react'
import { PLATFORM_NAME, Photo, Platform } from '../data/listings'
import { HospitableMark } from './Icons'

const LOGO_HEIGHT = { sm: 18, md: 20, card: 22, lg: 24 }

export function PlatformMark({ platform, size = 'md' }: { platform: Platform; size?: keyof typeof LOGO_HEIGHT }) {
  return (
    <img
      className="pmark"
      src={`${import.meta.env.BASE_URL}logos/${platform}.svg`}
      alt={PLATFORM_NAME[platform]}
      // Booking.com's wide wordmark reads larger than Airbnb's at equal height
      style={{ height: Math.round(LOGO_HEIGHT[size] * (platform === 'booking' ? 0.8 : 1)) }}
    />
  )
}

export function HospitableWordmark() {
  return (
    <span className="hosp-mark">
      <HospitableMark size={17} />
      hospitable
    </span>
  )
}

type OptionCardProps = {
  name: string
  value: string
  checked: boolean
  onSelect: () => void
  title: ReactNode
  note?: ReactNode
  /** Rendered above the title on large cards */
  top?: ReactNode
  large?: boolean
  /** Shown inside the card only while it is selected */
  children?: ReactNode
}

/**
 * Radio option card. Uses a native radio so arrow keys move between options,
 * and a wrapper rather than a button so it can hold an input when expanded.
 */
export function OptionCard({ name, value, checked, onSelect, title, note, top, large, children }: OptionCardProps) {
  const id = useId()
  return (
    <div className={`opt${large ? ' lg' : ''}${checked ? ' sel' : ''}`}>
      <label className="opt-label" htmlFor={id}>
        <input id={id} type="radio" name={name} value={value} checked={checked} onChange={onSelect} />
        <span className="radio" aria-hidden="true" />
        {large ? (
          <span style={{ minWidth: 0, flex: 1 }}>
            {top}
            <span className="opt-title">{title}</span>
            {note && <span className="opt-note">{note}</span>}
          </span>
        ) : (
          <span>
            <span className="opt-title">{title}</span>
            {note && <span className="opt-note"> {note}</span>}
          </span>
        )}
      </label>
      {checked && children && <div className="opt-body">{children}</div>}
    </div>
  )
}

export function PhotoTile({ photo, cover }: { photo: Photo; cover?: boolean }) {
  return (
    <div className="tile" style={{ background: photo.background }} role="img" aria-label={cover ? `${photo.label}, cover photo` : photo.label}>
      {cover && <span className="cover">Cover</span>}
    </div>
  )
}

type PhotoPickerProps = {
  photos: Photo[]
  /** Photo ids in the order picked. The first is the cover. */
  selected: string[]
  onChange: (selected: string[]) => void
  caption: (id: string) => string
}

export function PhotoPicker({ photos, selected, onChange, caption }: PhotoPickerProps) {
  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id])
  const allPicked = selected.length === photos.length

  return (
    <fieldset className="picker">
      <legend className="sr-only">Photos for both platforms</legend>
      <div className="picker-head">
        <span aria-live="polite">
          <b>
            {selected.length} of {photos.length} selected.
          </b>{' '}
          <span className="muted">The first photo you pick is the cover.</span>
        </span>
        <button
          type="button"
          className="link-btn"
          onClick={() =>
            onChange(allPicked ? [] : [...selected, ...photos.map((p) => p.id).filter((id) => !selected.includes(id))])
          }
        >
          {allPicked ? 'Clear all' : 'Select all'}
        </button>
      </div>
      <div className="picker-grid">
        {photos.map((p) => {
          const order = selected.indexOf(p.id)
          const on = order >= 0
          return (
            <label key={p.id} className={on ? 'pick on' : 'pick'}>
              <input type="checkbox" checked={on} onChange={() => toggle(p.id)} />
              <span className="pick-img" style={{ background: p.background }}>
                <span className="pick-check" aria-hidden="true">
                  {on ? order + 1 : ''}
                </span>
                {order === 0 && <span className="cover">Cover</span>}
              </span>
              <span className="pick-label">{p.label}</span>
              <span className="pick-src">{caption(p.id)}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export function Swatches({ photos }: { photos: Photo[] }) {
  return (
    <div aria-hidden="true">
      {photos.map((p, i) => (
        <span key={p.id} className={i === 0 ? 'sw cov' : 'sw'} style={{ background: p.background }} />
      ))}
    </div>
  )
}
