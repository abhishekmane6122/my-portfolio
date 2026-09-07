import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './index.css'

/**
 * A deploy replaces every hashed chunk, so a tab opened before it (or one that
 * loads while GitHub Pages is still propagating) can request a chunk that 404s.
 * Mermaid is the usual casualty because it only pulls its layout engines in
 * when a diagram scrolls into view - long after the page loaded.
 *
 * Reload once to pick up the fresh manifest. The session flag stops a missing
 * chunk from turning into a reload loop.
 */
const RELOAD_FLAG = 'chunk-reload-attempted'

window.addEventListener('vite:preloadError', (event) => {
    if (sessionStorage.getItem(RELOAD_FLAG)) return
    event.preventDefault()
    sessionStorage.setItem(RELOAD_FLAG, '1')
    window.location.reload()
})

window.addEventListener('load', () => sessionStorage.removeItem(RELOAD_FLAG))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)
