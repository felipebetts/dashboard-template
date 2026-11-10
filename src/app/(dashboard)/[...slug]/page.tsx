import { notFound } from 'next/navigation'

import { UnderConstruction } from '@/components/under-construction'
import { isKnownNavPath } from '@/lib/navigation'

// Catch-all do dashboard: itens de `src/config/navigation.ts` que ainda não
// têm página própria mostram "Em construção"; qualquer outra rota dá 404.
// Rotas específicas (ex.: /dashboard, /gestao/clientes) têm precedência.
export default async function CatchAllPage({
  params,
}: PageProps<'/[...slug]'>) {
  const { slug } = await params
  const pathname = `/${slug.join('/')}`
  if (!isKnownNavPath(pathname)) notFound()
  return <UnderConstruction />
}
