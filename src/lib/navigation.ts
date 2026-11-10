import { navigation } from '@/config/navigation'
import type {
  Breadcrumb,
  NavItem,
  NavSubItem,
  NavigationConfig,
} from '@/types/navigation'

const allItems = (config: NavigationConfig): NavItem[] => [
  ...config.groups.flatMap((group) => group.items),
  ...config.secondary,
]

const matchesPrefix = (pathname: string, href: string) =>
  href !== '#' && (pathname === href || pathname.startsWith(`${href}/`))

const formatSegment = (segment: string) => {
  const text = decodeURIComponent(segment).replace(/-/g, ' ')
  return text.charAt(0).toUpperCase() + text.slice(1)
}

const lastSegment = (pathname: string) =>
  pathname.split('/').filter(Boolean).at(-1) ?? ''

const crumb = ({ title, href }: Breadcrumb): Breadcrumb => ({ title, href })

/** Caminho conhecido = href exato de algum item ou subitem da navegação. */
export function isKnownNavPath(
  pathname: string,
  config: NavigationConfig = navigation,
): boolean {
  if (pathname === '#') return false
  return allItems(config).some(
    (item) =>
      item.href === pathname ||
      (item.items ?? []).some((sub) => sub.href === pathname),
  )
}

/**
 * Trilha de breadcrumb para um pathname, derivada da navegação: o item (ou
 * pai + subitem) com o maior prefixo de rota que casa, seguido do último
 * segmento formatado quando o pathname vai além dele. Rotas fora da
 * navegação viram um único crumb com o segmento formatado.
 */
export function getBreadcrumbs(
  pathname: string,
  config: NavigationConfig = navigation,
): Breadcrumb[] {
  let best: { trail: Breadcrumb[]; length: number } | undefined

  for (const item of allItems(config)) {
    for (const sub of item.items ?? []) {
      if (
        matchesPrefix(pathname, sub.href) &&
        sub.href.length > (best?.length ?? -1)
      ) {
        best = { trail: [crumb(item), crumb(sub)], length: sub.href.length }
      }
    }
    if (
      matchesPrefix(pathname, item.href) &&
      item.href.length > (best?.length ?? -1)
    ) {
      best = { trail: [crumb(item)], length: item.href.length }
    }
  }

  const tail = { title: formatSegment(lastSegment(pathname)), href: pathname }
  if (!best) return [tail]
  const matchedHref = best.trail.at(-1)!.href
  return matchedHref === pathname ? best.trail : [...best.trail, tail]
}

/** Ativo quando o pathname é o href ou está abaixo dele; pais também ficam ativos via subitens. */
export function isNavItemActive(
  item: NavItem | NavSubItem,
  pathname: string,
): boolean {
  if (matchesPrefix(pathname, item.href)) return true
  return 'items' in item
    ? (item.items ?? []).some((sub) => matchesPrefix(pathname, sub.href))
    : false
}
