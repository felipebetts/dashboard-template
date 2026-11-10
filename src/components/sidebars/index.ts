import type { ComponentType } from 'react'

import { SidebarDefault } from '@/components/sidebars/sidebar-default'
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
  collapsible: SidebarDefault, // substituída na Task 4
  floating: SidebarDefault, // substituída na Task 4
}
