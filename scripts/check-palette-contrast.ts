/**
 * check-palette-contrast — WCAG 2.2 contrast audit for the color profiles
 * defined in src/index.css.
 *
 * Parses the CSS variable blocks per theme, composes the effective light and
 * dark token sets the cascade produces, and checks the token pairings the
 * site actually renders (see PAIRS). Text pairs require 4.5:1 (AA normal
 * text — the hero gradient name link is 18px/600, below the large-text
 * threshold, so gradient endpoints are held to 4.5:1 too).
 *
 * Themes in ENFORCED fail the run (exit 1) on any failing pair; other
 * themes are report-only so the audit can't break the build on legacy
 * profiles that predate it.
 *
 * Usage:  npx tsx scripts/check-palette-contrast.ts
 */
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CSS_PATH = resolve(__dirname, '../src/index.css')

const ENFORCED = new Set(['minimalism', 'oasis', 'sorbet'])

interface ThemeSpec {
  id: string
  /** selectors merged in cascade order for light mode; null = theme has no light mode */
  light: string[] | null
  dark: string[]
}

const THEMES: ThemeSpec[] = [
  { id: 'cyber', light: [':root'], dark: [':root', '.dark'] },
  { id: 'warm', light: [':root', '.theme-warm'], dark: [':root', '.dark', '.theme-warm', '.theme-warm.dark'] },
  { id: 'minimalism', light: [':root', '.theme-minimalism'], dark: [':root', '.dark', '.theme-minimalism', '.theme-minimalism.dark'] },
  { id: 'oasis', light: [':root', '.theme-oasis'], dark: [':root', '.dark', '.theme-oasis', '.theme-oasis.dark'] },
  { id: 'sorbet', light: [':root', '.theme-sorbet'], dark: [':root', '.dark', '.theme-sorbet', '.theme-sorbet.dark'] },
  { id: 'blueprint', light: null, dark: [':root', '.dark', '.theme-blueprint.dark'] },
]

/** [foreground token, surface token, required ratio, where it renders] */
const PAIRS: Array<[string, string, number, string]> = [
  ['foreground', 'background', 4.5, 'body text'],
  ['foreground', 'card', 4.5, 'card text'],
  ['foreground', 'muted', 4.5, 'chat assistant bubble'],
  ['muted-foreground', 'background', 4.5, 'secondary text'],
  ['muted-foreground', 'card', 4.5, 'secondary text on cards'],
  ['primary', 'background', 4.5, 'links / text-primary'],
  ['primary', 'card', 4.5, 'links on cards'],
  ['accent', 'background', 4.5, 'text-accent'],
  ['accent', 'card', 4.5, 'text-accent on cards'],
  ['primary-foreground', 'primary', 4.5, 'primary buttons'],
  ['accent-foreground', 'accent', 4.5, 'accent chips'],
  ['gold', 'background', 4.5, 'text-gold stats'],
  ['gold', 'card', 4.5, 'text-gold on cards'],
  ['success', 'background', 4.5, 'text-success'],
  ['success', 'card', 4.5, 'text-success on cards'],
  ['tool', 'background', 4.5, 'text-tool'],
  ['tool', 'card', 4.5, 'text-tool on cards'],
  ['linkedin', 'background', 4.5, 'LinkedIn link'],
  ['gradient-from', 'background', 4.5, 'hero gradient text (18px/600)'],
  ['gradient-to', 'background', 4.5, 'hero gradient text (18px/600)'],
  ['gradient-fg', 'gradient-from', 4.5, 'chat bubble / CTA text on gradient'],
  ['gradient-fg', 'gradient-to', 4.5, 'chat bubble / CTA text on gradient'],
]

type Vars = Map<string, string>

function parseBlocks(css: string): Map<string, Vars> {
  const blocks = new Map<string, Vars>()
  // Match "selector { ... }" pairs; nested media queries are flattened by
  // matching inner blocks too, which is fine since we address selectors
  // like ".theme-x.dark" directly and treat the media variant as a mirror.
  const re = /([^{}]+)\{([^{}]*)\}/g
  let m: RegExpExecArray | null
  while ((m = re.exec(css))) {
    const selector = m[1].trim().split('\n').pop()!.trim()
    const body = m[2]
    const vars: Vars = blocks.get(selector) ?? new Map()
    const varRe = /--([\w-]+):\s*([^;]+);/g
    let v: RegExpExecArray | null
    while ((v = varRe.exec(body))) {
      vars.set(v[1], v[2].trim())
    }
    if (vars.size > 0) blocks.set(selector, vars)
  }
  return blocks
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100
  l /= 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const hp = (((h % 360) + 360) % 360) / 60
  const x = c * (1 - Math.abs((hp % 2) - 1))
  let rgb: [number, number, number]
  if (hp < 1) rgb = [c, x, 0]
  else if (hp < 2) rgb = [x, c, 0]
  else if (hp < 3) rgb = [0, c, x]
  else if (hp < 4) rgb = [0, x, c]
  else if (hp < 5) rgb = [x, 0, c]
  else rgb = [c, 0, x]
  const mm = l - c / 2
  return [rgb[0] + mm, rgb[1] + mm, rgb[2] + mm]
}

