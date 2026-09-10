# ET Figma variable handoff

This is the copy-ready parity contract for the etaylor.co token package. Copy every row into the named Figma collection and mode. Visible Figma variable names use slash paths; the first column is the exact JSON path used for automated parity checks.

## Collection setup

Create exactly these three variable collections:

1. `ET / Core` with one mode named `Value`.
2. `ET / Semantic` with modes named `Parchment` and `Aubergine`.
3. `ET / Component` with modes named `Parchment` and `Aubergine`.

Keep aliases as Figma variable aliases rather than copying resolved values. In the tables below, brace notation is the alias target. An unpopulated mode cell is a table placeholder.

## ET / Core

Mode: `Value`.

| Token Path | Figma Name | Value | Type |
|---|---|---:|---|
| `color.transparent` | `color/transparent` | #00000000 | color |
| `color.paper.50` | `color/paper/50` | #FBF6F0 | color |
| `color.paper.100` | `color/paper/100` | #F5EADC | color |
| `color.paper.200` | `color/paper/200` | #EADBCB | color |
| `color.paper.300` | `color/paper/300` | #D8C4B3 | color |
| `color.paper.400` | `color/paper/400` | #C9BBAE | color |
| `color.plum.300` | `color/plum/300` | #73676D | color |
| `color.plum.400` | `color/plum/400` | #665A61 | color |
| `color.plum.500` | `color/plum/500` | #5A4151 | color |
| `color.plum.600` | `color/plum/600` | #513A49 | color |
| `color.plum.700` | `color/plum/700` | #46313F | color |
| `color.plum.800` | `color/plum/800` | #382632 | color |
| `color.plum.900` | `color/plum/900` | #2D202A | color |
| `color.inverse.secondary` | `color/inverse/secondary` | #D9CCD4 | color |
| `color.inverse.tertiary` | `color/inverse/tertiary` | #C2B1BB | color |
| `color.inverse.border` | `color/inverse/border` | #6E5968 | color |
| `color.signal.research` | `color/signal/research` | #0095A0 | color |
| `color.signal.decide` | `color/signal/decide` | #009A46 | color |
| `color.signal.design` | `color/signal/design` | #CC6F00 | color |
| `color.signal.ship` | `color/signal/ship` | #F13737 | color |
| `color.status.parchment.info` | `color/status/parchment/info` | #2E6670 | color |
| `color.status.parchment.success` | `color/status/parchment/success` | #276443 | color |
| `color.status.parchment.warning` | `color/status/parchment/warning` | #875000 | color |
| `color.status.parchment.danger` | `color/status/parchment/danger` | #9B3035 | color |
| `color.status.aubergine.info` | `color/status/aubergine/info` | #8BCAD2 | color |
| `color.status.aubergine.success` | `color/status/aubergine/success` | #88D6A8 | color |
| `color.status.aubergine.warning` | `color/status/aubergine/warning` | #F3B848 | color |
| `color.status.aubergine.danger` | `color/status/aubergine/danger` | #F39A9D | color |
| `font.family.sans` | `font/family/sans` | Instrument Sans, system-ui, sans-serif | fontFamily |
| `font.family.display` | `font/family/display` | {font.family.sans} | fontFamily |
| `font.weight.regular` | `font/weight/regular` | 400 | fontWeight |
| `font.weight.medium` | `font/weight/medium` | 500 | fontWeight |
| `font.weight.semibold` | `font/weight/semibold` | 600 | fontWeight |
| `font.weight.heading` | `font/weight/heading` | 620 | fontWeight |
| `font.weight.display` | `font/weight/display` | 650 | fontWeight |
| `font.weight.bold` | `font/weight/bold` | 700 | fontWeight |
| `font.style.display.xl.fontFamily` | `font/style/display/xl/fontFamily` | Instrument Sans, system-ui, sans-serif | fontFamily |
| `font.style.display.xl.fontWeight` | `font/style/display/xl/fontWeight` | 650 | fontWeight |
| `font.style.display.xl.fontSize` | `font/style/display/xl/fontSize` | 64px | dimension |
| `font.style.display.xl.lineHeight` | `font/style/display/xl/lineHeight` | 64px | dimension |
| `font.style.display.xl.letterSpacing` | `font/style/display/xl/letterSpacing` | -0.045em | dimension |
| `font.style.display.xl.textCase` | `font/style/display/xl/textCase` | none | textCase |
| `font.style.display.lg.fontFamily` | `font/style/display/lg/fontFamily` | Instrument Sans, system-ui, sans-serif | fontFamily |
| `font.style.display.lg.fontWeight` | `font/style/display/lg/fontWeight` | 650 | fontWeight |
| `font.style.display.lg.fontSize` | `font/style/display/lg/fontSize` | 56px | dimension |
| `font.style.display.lg.lineHeight` | `font/style/display/lg/lineHeight` | 58px | dimension |
| `font.style.display.lg.letterSpacing` | `font/style/display/lg/letterSpacing` | -0.04em | dimension |
| `font.style.display.lg.textCase` | `font/style/display/lg/textCase` | none | textCase |
| `font.style.heading.xl.fontFamily` | `font/style/heading/xl/fontFamily` | Instrument Sans, system-ui, sans-serif | fontFamily |
| `font.style.heading.xl.fontWeight` | `font/style/heading/xl/fontWeight` | 620 | fontWeight |
| `font.style.heading.xl.fontSize` | `font/style/heading/xl/fontSize` | 40px | dimension |
| `font.style.heading.xl.lineHeight` | `font/style/heading/xl/lineHeight` | 44px | dimension |
| `font.style.heading.xl.letterSpacing` | `font/style/heading/xl/letterSpacing` | -0.035em | dimension |
| `font.style.heading.xl.textCase` | `font/style/heading/xl/textCase` | none | textCase |
| `font.style.heading.lg.fontFamily` | `font/style/heading/lg/fontFamily` | Instrument Sans, system-ui, sans-serif | fontFamily |
| `font.style.heading.lg.fontWeight` | `font/style/heading/lg/fontWeight` | 620 | fontWeight |
| `font.style.heading.lg.fontSize` | `font/style/heading/lg/fontSize` | 32px | dimension |
| `font.style.heading.lg.lineHeight` | `font/style/heading/lg/lineHeight` | 36px | dimension |
| `font.style.heading.lg.letterSpacing` | `font/style/heading/lg/letterSpacing` | -0.03em | dimension |
| `font.style.heading.lg.textCase` | `font/style/heading/lg/textCase` | none | textCase |
| `font.style.heading.md.fontFamily` | `font/style/heading/md/fontFamily` | Instrument Sans, system-ui, sans-serif | fontFamily |
| `font.style.heading.md.fontWeight` | `font/style/heading/md/fontWeight` | 600 | fontWeight |
| `font.style.heading.md.fontSize` | `font/style/heading/md/fontSize` | 24px | dimension |
| `font.style.heading.md.lineHeight` | `font/style/heading/md/lineHeight` | 28px | dimension |
| `font.style.heading.md.letterSpacing` | `font/style/heading/md/letterSpacing` | -0.02em | dimension |
| `font.style.heading.md.textCase` | `font/style/heading/md/textCase` | none | textCase |
| `font.style.heading.sm.fontFamily` | `font/style/heading/sm/fontFamily` | Instrument Sans, system-ui, sans-serif | fontFamily |
| `font.style.heading.sm.fontWeight` | `font/style/heading/sm/fontWeight` | 600 | fontWeight |
| `font.style.heading.sm.fontSize` | `font/style/heading/sm/fontSize` | 20px | dimension |
| `font.style.heading.sm.lineHeight` | `font/style/heading/sm/lineHeight` | 24px | dimension |
| `font.style.heading.sm.letterSpacing` | `font/style/heading/sm/letterSpacing` | -0.015em | dimension |
| `font.style.heading.sm.textCase` | `font/style/heading/sm/textCase` | none | textCase |
| `font.style.body.lg.fontFamily` | `font/style/body/lg/fontFamily` | Instrument Sans, system-ui, sans-serif | fontFamily |
| `font.style.body.lg.fontWeight` | `font/style/body/lg/fontWeight` | 400 | fontWeight |
| `font.style.body.lg.fontSize` | `font/style/body/lg/fontSize` | 18px | dimension |
| `font.style.body.lg.lineHeight` | `font/style/body/lg/lineHeight` | 28px | dimension |
| `font.style.body.lg.letterSpacing` | `font/style/body/lg/letterSpacing` | 0 | dimension |
| `font.style.body.lg.textCase` | `font/style/body/lg/textCase` | none | textCase |
| `font.style.body.md.fontFamily` | `font/style/body/md/fontFamily` | Instrument Sans, system-ui, sans-serif | fontFamily |
| `font.style.body.md.fontWeight` | `font/style/body/md/fontWeight` | 400 | fontWeight |
| `font.style.body.md.fontSize` | `font/style/body/md/fontSize` | 16px | dimension |
| `font.style.body.md.lineHeight` | `font/style/body/md/lineHeight` | 24px | dimension |
| `font.style.body.md.letterSpacing` | `font/style/body/md/letterSpacing` | 0 | dimension |
| `font.style.body.md.textCase` | `font/style/body/md/textCase` | none | textCase |
| `font.style.body.sm.fontFamily` | `font/style/body/sm/fontFamily` | Instrument Sans, system-ui, sans-serif | fontFamily |
| `font.style.body.sm.fontWeight` | `font/style/body/sm/fontWeight` | 400 | fontWeight |
| `font.style.body.sm.fontSize` | `font/style/body/sm/fontSize` | 14px | dimension |
| `font.style.body.sm.lineHeight` | `font/style/body/sm/lineHeight` | 20px | dimension |
| `font.style.body.sm.letterSpacing` | `font/style/body/sm/letterSpacing` | 0 | dimension |
| `font.style.body.sm.textCase` | `font/style/body/sm/textCase` | none | textCase |
| `font.style.label.fontFamily` | `font/style/label/fontFamily` | Instrument Sans, system-ui, sans-serif | fontFamily |
| `font.style.label.fontWeight` | `font/style/label/fontWeight` | 650 | fontWeight |
| `font.style.label.fontSize` | `font/style/label/fontSize` | 12px | dimension |
| `font.style.label.lineHeight` | `font/style/label/lineHeight` | 16px | dimension |
| `font.style.label.letterSpacing` | `font/style/label/letterSpacing` | 0 | dimension |
| `font.style.label.textCase` | `font/style/label/textCase` | none | textCase |
| `font.style.eyebrow.fontFamily` | `font/style/eyebrow/fontFamily` | Instrument Sans, system-ui, sans-serif | fontFamily |
| `font.style.eyebrow.fontWeight` | `font/style/eyebrow/fontWeight` | 700 | fontWeight |
| `font.style.eyebrow.fontSize` | `font/style/eyebrow/fontSize` | 11px | dimension |
| `font.style.eyebrow.lineHeight` | `font/style/eyebrow/lineHeight` | 16px | dimension |
| `font.style.eyebrow.letterSpacing` | `font/style/eyebrow/letterSpacing` | 0.12em | dimension |
| `font.style.eyebrow.textCase` | `font/style/eyebrow/textCase` | uppercase | textCase |
| `font.style.caption.fontFamily` | `font/style/caption/fontFamily` | Instrument Sans, system-ui, sans-serif | fontFamily |
| `font.style.caption.fontWeight` | `font/style/caption/fontWeight` | 450 | fontWeight |
| `font.style.caption.fontSize` | `font/style/caption/fontSize` | 11px | dimension |
| `font.style.caption.lineHeight` | `font/style/caption/lineHeight` | 16px | dimension |
| `font.style.caption.letterSpacing` | `font/style/caption/letterSpacing` | 0.01em | dimension |
| `font.style.caption.textCase` | `font/style/caption/textCase` | none | textCase |
| `space.0` | `space/0` | 0px | dimension |
| `space.1` | `space/1` | 4px | dimension |
| `space.2` | `space/2` | 8px | dimension |
| `space.3` | `space/3` | 12px | dimension |
| `space.4` | `space/4` | 16px | dimension |
| `space.5` | `space/5` | 20px | dimension |
| `space.6` | `space/6` | 24px | dimension |
| `space.8` | `space/8` | 32px | dimension |
| `space.10` | `space/10` | 40px | dimension |
| `space.12` | `space/12` | 48px | dimension |
| `space.16` | `space/16` | 64px | dimension |
| `space.20` | `space/20` | 80px | dimension |
| `space.24` | `space/24` | 96px | dimension |
| `space.32` | `space/32` | 128px | dimension |
| `layout.page.max` | `layout/page/max` | 1200px | dimension |
| `layout.reading.max` | `layout/reading/max` | 680px | dimension |
| `layout.edge.desktop` | `layout/edge/desktop` | 48px | dimension |
| `layout.edge.tablet` | `layout/edge/tablet` | 32px | dimension |
| `layout.edge.mobile` | `layout/edge/mobile` | 20px | dimension |
| `layout.section.desktop` | `layout/section/desktop` | 96px | dimension |
| `layout.section.tablet` | `layout/section/tablet` | 72px | dimension |
| `layout.section.mobile` | `layout/section/mobile` | 56px | dimension |
| `layout.grid.desktop.columns` | `layout/grid/desktop/columns` | 12 | number |
| `layout.grid.desktop.gutter` | `layout/grid/desktop/gutter` | 24px | dimension |
| `layout.grid.tablet.columns` | `layout/grid/tablet/columns` | 6 | number |
| `layout.grid.tablet.gutter` | `layout/grid/tablet/gutter` | 20px | dimension |
| `layout.grid.mobile.columns` | `layout/grid/mobile/columns` | 4 | number |
| `layout.grid.mobile.gutter` | `layout/grid/mobile/gutter` | 16px | dimension |
| `radius.none` | `radius/none` | 0px | dimension |
| `radius.control` | `radius/control` | 2px | dimension |
| `radius.tag` | `radius/tag` | 2px | dimension |
| `border.default` | `border/default` | 1px | dimension |
| `border.focus` | `border/focus` | 2px | dimension |
| `size.control.minimum` | `size/control/minimum` | 44px | dimension |
| `size.navigation.height` | `size/navigation/height` | 68px | dimension |
| `size.navigation.monogram` | `size/navigation/monogram` | 32px | dimension |
| `size.navigation.link-gap` | `size/navigation/link-gap` | 28px | dimension |
| `size.direction-band.sm.stripe-width` | `size/direction-band/sm/stripe-width` | 8px | dimension |
| `size.direction-band.sm.gap` | `size/direction-band/sm/gap` | 5px | dimension |
| `size.direction-band.sm.height` | `size/direction-band/sm/height` | 40px | dimension |
| `size.direction-band.md.stripe-width` | `size/direction-band/md/stripe-width` | 12px | dimension |
| `size.direction-band.md.gap` | `size/direction-band/md/gap` | 6px | dimension |
| `size.direction-band.md.height` | `size/direction-band/md/height` | 74px | dimension |
| `size.direction-band.lg.stripe-width` | `size/direction-band/lg/stripe-width` | 22px | dimension |
| `size.direction-band.lg.gap` | `size/direction-band/lg/gap` | 10px | dimension |
| `size.direction-band.lg.height` | `size/direction-band/lg/height` | 120px | dimension |
| `count.hero.actions` | `count/hero/actions` | 2 | number |
| `count.contact-cta.actions` | `count/contact-cta/actions` | 1 | number |
| `angle.direction-band` | `angle/direction-band` | 18deg | dimension |
| `shadow.overlay` | `shadow/overlay` | 0px 12px 32px 0px #2D202A26 | shadow |
| `texture.paper.opacity` | `texture/paper/opacity` | 0.04 | number |
| `texture.aubergine.opacity` | `texture/aubergine/opacity` | 0.025 | number |
| `motion.duration.fast` | `motion/duration/fast` | 120ms | duration |
| `motion.duration.standard` | `motion/duration/standard` | 220ms | duration |
| `motion.duration.deliberate` | `motion/duration/deliberate` | 360ms | duration |
| `motion.easing.standard` | `motion/easing/standard` | cubic-bezier(0.2, 0, 0, 1) | cubicBezier |

