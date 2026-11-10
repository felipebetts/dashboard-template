import Link from 'next/link'

import { RiToolsLine } from '@remixicon/react'

import { StatusPage } from '@/components/status-page'
import { buttonVariants } from '@/components/ui/button'

/** Placeholder para seções da navegação que ainda não têm página própria. */
export function UnderConstruction() {
  return (
    <StatusPage
      icon={RiToolsLine}
      title="Em construção"
      description="Esta seção ainda não foi implementada."
    >
      <Link href="/dashboard" className={buttonVariants()}>
        Voltar ao dashboard
      </Link>
    </StatusPage>
  )
}
