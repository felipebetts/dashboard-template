import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { UnderConstruction } from '@/components/under-construction'
import { getBreadcrumbs, isKnownNavPath } from '@/lib/navigation'

// Catch-all do dashboard: itens de `src/config/navigation.ts` que ainda não
// têm página própria mostram "Em construção"; qualquer outra rota dá 404.
// Rotas específicas (ex.: /dashboard, /gestao/clientes) têm precedência.

const toPathname = (slug: string[]) => `/${slug.join('/')}`

// O `not-found.tsx` não aceita `metadata`; o título da aba vem daqui.
export async function generateMetadata({
  params,
}: PageProps<'/[...slug]'>): Promise<Metadata> {
  const pathname = toPathname((await params).slug)
  if (!isKnownNavPath(pathname)) return { title: 'Página não encontrada' }
  return { title: getBreadcrumbs(pathname).at(-1)?.title }
}

export default async function CatchAllPage({
  params,
}: PageProps<'/[...slug]'>) {
  const pathname = toPathname((await params).slug)
  if (!isKnownNavPath(pathname)) notFound()
  return <UnderConstruction />
}
