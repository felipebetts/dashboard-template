import { RiFolderLine, RiHomeLine } from '@remixicon/react'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, test } from 'vitest'

import { navigation } from '@/config/navigation'
import {
  getBreadcrumbs,
  isKnownNavPath,
  isNavItemActive,
} from '@/lib/navigation'
import type { NavItem, NavigationConfig } from '@/types/navigation'

const fixture: NavigationConfig = {
  app: { name: 'Teste', href: '/', icon: RiHomeLine },
  user: { name: 'U', email: 'u@u.com', avatar: '' },
  groups: [
    {
      label: 'Grupo',
      items: [
        { title: 'Início', href: '/inicio', icon: RiHomeLine },
        {
          title: 'Projetos',
          href: '/projetos',
          icon: RiFolderLine,
          items: [
            { title: 'Em andamento', href: '/projetos/andamento' },
            { title: 'Concluídos', href: '/projetos/concluidos' },
          ],
        },
      ],
    },
  ],
  secondary: [{ title: 'Ajuda', href: '#', icon: RiHomeLine }],
}

const allEntries = (config: NavigationConfig) =>
  [...config.groups.flatMap((g) => g.items), ...config.secondary].flatMap(
    (item) => [item, ...(item.items ?? [])],
  )

describe('navigation config', () => {
  test('todo item e subitem tem title e href não vazios', () => {
    for (const entry of allEntries(navigation)) {
      expect(entry.title.trim()).not.toBe('')
      expect(entry.href.trim()).not.toBe('')
    }
  })

  test('hrefs de itens e subitens são únicos entre si, exceto "#"', () => {
    const hrefs = allEntries(navigation)
      .map((e) => e.href)
      .filter((h) => h !== '#')
    expect(new Set(hrefs).size).toBe(hrefs.length)
  })

  test('avatar do usuário é vazio (usa iniciais) ou existe em public/', () => {
    const { avatar } = navigation.user
    if (avatar === '' || /^https?:\/\//.test(avatar)) return
    expect(existsSync(path.join(process.cwd(), 'public', avatar))).toBe(true)
  })

  test('todo grupo tem label e ao menos um item', () => {
    expect(navigation.groups.length).toBeGreaterThan(0)
    for (const group of navigation.groups) {
      expect(group.label.trim()).not.toBe('')
      expect(group.items.length).toBeGreaterThan(0)
    }
  })
})

describe('getBreadcrumbs', () => {
  test("'/dashboard' → [Dashboard]", () => {
    expect(getBreadcrumbs('/dashboard')).toEqual([
      { title: 'Dashboard', href: '/dashboard' },
    ])
  })

  test("'/gestao/clientes' → [Clientes]", () => {
    expect(getBreadcrumbs('/gestao/clientes')).toEqual([
      { title: 'Clientes', href: '/gestao/clientes' },
    ])
  })

  test("'/dashboard/relatorio-anual' → [Dashboard, Relatorio anual]", () => {
    expect(getBreadcrumbs('/dashboard/relatorio-anual')).toEqual([
      { title: 'Dashboard', href: '/dashboard' },
      { title: 'Relatorio anual', href: '/dashboard/relatorio-anual' },
    ])
  })

  test("'/rota-desconhecida' → [Rota desconhecida]", () => {
    expect(getBreadcrumbs('/rota-desconhecida')).toEqual([
      { title: 'Rota desconhecida', href: '/rota-desconhecida' },
    ])
  })

  test('subitem retorna [pai, subitem]', () => {
    expect(getBreadcrumbs('/projetos/concluidos', fixture)).toEqual([
      { title: 'Projetos', href: '/projetos' },
      { title: 'Concluídos', href: '/projetos/concluidos' },
    ])
  })

  test('subitem tem prioridade sobre o prefixo do pai', () => {
    expect(getBreadcrumbs('/projetos/andamento/42', fixture)).toEqual([
      { title: 'Projetos', href: '/projetos' },
      { title: 'Em andamento', href: '/projetos/andamento' },
      { title: '42', href: '/projetos/andamento/42' },
    ])
  })
})

describe('isKnownNavPath', () => {
  test("'/configuracoes/equipe' → true; '/nao-existe' → false; '#' → false", () => {
    expect(isKnownNavPath('/configuracoes/equipe')).toBe(true)
    expect(isKnownNavPath('/gestao/projetos/concluidos')).toBe(true)
    expect(isKnownNavPath('/nao-existe')).toBe(false)
    expect(isKnownNavPath('#')).toBe(false)
  })
})

describe('isNavItemActive', () => {
  const item = (href: string, items?: NavItem['items']): NavItem => ({
    title: 'x',
    href,
    icon: RiHomeLine,
    items,
  })

  test("item '/gestao/clientes' ativo em '/gestao/clientes/123'", () => {
    expect(
      isNavItemActive(item('/gestao/clientes'), '/gestao/clientes/123'),
    ).toBe(true)
  })

  test("item '/dashboard' inativo em '/dashboard-x'", () => {
    expect(isNavItemActive(item('/dashboard'), '/dashboard-x')).toBe(false)
  })

  test('item com subitem ativo é ativo', () => {
    const parent = item('/pai', [{ title: 'Filho', href: '/outro/filho' }])
    expect(isNavItemActive(parent, '/outro/filho')).toBe(true)
  })

  test("href '#' nunca é ativo", () => {
    expect(isNavItemActive(item('#'), '#')).toBe(false)
    expect(isNavItemActive(item('#'), '/')).toBe(false)
  })
})
