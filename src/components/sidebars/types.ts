import type { ComponentProps } from 'react'

import type { Sidebar } from '@/components/ui/sidebar'
import type { NavigationConfig } from '@/types/navigation'

export type SidebarVariant = 'default' | 'collapsible' | 'floating'

/** Contrato comum de todas as variantes de sidebar. */
export type SidebarVariantProps = {
  navigation: NavigationConfig
} & ComponentProps<typeof Sidebar>