function luminance([r, g, b]: [number, number, number]): number {
  const lin = (u: number) => (u <= 0.04045 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4))
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function parseHslTriplet(value: string): [number, number, number] | null {
  // "26 100% 95%" — ignore values carrying "/ alpha" (decorative tokens)
  const m = value.match(/^([\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/)
  if (!m) return null
  return [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])]
}

function contrast(a: string, b: string): number | null {
  const ha = parseHslTriplet(a)
  const hb = parseHslTriplet(b)
  if (!ha || !hb) return null
  const la = luminance(hslToRgb(...ha))
  const lb = luminance(hslToRgb(...hb))
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

function compose(blocks: Map<string, Vars>, selectors: string[]): Vars {
  const out: Vars = new Map()
  for (const sel of selectors) {
    const vars = blocks.get(sel)
    if (!vars) continue
    for (const [k, v] of vars) out.set(k, v)
  }
  return out
}

function checkMode(id: string, mode: string, vars: Vars): { failures: string[]; checked: number } {
  const failures: string[] = []
  let checked = 0
  for (const [fgTok, bgTok, min, where] of PAIRS) {
    const fg = vars.get(fgTok)
    const bg = vars.get(bgTok)
    if (!fg || !bg) continue
    const ratio = contrast(fg, bg)
    if (ratio === null) continue
    checked++
    const label = `${fgTok} on ${bgTok}`
    if (ratio < min) {
      failures.push(`    ✗ ${label}: ${ratio.toFixed(2)} < ${min} (${where}) [${fg} on ${bg}]`)
    } else if (process.env.VERBOSE) {
      console.log(`    ✓ ${label}: ${ratio.toFixed(2)} (${where})`)
    }
  }
  return { failures, checked }
}

function main() {
  const css = readFileSync(CSS_PATH, 'utf-8')
  const blocks = parseBlocks(css)

  // Sync check: the @media dark mirror (.theme-x:not(.light)) must carry the
  // same values as .theme-x.dark, or system-dark and toggled-dark diverge.
  const syncErrors: string[] = []
  for (const t of THEMES) {
    const mirror = blocks.get(`.${'theme-' + t.id}:not(.light)`)
    const explicit = blocks.get(`.theme-${t.id}.dark`)
    if (mirror && explicit) {
      for (const [k, v] of explicit) {
        const mv = mirror.get(k)
        if (mv !== v) syncErrors.push(`  ${t.id}: --${k} is "${mv}" in @media mirror but "${v}" in .dark block`)
      }
      for (const k of mirror.keys()) {
        if (!explicit.has(k)) syncErrors.push(`  ${t.id}: --${k} only in @media mirror, missing from .dark block`)
      }
    }
  }

  let enforcedFailed = false
  for (const t of THEMES) {
    const modes: Array<[string, string[] | null]> = [['light', t.light], ['dark', t.dark]]
    for (const [mode, selectors] of modes) {
      if (!selectors) continue
      const vars = compose(blocks, selectors)
      const { failures, checked } = checkMode(t.id, mode, vars)
      const tag = ENFORCED.has(t.id) ? '' : ' (report-only)'
      if (failures.length === 0) {
        console.log(`  ✓ ${t.id} ${mode}: ${checked} pairs pass${tag}`)
      } else {
        console.log(`  ✗ ${t.id} ${mode}: ${failures.length}/${checked} pairs FAIL${tag}`)
        for (const f of failures) console.log(f)
        if (ENFORCED.has(t.id)) enforcedFailed = true
      }
    }
  }

  if (syncErrors.length > 0) {
    console.log('\n⚠ dark-mode mirror blocks out of sync:')
    for (const e of syncErrors) console.log(e)
    enforcedFailed = true
  }

  if (enforcedFailed) {
    console.log('\n❌ WCAG contrast check failed')
    process.exit(1)
  }
  console.log('\n✅ All enforced palettes pass WCAG 2.2 AA contrast')
}

main()
