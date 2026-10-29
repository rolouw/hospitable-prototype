import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useMerge } from '../state/merge'
import { HospitableMark, Icon } from './Icons'

type Item = { label: string; icon: ReactNode; to?: string; chevron?: boolean }

const items: Item[] = [
  { label: 'Home', icon: <Icon.Home /> },
  { label: 'Inbox', icon: <Icon.Inbox /> },
  { label: 'Properties', icon: <Icon.Properties />, to: '/properties' },
  { label: 'Calendar', icon: <Icon.Calendar /> },
  { label: 'Guest experience', icon: <Icon.Heart />, chevron: true },
  { label: 'Metrics', icon: <Icon.Metrics /> },
  { label: 'Direct bookings', icon: <Icon.Cursor /> },
  { label: 'Devices', icon: <Icon.Wifi />, chevron: true },
  { label: 'Operations', icon: <Icon.Ops />, chevron: true },
]

export function Sidebar() {
  const collapsed = useMerge((s) => s.sidebarCollapsed)
  const toggle = useMerge((s) => s.toggleSidebar)
  const onSetup = useLocation().pathname === '/setup'

  return (
    <aside className={collapsed ? 'rail collapsed' : 'rail'}>
      <div className="rail-head">
        <Link to="/" className="rail-home" aria-label="Back to start screen">
          <HospitableMark />
          <span className="rail-wordmark">hospitable</span>
        </Link>
        <button
          type="button"
          className="rail-toggle"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
          onClick={toggle}
        >
          <Icon.Collapse />
        </button>
      </div>

      <button type="button" className="rail-search" aria-label="Search">
        <Icon.Search />
        <span className="label" style={{ flex: 1 }}>
          Search
        </span>
        <span className="kbd">⌘K</span>
      </button>

      <Link
        to="/setup"
        className="rail-item group-head"
        aria-current={onSetup ? 'page' : undefined}
        title={collapsed ? 'Set up and grow' : undefined}
      >
        <Icon.Grow />
        <span className="label">Set up and grow</span>
      </Link>

      <nav aria-label="Main">
        {items.map((it) => {
          const content = (
            <>
              {it.icon}
              <span className="label">{it.label}</span>
              {it.chevron && <Icon.Chevron className="chev" />}
            </>
          )
          const title = collapsed ? it.label : undefined
          return it.to ? (
            <Link key={it.label} to={it.to} className="rail-item" aria-current={!onSetup ? 'page' : undefined} title={title}>
              {content}
            </Link>
          ) : (
            <a key={it.label} href="#" className="rail-item" title={title} onClick={(e) => e.preventDefault()}>
              {content}
            </a>
          )
        })}
      </nav>

      <div className="rail-spacer" />

      <div className="rail-trial">
        <span className="t1">Mogul trial ends in 14 days</span>
        <span className="t2">Activate your subscription today.</span>
        <button type="button">Subscribe to a plan</button>
      </div>

      <div className="rail-foot">
        <span className="avatar" role="img" aria-label="Account" />
        <Icon.Sparkle role="img" aria-label="Assistant" aria-hidden={false} />
        <Icon.Help role="img" aria-label="Help" aria-hidden={false} />
        <Icon.Settings role="img" aria-label="Settings" aria-hidden={false} />
      </div>
    </aside>
  )
}
