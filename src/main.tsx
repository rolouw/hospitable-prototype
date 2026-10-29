import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Hash URLs work on GitHub Pages, which has no server-side routing
import { HashRouter } from 'react-router-dom'
import { App } from './App'
import './styles/app.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
