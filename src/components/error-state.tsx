'use client'

import Link from 'next/link'
import { useEffect } from 'react'

import { RiErrorWarningLine } from '@remixicon/react'

import { StatusPage } from '@/components/status-page'
import { Button, buttonVariants } from '@/components/ui/button'

export type ErrorPageProps = {
  error: Error & { digest?: string }
  retry: () => void
}

/** Conteúdo compartilhado entre `(dashboard)/error.tsx` e `global-error.tsx`. */
export function ErrorState({
  error,
  retry,
  className,
}: ErrorPageProps & { className?: string }) {
  useEffect(() => {
    // Ponto para plugar um serviço de monitoramento (Sentry etc.).
    console.error(error)
  }, [error])

  return (
    <StatusPage
      icon={RiErrorWarningLine}
      title="Algo deu errado"
      description={
        <>
          <p>Ocorreu um erro inesperado ao carregar esta página.</p>
          {error.digest ? (
            <p className="mt-2 font-mono text-xs">
              Código do erro: {error.digest}
            </p>
          ) : null}
        </>
      }
      className={className}
    >
      <Link
        href="/dashboard"
        className={buttonVariants({ variant: 'outline' })}
      >
        Voltar ao dashboard
      </Link>
      <Button onClick={() => retry()}>Tentar novamente</Button>
    </StatusPage>
  )
}
