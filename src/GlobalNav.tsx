import { site } from './site.config'
import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sun, Moon, House, ChevronRight, Palette } from 'lucide-react'
import { getPageTitles, getSectionLabels } from './articles/registry'

/**
 * GlobalNav — unified navigation across all pages.
 *
 * The translucent bar is a "contextual message container" that appears
 * when there's something to communicate:
 * - Inner pages: permanent "← <domain>" back link
 * - Any page: temporary language suggestion when browser lang ≠ page lang
 *
 * Language suggestion is right-aligned, next to the lang pill, reinforcing
 * the connection. Controls always live inside the bar when it's visible;
 * when there's no bar (home, no banner), controls float fixed at top-6 right-6.
 */

const PAGE_TITLE = getPageTitles()
const SECTION_LABELS = getSectionLabels()

/** Observes h2[id] elements and returns the currently visible section ID */
function useActiveSection(pathname: string, enabled: boolean) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    setActiveId(null)
    if (!enabled) return

    let io: IntersectionObserver | null = null
    let mo: MutationObserver | null = null

    function setup() {
      const h1 = document.querySelector('h1')
      const headings = Array.from(document.querySelectorAll('h2[id]'))
      if (headings.length === 0) return false

      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              if (entry.target.tagName === 'H1') {
                setActiveId(null)
                return
              }
              setActiveId(entry.target.id)
              return
            }
          }
        },
        { rootMargin: '-64px 0px -75% 0px' }
      )

      if (h1) io.observe(h1)
      headings.forEach((h) => io!.observe(h))
      return true
    }

    // Try immediately (component may already be rendered)
    if (!setup()) {
      // Lazy component not mounted yet — watch for h2[id] to appear
      mo = new MutationObserver(() => {
        if (setup()) mo!.disconnect()
      })
      mo.observe(document.body, { childList: true, subtree: true })
    }

    return () => {
      io?.disconnect()
      mo?.disconnect()
    }
  }, [pathname, enabled])

  return activeId
}

function useLang() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const lang = 'en' as const
  const pageTitle = PAGE_TITLE[pathname] ?? null
  return { pathname, isHome, lang, pageTitle }
}

/** Color palettes defined as CSS profiles in index.css. Adding a new one:
 *  write its variable block in index.css, then register it here — the
 *  switcher and the boot script in index.html key off the `palette`
 *  localStorage entry. `darkOnly` palettes force dark mode on selection. */
const PALETTES = [
  { id: 'cyber', label: 'Cyber', className: null, darkOnly: false, swatch: ['#22c3dd', '#a855f7'] },
  { id: 'warm', label: 'Warm', className: 'theme-warm', darkOnly: false, swatch: ['#f97316', '#0d9488'] },
  { id: 'minimalism', label: 'Warm Minimalism', className: 'theme-minimalism', darkOnly: false, swatch: ['#e07a5f', '#6f4e37'] },
  { id: 'oasis', label: 'Digital Oasis', className: 'theme-oasis', darkOnly: false, swatch: ['#a8dadc', '#e76f51'] },
  { id: 'sorbet', label: 'Electric Sorbet', className: 'theme-sorbet', darkOnly: false, swatch: ['#ff3d5a', '#32dffc'] },
  { id: 'blueprint', label: 'Blueprint', className: 'theme-blueprint', darkOnly: true, swatch: ['#00e0ff', '#27272a'] },
] as const
type PaletteId = (typeof PALETTES)[number]['id']

/** Disable all transitions, apply a class swap, re-enable after repaint —
 *  keeps theme/palette switches instant with no half-transitioned frames. */
function applyInstantly(apply: () => void) {
  document.documentElement.style.setProperty('--theme-transition', 'none')
  document.querySelectorAll('*').forEach(el => {
    (el as HTMLElement).style.transition = 'none'
  })

  apply()

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.style.removeProperty('--theme-transition')
      document.querySelectorAll('*').forEach(el => {
        (el as HTMLElement).style.transition = ''
      })
    })
  })
}

