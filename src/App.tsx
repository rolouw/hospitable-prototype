import { useEffect, useState } from 'react'
import { Link, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { Combine } from './routes/Combine'
import { FieldReview } from './routes/FieldReview'
import { Match } from './routes/Match'
import { Preview } from './routes/Preview'
import { Properties } from './routes/Properties'
import { Setup } from './routes/Setup'
import { Splash } from './routes/Splash'
import { useMerge } from './state/merge'

/** Handles ?reset=1 and ?variant=single|full on any route, then drops the query */
function QueryControls() {
  const location = useLocation()
  const navigate = useNavigate()
  const reset = useMerge((s) => s.reset)
  const setVariant = useMerge((s) => s.setVariant)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (!params.has('reset') && !params.has('variant')) return
    let path = location.pathname
    if (params.has('reset')) {
      reset()
      path = path === '/setup' ? '/setup' : '/properties'
    }
    const v = params.get('variant')
    if (v === 'single' || v === 'full') setVariant(v)
    navigate(path, { replace: true })
  }, [location.search, location.pathname, navigate, reset, setVariant])

  return null
}

const SCREENS = [
  ['Start screen', '/'],
  ['Set up and grow', '/setup'],
  ['8a / 8j Properties', '/properties'],
  ['8b Match', '/merge/match'],
  ['8c Combine', '/merge/combine'],
  ['8d Title', '/merge/review/title'],
  ['8e Description', '/merge/review/description'],
  ['8f Cleaning fee', '/merge/review/fee'],
  ['8g Photos', '/merge/review/photos'],
  ['8h Preview', '/merge/preview'],
] as const

/** Hidden presenter panel, toggled with the ` key */
function PrototypePanel() {
  const [open, setOpen] = useState(false)
  const variant = useMerge((s) => s.variant)
  const navigate = useNavigate()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t.closest('input, textarea')) return
      if (e.key === '`') setOpen((o) => !o)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  if (!open) return null
  return (
    <div className="proto" role="region" aria-label="Prototype controls">
      <h2>Prototype</h2>
      {SCREENS.filter(([, to]) => variant === 'full' || !/description|fee|photos/.test(to)).map(([label, to]) => (
        <Link key={to} to={to} onClick={() => setOpen(false)}>
          {label}
        </Link>
      ))}
      <div className="row">
        <button
          type="button"
          className="btn"
          onClick={() => navigate(`/merge/review/title?variant=${variant === 'full' ? 'single' : 'full'}`)}
        >
          {variant === 'full' ? 'Single conflict' : 'Four conflicts'}
        </button>
        <button type="button" className="btn" onClick={() => navigate('/properties?reset=1')}>
          Reset
        </button>
      </div>
    </div>
  )
}

function Shell() {
  return (
    <div className="app">
      <Sidebar />
      <div className="panel">
        <Outlet />
      </div>
      <QueryControls />
      <PrototypePanel />
    </div>
  )
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route element={<Shell />}>
        <Route path="/setup" element={<Setup />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/merge/match" element={<Match />} />
        <Route path="/merge/combine" element={<Combine />} />
        <Route path="/merge/review/:slug" element={<FieldReview />} />
        <Route path="/merge/preview" element={<Preview />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
