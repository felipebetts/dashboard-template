import type { ReactNode } from 'react'

import type { RemixiconComponentType } from '@remixicon/react'

import { cn } from '@/lib/utils'

/**
 * Tela de estado (404, erro, em construção): ícone, código opcional, título,
 * descrição e ações. Ocupa o espaço disponível e centraliza o conteúdo, então
 * funciona tanto dentro do layout do dashboard quanto em tela cheia.
 */
export function StatusPage({
  icon: Icon,
  code,
  title,
  description,
  children,
  className,
}: {
  icon: RemixiconComponentType
  code?: string
  title: string
  description: ReactNode
  children?: ReactNode
  className?: string
}) {
  return (
    <main
      className={cn(
        'flex flex-1 items-center justify-center px-4 py-16 lg:px-6',
        className,
      )}
    >
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <div className="bg-muted/50 relative mb-6 flex size-16 items-center justify-center rounded-2xl border shadow-xs">
          <Icon className="text-muted-foreground size-7" />
        </div>
        {code ? (
          <p className="text-muted-foreground font-mono text-sm font-medium tracking-[0.3em]">
            {code}
          </p>
        ) : null}
        <h1 className="font-heading mt-2 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          {title}
        </h1>
        <div className="text-muted-foreground mt-3 text-sm text-balance">
          {description}
        </div>
        {children ? (
          <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
            {children}
          </div>
        ) : null}
      </div>
    </main>
  )
}
