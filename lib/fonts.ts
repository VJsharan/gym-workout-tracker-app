import { Anton, DM_Sans } from 'next/font/google'

/** Self-hosted at build time — reliable on mobile PWA / standalone (no fonts.googleapis.com). */
export const exerciseSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-exercise-sans',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
})

/** Impact is missing on many Android devices; Anton matches the condensed display look. */
export const displayFont = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display-loaded',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
})