## ET / Semantic

Modes: `Parchment`, `Aubergine`.

| Token Path | Figma Name | Parchment | Aubergine | Type |
|---|---|---:|---:|---|
| `parchment.color.surface.canvas` | `color/surface/canvas` | {color.paper.100} | — | color |
| `parchment.color.surface.raised` | `color/surface/raised` | {color.paper.50} | — | color |
| `parchment.color.surface.subtle` | `color/surface/subtle` | {color.paper.200} | — | color |
| `parchment.color.text.primary` | `color/text/primary` | {color.plum.900} | — | color |
| `parchment.color.text.secondary` | `color/text/secondary` | {color.plum.400} | — | color |
| `parchment.color.text.tertiary` | `color/text/tertiary` | {color.plum.300} | — | color |
| `parchment.color.border.subtle` | `color/border/subtle` | {color.paper.400} | — | color |
| `parchment.color.border.strong` | `color/border/strong` | {color.plum.300} | — | color |
| `parchment.color.link.foreground` | `color/link/foreground` | {color.text.primary} | — | color |
| `parchment.color.link.decoration` | `color/link/decoration` | {color.text.primary} | — | color |
| `parchment.color.focus.ring` | `color/focus/ring` | {color.signal.research} | — | color |
| `parchment.color.action.primary.background` | `color/action/primary/background` | {color.plum.700} | — | color |
| `parchment.color.action.primary.foreground` | `color/action/primary/foreground` | {color.paper.100} | — | color |
| `parchment.color.action.primary.hover` | `color/action/primary/hover` | {color.plum.900} | — | color |
| `parchment.color.action.primary.active` | `color/action/primary/active` | {color.plum.800} | — | color |
| `parchment.color.action.disabled.background` | `color/action/disabled/background` | {color.paper.300} | — | color |
| `parchment.color.action.disabled.foreground` | `color/action/disabled/foreground` | {color.plum.300} | — | color |
| `parchment.color.action.secondary.background` | `color/action/secondary/background` | {color.transparent} | — | color |
| `parchment.color.action.secondary.foreground` | `color/action/secondary/foreground` | {color.text.primary} | — | color |
| `parchment.color.action.secondary.border` | `color/action/secondary/border` | {color.border.strong} | — | color |
| `parchment.color.selection.background` | `color/selection/background` | {color.paper.300} | — | color |
| `parchment.color.selection.foreground` | `color/selection/foreground` | {color.text.primary} | — | color |
| `parchment.color.status.info` | `color/status/info` | {color.status.parchment.info} | — | color |
| `parchment.color.status.success` | `color/status/success` | {color.status.parchment.success} | — | color |
| `parchment.color.status.warning` | `color/status/warning` | {color.status.parchment.warning} | — | color |
| `parchment.color.status.danger` | `color/status/danger` | {color.status.parchment.danger} | — | color |
| `aubergine.color.surface.canvas` | `color/surface/canvas` | — | {color.plum.700} | color |
| `aubergine.color.surface.raised` | `color/surface/raised` | — | {color.plum.600} | color |
| `aubergine.color.surface.subtle` | `color/surface/subtle` | — | {color.plum.500} | color |
| `aubergine.color.text.primary` | `color/text/primary` | — | {color.paper.100} | color |
| `aubergine.color.text.secondary` | `color/text/secondary` | — | {color.inverse.secondary} | color |
| `aubergine.color.text.tertiary` | `color/text/tertiary` | — | {color.inverse.tertiary} | color |
| `aubergine.color.border.subtle` | `color/border/subtle` | — | {color.inverse.border} | color |
| `aubergine.color.border.strong` | `color/border/strong` | — | {color.inverse.secondary} | color |
| `aubergine.color.link.foreground` | `color/link/foreground` | — | {color.text.primary} | color |
| `aubergine.color.link.decoration` | `color/link/decoration` | — | {color.text.primary} | color |
| `aubergine.color.focus.ring` | `color/focus/ring` | — | {color.signal.research} | color |
| `aubergine.color.action.primary.background` | `color/action/primary/background` | — | {color.paper.100} | color |
| `aubergine.color.action.primary.foreground` | `color/action/primary/foreground` | — | {color.plum.900} | color |
| `aubergine.color.action.primary.hover` | `color/action/primary/hover` | — | {color.paper.50} | color |
| `aubergine.color.action.primary.active` | `color/action/primary/active` | — | {color.paper.200} | color |
| `aubergine.color.action.disabled.background` | `color/action/disabled/background` | — | {color.plum.500} | color |
| `aubergine.color.action.disabled.foreground` | `color/action/disabled/foreground` | — | {color.inverse.tertiary} | color |
| `aubergine.color.action.secondary.background` | `color/action/secondary/background` | — | {color.transparent} | color |
| `aubergine.color.action.secondary.foreground` | `color/action/secondary/foreground` | — | {color.text.primary} | color |
| `aubergine.color.action.secondary.border` | `color/action/secondary/border` | — | {color.border.strong} | color |
| `aubergine.color.selection.background` | `color/selection/background` | — | {color.plum.500} | color |
| `aubergine.color.selection.foreground` | `color/selection/foreground` | — | {color.text.primary} | color |
| `aubergine.color.status.info` | `color/status/info` | — | {color.status.aubergine.info} | color |
| `aubergine.color.status.success` | `color/status/success` | — | {color.status.aubergine.success} | color |
| `aubergine.color.status.warning` | `color/status/warning` | — | {color.status.aubergine.warning} | color |
| `aubergine.color.status.danger` | `color/status/danger` | — | {color.status.aubergine.danger} | color |

