'use client'

import { type ErrorPageProps, ErrorState } from '@/components/error-state'
import { ThemeProvider } from '@/components/theme-provider'
import { cn } from '@/lib/utils'

import { fontVariables } from './fonts'
import './globals.css'

// Erros no layout raiz: substitui o documento inteiro, então precisa do
// próprio <html>/<body>, dos estilos globais, das fontes e do tema.
export default function GlobalError(props: ErrorPageProps) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={cn('h-full', 'antialiased', ...fontVariables)}
    >
      <body className="flex min-h-full flex-col">
        <title>Algo deu errado</title>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorState {...props} className="min-h-svh" />
        </ThemeProvider>
      </body>
    </html>
  )
}
