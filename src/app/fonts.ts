import { Geist, Geist_Mono, Instrument_Sans } from 'next/font/google'

// Compartilhadas entre o layout raiz e o global-error (que monta o próprio
// documento e não herda o layout).
const instrumentSansHeading = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
})

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

export const fontVariables = [
  geistSans.variable,
  geistMono.variable,
  instrumentSansHeading.variable,
]