## ET / Component

Modes: `Parchment`, `Aubergine`.

| Token Path | Figma Name | Parchment | Aubergine | Type |
|---|---|---:|---:|---|
| `parchment.navigation.background` | `navigation/background` | {color.surface.canvas} | — | color |
| `parchment.navigation.foreground` | `navigation/foreground` | {color.text.primary} | — | color |
| `parchment.navigation.active.underline` | `navigation/active/underline` | {color.text.primary} | — | color |
| `parchment.navigation.height` | `navigation/height` | {size.navigation.height} | — | dimension |
| `parchment.navigation.monogram.size` | `navigation/monogram/size` | {size.navigation.monogram} | — | dimension |
| `parchment.navigation.link.gap` | `navigation/link/gap` | {size.navigation.link-gap} | — | dimension |
| `parchment.button.primary.background` | `button/primary/background` | {color.action.primary.background} | — | color |
| `parchment.button.primary.foreground` | `button/primary/foreground` | {color.action.primary.foreground} | — | color |
| `parchment.button.primary.hover` | `button/primary/hover` | {color.action.primary.hover} | — | color |
| `parchment.button.primary.active` | `button/primary/active` | {color.action.primary.active} | — | color |
| `parchment.button.primary.disabled-background` | `button/primary/disabled-background` | {color.action.disabled.background} | — | color |
| `parchment.button.primary.disabled-foreground` | `button/primary/disabled-foreground` | {color.action.disabled.foreground} | — | color |
| `parchment.button.secondary.background` | `button/secondary/background` | {color.action.secondary.background} | — | color |
| `parchment.button.secondary.foreground` | `button/secondary/foreground` | {color.action.secondary.foreground} | — | color |
| `parchment.button.secondary.border` | `button/secondary/border` | {color.action.secondary.border} | — | color |
| `parchment.button.secondary.hover` | `button/secondary/hover` | {color.surface.subtle} | — | color |
| `parchment.button.secondary.disabled-background` | `button/secondary/disabled-background` | {color.action.disabled.background} | — | color |
| `parchment.button.secondary.disabled-foreground` | `button/secondary/disabled-foreground` | {color.action.disabled.foreground} | — | color |
| `parchment.button.tertiary.background` | `button/tertiary/background` | {color.action.secondary.background} | — | color |
| `parchment.button.tertiary.foreground` | `button/tertiary/foreground` | {color.link.foreground} | — | color |
| `parchment.button.tertiary.decoration` | `button/tertiary/decoration` | {color.link.decoration} | — | color |
| `parchment.button.shared.radius` | `button/shared/radius` | {radius.control} | — | dimension |
| `parchment.button.shared.padding-x` | `button/shared/padding-x` | {space.5} | — | dimension |
| `parchment.button.shared.min-height` | `button/shared/min-height` | {size.control.minimum} | — | dimension |
| `parchment.button.shared.focus-width` | `button/shared/focus-width` | {border.focus} | — | dimension |
| `parchment.button.shared.focus-offset` | `button/shared/focus-offset` | {border.focus} | — | dimension |
| `parchment.hero.background` | `hero/background` | {color.surface.canvas} | — | color |
| `parchment.hero.foreground` | `hero/foreground` | {color.text.primary} | — | color |
| `parchment.hero.headline.max-width` | `hero/headline/max-width` | {layout.reading.max} | — | dimension |
| `parchment.hero.action.max-count` | `hero/action/max-count` | {count.hero.actions} | — | number |
| `parchment.case-card.featured.background` | `case-card/featured/background` | {color.surface.raised} | — | color |
| `parchment.case-card.featured.foreground` | `case-card/featured/foreground` | {color.text.primary} | — | color |
| `parchment.case-card.featured.border` | `case-card/featured/border` | {color.border.subtle} | — | color |
| `parchment.case-card.featured.radius` | `case-card/featured/radius` | {radius.none} | — | dimension |
| `parchment.case-card.featured.padding` | `case-card/featured/padding` | {space.10} | — | dimension |
| `parchment.case-card.compact.background` | `case-card/compact/background` | {color.surface.canvas} | — | color |
| `parchment.case-card.compact.foreground` | `case-card/compact/foreground` | {color.text.primary} | — | color |
| `parchment.case-card.compact.border` | `case-card/compact/border` | {color.border.subtle} | — | color |
| `parchment.case-card.compact.radius` | `case-card/compact/radius` | {radius.none} | — | dimension |
| `parchment.case-card.compact.padding` | `case-card/compact/padding` | {space.8} | — | dimension |
| `parchment.evidence-frame.background` | `evidence-frame/background` | {color.surface.raised} | — | color |
| `parchment.evidence-frame.border` | `evidence-frame/border` | {color.border.strong} | — | color |
| `parchment.evidence-frame.radius` | `evidence-frame/radius` | {radius.none} | — | dimension |
| `parchment.decision-callout.background` | `decision-callout/background` | {color.surface.canvas} | — | color |
| `parchment.decision-callout.foreground` | `decision-callout/foreground` | {color.text.primary} | — | color |
| `parchment.decision-callout.padding-min` | `decision-callout/padding-min` | {space.8} | — | dimension |
| `parchment.decision-callout.padding-max` | `decision-callout/padding-max` | {space.10} | — | dimension |
| `parchment.evidence-note.background` | `evidence-note/background` | {color.surface.subtle} | — | color |
| `parchment.evidence-note.foreground` | `evidence-note/foreground` | {color.text.primary} | — | color |
| `parchment.evidence-note.border` | `evidence-note/border` | {color.border.subtle} | — | color |
| `parchment.evidence-note.padding-min` | `evidence-note/padding-min` | {space.5} | — | dimension |
| `parchment.evidence-note.padding-max` | `evidence-note/padding-max` | {space.6} | — | dimension |
| `parchment.metadata.foreground` | `metadata/foreground` | {color.text.tertiary} | — | color |
| `parchment.metadata.background` | `metadata/background` | {color.action.secondary.background} | — | color |
| `parchment.contact-cta.background` | `contact-cta/background` | {color.surface.canvas} | — | color |
| `parchment.contact-cta.foreground` | `contact-cta/foreground` | {color.text.primary} | — | color |
| `parchment.contact-cta.action.max-count` | `contact-cta/action/max-count` | {count.contact-cta.actions} | — | number |
| `parchment.footer.background` | `footer/background` | {color.surface.canvas} | — | color |
| `parchment.footer.foreground` | `footer/foreground` | {color.text.secondary} | — | color |
| `parchment.footer.border` | `footer/border` | {color.border.subtle} | — | color |
| `parchment.footer.padding-y` | `footer/padding-y` | {space.6} | — | dimension |
| `parchment.direction-band.angle` | `direction-band/angle` | {angle.direction-band} | — | dimension |
| `parchment.direction-band.research.color` | `direction-band/research/color` | {color.signal.research} | — | color |
| `parchment.direction-band.decide.color` | `direction-band/decide/color` | {color.signal.decide} | — | color |
| `parchment.direction-band.design.color` | `direction-band/design/color` | {color.signal.design} | — | color |
| `parchment.direction-band.ship.color` | `direction-band/ship/color` | {color.signal.ship} | — | color |
| `parchment.direction-band.sm.stripe-width` | `direction-band/sm/stripe-width` | {size.direction-band.sm.stripe-width} | — | dimension |
| `parchment.direction-band.sm.gap` | `direction-band/sm/gap` | {size.direction-band.sm.gap} | — | dimension |
| `parchment.direction-band.sm.height` | `direction-band/sm/height` | {size.direction-band.sm.height} | — | dimension |
| `parchment.direction-band.md.stripe-width` | `direction-band/md/stripe-width` | {size.direction-band.md.stripe-width} | — | dimension |
| `parchment.direction-band.md.gap` | `direction-band/md/gap` | {size.direction-band.md.gap} | — | dimension |
| `parchment.direction-band.md.height` | `direction-band/md/height` | {size.direction-band.md.height} | — | dimension |
| `parchment.direction-band.lg.stripe-width` | `direction-band/lg/stripe-width` | {size.direction-band.lg.stripe-width} | — | dimension |
| `parchment.direction-band.lg.gap` | `direction-band/lg/gap` | {size.direction-band.lg.gap} | — | dimension |
| `parchment.direction-band.lg.height` | `direction-band/lg/height` | {size.direction-band.lg.height} | — | dimension |
| `aubergine.navigation.background` | `navigation/background` | — | {color.surface.canvas} | color |
| `aubergine.navigation.foreground` | `navigation/foreground` | — | {color.text.primary} | color |
| `aubergine.navigation.active.underline` | `navigation/active/underline` | — | {color.text.primary} | color |
| `aubergine.navigation.height` | `navigation/height` | — | {size.navigation.height} | dimension |
| `aubergine.navigation.monogram.size` | `navigation/monogram/size` | — | {size.navigation.monogram} | dimension |
| `aubergine.navigation.link.gap` | `navigation/link/gap` | — | {size.navigation.link-gap} | dimension |
| `aubergine.button.primary.background` | `button/primary/background` | — | {color.action.primary.background} | color |
| `aubergine.button.primary.foreground` | `button/primary/foreground` | — | {color.action.primary.foreground} | color |
| `aubergine.button.primary.hover` | `button/primary/hover` | — | {color.action.primary.hover} | color |
| `aubergine.button.primary.active` | `button/primary/active` | — | {color.action.primary.active} | color |
| `aubergine.button.primary.disabled-background` | `button/primary/disabled-background` | — | {color.action.disabled.background} | color |
| `aubergine.button.primary.disabled-foreground` | `button/primary/disabled-foreground` | — | {color.action.disabled.foreground} | color |
| `aubergine.button.secondary.background` | `button/secondary/background` | — | {color.action.secondary.background} | color |
| `aubergine.button.secondary.foreground` | `button/secondary/foreground` | — | {color.action.secondary.foreground} | color |
| `aubergine.button.secondary.border` | `button/secondary/border` | — | {color.action.secondary.border} | color |
| `aubergine.button.secondary.hover` | `button/secondary/hover` | — | {color.surface.subtle} | color |
| `aubergine.button.secondary.disabled-background` | `button/secondary/disabled-background` | — | {color.action.disabled.background} | color |
| `aubergine.button.secondary.disabled-foreground` | `button/secondary/disabled-foreground` | — | {color.action.disabled.foreground} | color |
| `aubergine.button.tertiary.background` | `button/tertiary/background` | — | {color.action.secondary.background} | color |
| `aubergine.button.tertiary.foreground` | `button/tertiary/foreground` | — | {color.link.foreground} | color |
| `aubergine.button.tertiary.decoration` | `button/tertiary/decoration` | — | {color.link.decoration} | color |
| `aubergine.button.shared.radius` | `button/shared/radius` | — | {radius.control} | dimension |
| `aubergine.button.shared.padding-x` | `button/shared/padding-x` | — | {space.5} | dimension |
| `aubergine.button.shared.min-height` | `button/shared/min-height` | — | {size.control.minimum} | dimension |
| `aubergine.button.shared.focus-width` | `button/shared/focus-width` | — | {border.focus} | dimension |
| `aubergine.button.shared.focus-offset` | `button/shared/focus-offset` | — | {border.focus} | dimension |
| `aubergine.hero.background` | `hero/background` | — | {color.surface.canvas} | color |
| `aubergine.hero.foreground` | `hero/foreground` | — | {color.text.primary} | color |
| `aubergine.hero.headline.max-width` | `hero/headline/max-width` | — | {layout.reading.max} | dimension |
| `aubergine.hero.action.max-count` | `hero/action/max-count` | — | {count.hero.actions} | number |
| `aubergine.case-card.featured.background` | `case-card/featured/background` | — | {color.surface.raised} | color |
| `aubergine.case-card.featured.foreground` | `case-card/featured/foreground` | — | {color.text.primary} | color |
| `aubergine.case-card.featured.border` | `case-card/featured/border` | — | {color.border.subtle} | color |
| `aubergine.case-card.featured.radius` | `case-card/featured/radius` | — | {radius.none} | dimension |
| `aubergine.case-card.featured.padding` | `case-card/featured/padding` | — | {space.10} | dimension |
| `aubergine.case-card.compact.background` | `case-card/compact/background` | — | {color.surface.canvas} | color |
| `aubergine.case-card.compact.foreground` | `case-card/compact/foreground` | — | {color.text.primary} | color |
| `aubergine.case-card.compact.border` | `case-card/compact/border` | — | {color.border.subtle} | color |
| `aubergine.case-card.compact.radius` | `case-card/compact/radius` | — | {radius.none} | dimension |
| `aubergine.case-card.compact.padding` | `case-card/compact/padding` | — | {space.8} | dimension |
| `aubergine.evidence-frame.background` | `evidence-frame/background` | — | {color.surface.raised} | color |
| `aubergine.evidence-frame.border` | `evidence-frame/border` | — | {color.border.strong} | color |
| `aubergine.evidence-frame.radius` | `evidence-frame/radius` | — | {radius.none} | dimension |
| `aubergine.decision-callout.background` | `decision-callout/background` | — | {color.surface.canvas} | color |
| `aubergine.decision-callout.foreground` | `decision-callout/foreground` | — | {color.text.primary} | color |
| `aubergine.decision-callout.padding-min` | `decision-callout/padding-min` | — | {space.8} | dimension |
| `aubergine.decision-callout.padding-max` | `decision-callout/padding-max` | — | {space.10} | dimension |
| `aubergine.evidence-note.background` | `evidence-note/background` | — | {color.surface.subtle} | color |
| `aubergine.evidence-note.foreground` | `evidence-note/foreground` | — | {color.text.primary} | color |
| `aubergine.evidence-note.border` | `evidence-note/border` | — | {color.border.subtle} | color |
| `aubergine.evidence-note.padding-min` | `evidence-note/padding-min` | — | {space.5} | dimension |
| `aubergine.evidence-note.padding-max` | `evidence-note/padding-max` | — | {space.6} | dimension |
| `aubergine.metadata.foreground` | `metadata/foreground` | — | {color.text.tertiary} | color |
| `aubergine.metadata.background` | `metadata/background` | — | {color.action.secondary.background} | color |
| `aubergine.contact-cta.background` | `contact-cta/background` | — | {color.surface.canvas} | color |
| `aubergine.contact-cta.foreground` | `contact-cta/foreground` | — | {color.text.primary} | color |
| `aubergine.contact-cta.action.max-count` | `contact-cta/action/max-count` | — | {count.contact-cta.actions} | number |
| `aubergine.footer.background` | `footer/background` | — | {color.surface.canvas} | color |
| `aubergine.footer.foreground` | `footer/foreground` | — | {color.text.secondary} | color |
| `aubergine.footer.border` | `footer/border` | — | {color.border.subtle} | color |
| `aubergine.footer.padding-y` | `footer/padding-y` | — | {space.6} | dimension |
| `aubergine.direction-band.angle` | `direction-band/angle` | — | {angle.direction-band} | dimension |
| `aubergine.direction-band.research.color` | `direction-band/research/color` | — | {color.signal.research} | color |
| `aubergine.direction-band.decide.color` | `direction-band/decide/color` | — | {color.signal.decide} | color |
| `aubergine.direction-band.design.color` | `direction-band/design/color` | — | {color.signal.design} | color |
| `aubergine.direction-band.ship.color` | `direction-band/ship/color` | — | {color.signal.ship} | color |
| `aubergine.direction-band.sm.stripe-width` | `direction-band/sm/stripe-width` | — | {size.direction-band.sm.stripe-width} | dimension |
| `aubergine.direction-band.sm.gap` | `direction-band/sm/gap` | — | {size.direction-band.sm.gap} | dimension |
| `aubergine.direction-band.sm.height` | `direction-band/sm/height` | — | {size.direction-band.sm.height} | dimension |
| `aubergine.direction-band.md.stripe-width` | `direction-band/md/stripe-width` | — | {size.direction-band.md.stripe-width} | dimension |
| `aubergine.direction-band.md.gap` | `direction-band/md/gap` | — | {size.direction-band.md.gap} | dimension |
| `aubergine.direction-band.md.height` | `direction-band/md/height` | — | {size.direction-band.md.height} | dimension |
| `aubergine.direction-band.lg.stripe-width` | `direction-band/lg/stripe-width` | — | {size.direction-band.lg.stripe-width} | dimension |
| `aubergine.direction-band.lg.gap` | `direction-band/lg/gap` | — | {size.direction-band.lg.gap} | dimension |
| `aubergine.direction-band.lg.height` | `direction-band/lg/height` | — | {size.direction-band.lg.height} | dimension |

