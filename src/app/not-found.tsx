import Link from 'next/link'

import { RiCompass3Line } from '@remixicon/react'

import { StatusPage } from '@/components/status-page'
import { buttonVariants } from '@/components/ui/button'

// O título da aba vem do `generateMetadata` do catch-all (`(dashboard)/[...slug]`),
// já que `not-found.tsx` não suporta `metadata`.
export default function NotFound() {
  return (
    <StatusPage
      icon={RiCompass3Line}
      code="404"
      title="Página não encontrada"
      description="O endereço que você tentou acessar não existe ou foi movido."
    >
      <Link href="/dashboard" className={buttonVariants()}>
        Voltar ao dashboard
      </Link>
    </StatusPage>
  )
}
