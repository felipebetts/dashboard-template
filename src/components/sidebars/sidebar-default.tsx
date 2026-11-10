'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { AppBrand } from '@/components/app-brand'
import { NavUser } from '@/components/nav-user'
import { NavSecondary } from '@/components/sidebars/nav-secondary'
import type { SidebarVariantProps } from '@/components/sidebars/types'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { isNavItemActive } from '@/lib/navigation'

/** Variante padrão — sidebar do bloco shadcn `dashboard-01` (inset, offcanvas). */
export function SidebarDefault({ navigation, ...props }: SidebarVariantProps) {
  const pathname = usePathname()
  return (
    <Sidebar variant="inset" collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <AppBrand app={navigation.app} />
      </SidebarHeader>
      <SidebarContent>
        {navigation.groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isNavItemActive(item, pathname)}
                    render={<Link href={item.href} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <SidebarMenuSub>
                      {item.items.map((sub) => (
                        <SidebarMenuSubItem key={sub.title}>
                          <SidebarMenuSubButton
                            isActive={isNavItemActive(sub, pathname)}
                            render={<Link href={sub.href} />}
                          >
                            <span>{sub.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
        <NavSecondary items={navigation.secondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navigation.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
