import type { RemixiconComponentType } from '@remixicon/react'

export type NavSubItem = { title: string; href: string }

export type NavItem = {
  title: string
  href: string
  icon: RemixiconComponentType
  items?: NavSubItem[]
}

export type NavGroup = { label: string; items: NavItem[] }

export type NavUser = { name: string; email: string; avatar: string }

export type NavigationConfig = {
  app: { name: string; href: string; icon: RemixiconComponentType }
  user: NavUser
  groups: NavGroup[]
  secondary: NavItem[]
}

export type Breadcrumb = { title: string; href: string }
