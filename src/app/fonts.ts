import { Figtree, Geist_Mono, Noto_Sans } from 'next/font/google'

// Compartilhadas entre o layout raiz e o global-error (que monta o próprio
// documento e não herda o layout). Sans e heading vêm do preset shadcn
// b1JVYF4dCi; o mono não faz parte do preset e segue com Geist Mono.
const figtreeHeading = Figtree({
  subsets: ['latin'],
  variable: '--font-heading',
})

const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

export const fontVariables = [
  notoSans.variable,
  geistMono.variable,
  figtreeHeading.variable,
]
