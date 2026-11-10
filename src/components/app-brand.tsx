import Link from 'next/link'

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import type { NavigationConfig } from '@/types/navigation'

/** Logo + nome do app no topo da sidebar (compartilhado entre variantes). */
export function AppBrand({ app }: { app: NavigationConfig['app'] }) {
  const Icon = app.icon
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          tooltip={app.name}
          render={<Link href={app.href} />}
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Icon className="size-4" />
          </div>
          <span className="truncate text-base font-semibold">{app.name}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
