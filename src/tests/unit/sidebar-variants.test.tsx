import { render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { type SidebarVariant, sidebarVariants } from '@/components/sidebars'
import { SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { navigation } from '@/config/navigation'

const nav = vi.hoisted(() => ({ pathname: '/gestao/clientes' }))
vi.mock('next/navigation', () => ({ usePathname: () => nav.pathname }))

beforeEach(() => {
  nav.pathname = '/gestao/clientes'
})

const renderVariant = (variant: SidebarVariant) => {
  const Variant = sidebarVariants[variant]
  return render(
    <TooltipProvider>
      <SidebarProvider>
        <Variant navigation={navigation} />
      </SidebarProvider>
    </TooltipProvider>,
  )
}

const variants = Object.keys(sidebarVariants) as SidebarVariant[]

describe.each(variants)('variante %s', (variant) => {
  test('renderiza todos os grupos, itens, subitens e links secundários da config', () => {
    renderVariant(variant)
    for (const group of navigation.groups) {
      expect(screen.getAllByText(group.label).length).toBeGreaterThan(0)
      for (const item of group.items) {
        expect(screen.getAllByText(item.title).length).toBeGreaterThan(0)
        for (const sub of item.items ?? []) {
          expect(screen.getAllByText(sub.title).length).toBeGreaterThan(0)
        }
      }
    }
    for (const item of navigation.secondary) {
      expect(screen.getAllByText(item.title).length).toBeGreaterThan(0)
    }
  })

  test("marca 'Clientes' como ativo", () => {
    renderVariant(variant)
    const link = screen.getByRole('link', { name: 'Clientes' })
    expect(link).toHaveAttribute('data-active')
    const dashboard = screen.getByRole('link', { name: 'Dashboard' })
    expect(dashboard).not.toHaveAttribute('data-active')
  })

  test('ao navegar para um subitem, pai e subitem ficam ativos e visíveis', () => {
    nav.pathname = '/dashboard'
    const Variant = sidebarVariants[variant]
    const tree = () => (
      <TooltipProvider>
        <SidebarProvider>
          <Variant navigation={navigation} />
        </SidebarProvider>
      </TooltipProvider>
    )
    const { rerender } = render(tree())
    nav.pathname = '/gestao/projetos/concluidos'
    rerender(tree())
    const sub = screen.getByRole('link', { name: 'Concluídos', hidden: true })
    expect(sub).toHaveAttribute('data-active')
    expect(sub).toBeVisible()
    const parent = screen.getAllByText('Projetos')[0].closest('[data-slot]')
    expect(parent).toHaveAttribute('data-active')
  })

  test('renderiza o nome do app e o nome do usuário', () => {
    const { container } = renderVariant(variant)
    const scope = within(container)
    expect(scope.getAllByText(navigation.app.name).length).toBeGreaterThan(0)
    expect(scope.getAllByText(navigation.user.name).length).toBeGreaterThan(0)
  })
})

test("'collapsible' e 'floating' não são o mesmo componente que 'default'", () => {
  expect(sidebarVariants.collapsible).not.toBe(sidebarVariants.default)
  expect(sidebarVariants.floating).not.toBe(sidebarVariants.default)
  expect(sidebarVariants.floating).not.toBe(sidebarVariants.collapsible)
})