## Text styles

Create the following twelve Figma text styles. Every style uses the exact family `Instrument Sans, system-ui, sans-serif`; do not add a condensed or secondary display family. Display styles use sentence case. Eyebrow is uppercase and limited to one use per three sections.

| Figma text style | Family | Weight | Size | Line height | Tracking | Case |
|---|---|---:|---:|---:|---:|---|
| `ET / Display / XL` | Instrument Sans, system-ui, sans-serif | 650 | 64px | 64px | -0.045em | None |
| `ET / Display / LG` | Instrument Sans, system-ui, sans-serif | 650 | 56px | 58px | -0.04em | None |
| `ET / Heading / XL` | Instrument Sans, system-ui, sans-serif | 620 | 40px | 44px | -0.035em | None |
| `ET / Heading / LG` | Instrument Sans, system-ui, sans-serif | 620 | 32px | 36px | -0.03em | None |
| `ET / Heading / MD` | Instrument Sans, system-ui, sans-serif | 600 | 24px | 28px | -0.02em | None |
| `ET / Heading / SM` | Instrument Sans, system-ui, sans-serif | 600 | 20px | 24px | -0.015em | None |
| `ET / Body / LG` | Instrument Sans, system-ui, sans-serif | 400 | 18px | 28px | 0 | None |
| `ET / Body / MD` | Instrument Sans, system-ui, sans-serif | 400 | 16px | 24px | 0 | None |
| `ET / Body / SM` | Instrument Sans, system-ui, sans-serif | 400 | 14px | 20px | 0 | None |
| `ET / Label` | Instrument Sans, system-ui, sans-serif | 650 | 12px | 16px | 0 | None |
| `ET / Eyebrow` | Instrument Sans, system-ui, sans-serif | 700 | 11px | 16px | 0.12em | Uppercase |
| `ET / Caption` | Instrument Sans, system-ui, sans-serif | 450 | 11px | 16px | 0.01em | None |

