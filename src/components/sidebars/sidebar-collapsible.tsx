'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { RiArrowRightSLine } from '@remixicon/react'

import { AppBrand } from '@/components/app-brand'
import { NavUser } from '@/components/nav-user'
import { NavSecondary } from '@/components/sidebars/nav-secondary'
import type { SidebarVariantProps } from '@/components/sidebars/types'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
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
  SidebarRail,
} from '@/components/ui/sidebar'
import { isNavItemActive } from '@/lib/navigation'

/**
 * Variante 'collapsible' — bloco shadcn `sidebar-07`: itens com subitens
 * viram grupos colapsáveis (abertos quando ativos) e a sidebar recolhe para
 * uma coluna de ícones.
 */
export function SidebarCollapsible({
  navigation,
  ...props
}: SidebarVariantProps) {
  const pathname = usePathname()
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppBrand app={navigation.app} />
      </SidebarHeader>
      <SidebarContent>
        {navigation.groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) =>
                item.items?.length ? (
                  <Collapsible
                    key={item.title}
                    defaultOpen={isNavItemActive(item, pathname)}
                    className="group/collapsible"
                    render={<SidebarMenuItem />}
                  >
                    <CollapsibleTrigger
                      render={
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={isNavItemActive(item, pathname)}
                        />
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                      <RiArrowRightSLine className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                    <CollapsibleContent keepMounted>
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
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isNavItemActive(item, pathname)}
                      render={<Link href={item.href} />}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>
          </SidebarGroup>
        ))}
        <NavSecondary items={navigation.secondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navigation.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
