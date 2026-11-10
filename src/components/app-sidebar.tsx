'use client'

import type { ComponentProps } from 'react'

import { sidebarVariants } from '@/components/sidebars'
import type { Sidebar } from '@/components/ui/sidebar'
import { sidebarVariant } from '@/config/layout'
import { navigation } from '@/config/navigation'

/** Sidebar do app: renderiza a variante escolhida em `src/config/layout.ts`. */
export function AppSidebar(props: ComponentProps<typeof Sidebar>) {
  const SidebarVariantComponent = sidebarVariants[sidebarVariant]
  return <SidebarVariantComponent navigation={navigation} {...props} />
}
