import type { ComponentType } from 'react'

import { SidebarCollapsible } from '@/components/sidebars/sidebar-collapsible'
import { SidebarDefault } from '@/components/sidebars/sidebar-default'
import { SidebarFloating } from '@/components/sidebars/sidebar-floating'
import type {
  SidebarVariant,
  SidebarVariantProps,
} from '@/components/sidebars/types'

export type { SidebarVariant, SidebarVariantProps }

/**
 * Registro das variantes de sidebar. Para adicionar uma nova: crie o arquivo
 * em `components/sidebars/`, aceite `SidebarVariantProps` e registre aqui.
 */
export const sidebarVariants: Record<
  SidebarVariant,
  ComponentType<SidebarVariantProps>
> = {
  default: SidebarDefault,
  collapsible: SidebarCollapsible,
  floating: SidebarFloating,
}
