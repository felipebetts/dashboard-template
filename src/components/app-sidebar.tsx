'use client'

import { usePathname } from 'next/navigation'
import { type ComponentProps, useEffect } from 'react'

import { sidebarVariants } from '@/components/sidebars'
import { type Sidebar, useSidebar } from '@/components/ui/sidebar'
import { sidebarVariant } from '@/config/layout'
import { navigation } from '@/config/navigation'

/** Sidebar do app: renderiza a variante escolhida em `src/config/layout.ts`. */
export function AppSidebar(props: ComponentProps<typeof Sidebar>) {
  const SidebarVariantComponent = sidebarVariants[sidebarVariant]
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  // No mobile a sidebar é um sheet aberto por cima da página; como ela fica
  // montada no layout entre navegações, fecha o sheet a cada troca de rota.
  useEffect(() => {
    setOpenMobile(false)
  }, [pathname, setOpenMobile])

  return <SidebarVariantComponent navigation={navigation} {...props} />
}