## Grid and effect styles

Create these Figma layout grids on the page frame. Margins are the responsive `layout/edge/*` values and gutters are the matching `layout/grid/*/gutter` values.

| Figma grid style | Columns | Margin | Gutter |
|---|---:|---:|---:|
| `ET / Grid / Desktop 12` | 12 | 48px | 24px |
| `ET / Grid / Tablet 6` | 6 | 32px | 20px |
| `ET / Grid / Mobile 4` | 4 | 20px | 16px |

Create `ET / Effect / Overlay` as the sole effect style, using `{shadow.overlay}`: 0px X, 12px Y, 32px blur, 0px spread, `#2D202A26`. Shadows are reserved for overlays; surfaces and evidence frames remain square.

## Direction Band

Build the Direction Band from four equal-width stripes in this fixed order: Research, Decide, Design, Ship. Map the stripes to `direction-band/research/color`, `direction-band/decide/color`, `direction-band/design/color`, and `direction-band/ship/color`. Use `direction-band/angle` at 18 degrees, square ends, no outline or keyline, and no per-stripe animation. Apply the matching small, medium, or large stripe-width, gap, and height tokens.

Use it once in a hero or major evidence frame; a second appearance is allowed only at a major decision point. Do not crop it to fewer than four stripes, reorder or recolor it, or use it on every card. It is brand-only: never use its colors for actions, status, charts, navigation, buttons, or form feedback. The only approved signal exception is semantic `color/focus/ring`.

