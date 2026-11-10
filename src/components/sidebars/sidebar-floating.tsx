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

/**
 * Variante 'floating' — bloco shadcn `sidebar-04`: sidebar flutuante com
 * subitens sempre visíveis, sem ícones nos itens.
 */
export function SidebarFloating({ navigation, ...props }: SidebarVariantProps) {
  const pathname = usePathname()
  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <AppBrand app={navigation.app} />
      </SidebarHeader>
      <SidebarContent>
        {navigation.groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu className="gap-2">
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isNavItemActive(item, pathname)}
                    render={<Link href={item.href} className="font-medium" />}
                  >
                    {item.title}
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                      {item.items.map((sub) => (
                        <SidebarMenuSubItem key={sub.title}>
                          <SidebarMenuSubButton
                            isActive={isNavItemActive(sub, pathname)}
                            render={<Link href={sub.href} />}
                          >
                            {sub.title}
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