function useTheme() {
  const [isDark, setIsDark] = useState(true)
  const [palette, setPaletteState] = useState<PaletteId>('cyber')

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
    const saved = localStorage.getItem('palette')
    if (PALETTES.some(p => p.id === saved)) setPaletteState(saved as PaletteId)
  }, [])

  useEffect(() => {
    if (localStorage.getItem('theme')) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      setIsDark(e.matches)
      document.documentElement.classList.toggle('dark', e.matches)
      document.documentElement.classList.toggle('light', !e.matches)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggleTheme = useCallback(() => {
    applyInstantly(() => {
      const next = !isDark
      setIsDark(next)
      document.documentElement.classList.toggle('dark', next)
      document.documentElement.classList.toggle('light', !next)
      localStorage.setItem('theme', next ? 'dark' : 'light')
    })
  }, [isDark])

  const setPalette = useCallback((id: PaletteId) => {
    applyInstantly(() => {
      const h = document.documentElement
      const target = PALETTES.find(p => p.id === id)!
      for (const p of PALETTES) {
        if (p.className) h.classList.toggle(p.className, p.id === id)
      }
      localStorage.setItem('palette', id)
      setPaletteState(id)
      // Dark-only palettes (no light variables defined) force dark mode
      if (target.darkOnly && !h.classList.contains('dark')) {
        h.classList.add('dark')
        h.classList.remove('light')
        localStorage.setItem('theme', 'dark')
        setIsDark(true)
      }
    })
  }, [])

  return { isDark, toggleTheme, palette, setPalette }
}

function PaletteMenu({ palette, setPalette }: { palette: PaletteId; setPalette: (id: PaletteId) => void }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shadow-lg hover:border-primary/50 hover:shadow-primary/20 hover:shadow-xl transition-colors"
        aria-label="Switch color palette"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Palette className="w-5 h-5 text-primary" aria-hidden="true" />
      </button>
      {open && (
        <div
          role="menu"
          aria-label="Color palettes"
          className="absolute right-0 top-12 w-52 rounded-xl bg-card border border-border shadow-xl p-1.5 flex flex-col gap-0.5"
          style={{ animation: 'nav-fade-in 0.2s ease-out' }}
        >
          {PALETTES.map(p => (
            <button
              key={p.id}
              role="menuitemradio"
              aria-checked={palette === p.id}
              onClick={() => { setPalette(p.id); setOpen(false) }}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                palette === p.id
                  ? 'bg-primary/10 text-foreground font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <span className="flex -space-x-1" aria-hidden="true">
                {p.swatch.map(c => (
                  <span key={c} className="w-3.5 h-3.5 rounded-full border border-border" style={{ backgroundColor: c }} />
                ))}
              </span>
              {p.label}
              {p.darkOnly && <span className="ml-auto text-xs opacity-60">dark</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function NavControls({ isDark, toggleTheme, palette, setPalette }: {
  isDark: boolean
  toggleTheme: () => void
  palette: PaletteId
  setPalette: (id: PaletteId) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <PaletteMenu palette={palette} setPalette={setPalette} />
      <button
        onClick={toggleTheme}
        className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shadow-lg hover:border-primary/50 hover:shadow-primary/20 hover:shadow-xl transition-colors"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? <Sun className="w-5 h-5 text-primary" aria-hidden="true" /> : <Moon className="w-5 h-5 text-primary" aria-hidden="true" />}
      </button>
    </div>
  )
}

export default function GlobalNav() {
  const { pathname, isHome, pageTitle } = useLang()
  const { isDark, toggleTheme, palette, setPalette } = useTheme()
  const activeSection = useActiveSection(pathname, !isHome)

  const hasBar = !isHome

  // Breadcrumb: show active section label or fall back to page title
  const sectionLabels = SECTION_LABELS[pathname]
  const activeSectionLabel = activeSection && sectionLabels?.[activeSection]


  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])

  // Animation tracking — bar and back link animate only on first appearance
  const barShown = useRef(false)
  const animateBar = hasBar && !barShown.current
  if (hasBar) barShown.current = true

  const backLinkShown = useRef(false)
  const animateBackLink = !isHome && !backLinkShown.current
  if (!isHome) backLinkShown.current = true

  const controls = <NavControls isDark={isDark} toggleTheme={toggleTheme} palette={palette} setPalette={setPalette} />

  const fade = (duration: string) => ({ animation: `nav-fade-in ${duration} ease-out` })


  // Bar visible: controls (+ optional banner) inside it
  if (hasBar) {
    return (
      <div className="sticky top-0 z-50 relative">
        <div
          className="absolute inset-0 bg-background/80 backdrop-blur-md border-b border-border"
          style={animateBar ? fade('0.35s') : undefined}
        />
        <div className="relative pt-4 pb-3 px-6 pl-14 xl:pl-6 flex items-center justify-between">
          {/* Left: back link on inner pages, empty on home (pl-14 leaves room for ToC hamburger on mobile) */}
          <div className="min-w-0 flex items-center">
            {!isHome && (
              <nav
                aria-label="Breadcrumb"
                className="inline-flex items-center gap-1.5 text-sm"
                style={animateBackLink ? fade('0.4s') : undefined}
              >
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors shrink-0"
                >
                  <House className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{site.domain}</span>
                </Link>
                {pageTitle && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" aria-hidden="true" />
                    <button
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className={`hover:text-foreground transition-colors cursor-pointer truncate ${activeSectionLabel ? 'text-muted-foreground' : 'text-foreground font-medium'}`}
                    >
                      {pageTitle}
                    </button>
                  </>
                )}
                {activeSectionLabel && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0 hidden sm:block" aria-hidden="true" />
                    <span className="text-foreground font-medium truncate max-w-[140px] sm:max-w-none hidden sm:inline">
                      {activeSectionLabel}
                    </span>
                  </>
                )}
              </nav>
            )}
          </div>
          {/* Right: banner + controls on same line */}
          <div className="flex items-center gap-3 shrink-0">
            {controls}
          </div>
        </div>
      </div>
    )
  }

  // Home: controls always fixed at same position, banner bar grows behind them
  if (!hydrated) return null

  return (
    <>
      {/* Translucent bar — appears/disappears without moving controls */}
      {/* Controls + banner — always at same fixed position */}
      <div className="fixed top-4 right-6 z-50 flex items-center gap-3">
        {controls}
      </div>
    </>
  )
}