## Accessibility contract

Use the listed pairings by default. Direction Band colors are non-text graphic accents; do not use color as the only carrier of meaning. Body text requires 4.5:1 or higher, large text requires 3:1 or higher, and interactive targets are at least 44 by 44px. Keep focus visible in both modes and honor reduced motion.

| Approved pairing | Contrast |
|---|---:|
| Ink on Parchment | 13.08:1 |
| Parchment on Smoked Aubergine | 9.98:1 |
| Secondary text on Parchment | 5.53:1 |
| Tertiary text on Parchment | 4.55:1 |
| Secondary inverse text on Aubergine | 7.64:1 |
| Focus Cyan on Parchment | 3.05:1 |
| Focus Cyan on Aubergine | 3.28:1 |

| Direction Band color | On Aubergine | On Parchment |
|---|---:|---:|
| Research Cyan | 3.28:1 | 3.05:1 |
| Decide Green | 3.22:1 | 3.10:1 |
| Design Amber | 3.30:1 | 3.03:1 |
| Ship Red | 3.02:1 | 3.31:1 |

## Maintenance flow

Treat JSON as the source of truth. Make a token change in `design-system/tokens/*.json`, run `npm run tokens:validate`, regenerate CSS with `npm run tokens:build`, then mirror the exact JSON paths, Figma names, values, and aliases in this handoff and Figma. Run `npm run tokens:test` to prove JSON to Figma path parity. The maintenance flow is JSON → CSS → Figma.
