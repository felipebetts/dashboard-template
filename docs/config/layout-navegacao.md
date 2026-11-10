# Layout e navegação (dashboard-01, sidebars, auth)

Como o app autenticado e as páginas de autenticação estão montados: route groups, a config única de navegação, o breadcrumb, as variantes de sidebar trocáveis e onde plugar a autenticação real. Os componentes visuais vêm de blocos do shadcn/ui (`dashboard-01`, `sidebar-07`, `sidebar-04`, `login-02`) no estilo `base-mira` — veja [`estilizacao.md`](./estilizacao.md).

## Rotas (`src/app`)

```
src/app/
├── page.tsx                    # redirect('/dashboard') (por enquanto)
├── not-found.tsx               # 404 em pt-BR
├── global-error.tsx            # erro no layout raiz (documento próprio)
├── fonts.ts                    # fontes compartilhadas (layout + global-error)
├── (auth)/                     # casco login-02 (form à esquerda, imagem à direita)
│   ├── layout.tsx
│   ├── login/  signup/  forgot-password/  reset-password/  verify/
└── (dashboard)/                # SidebarProvider + AppSidebar + SiteHeader
    ├── layout.tsx
    ├── error.tsx               # erro numa página do dashboard (sidebar continua)
    ├── dashboard/              # conteúdo do bloco dashboard-01 (data.json fictício)
    ├── gestao/clientes/        # página de exemplo (lista com busca)
    └── [...slug]/              # "Em construção" para itens da navegação sem página; 404 nos demais
```

- Os route groups `(auth)` e `(dashboard)` não aparecem na URL; servem só para cada grupo ter seu próprio layout.
- O catch-all `(dashboard)/[...slug]` usa `isKnownNavPath`: um path que está em `src/config/navigation.ts` mas ainda não tem página mostra o componente `UnderConstruction`; qualquer outro path chama `notFound()`. Rotas específicas têm precedência sobre o catch-all, então basta criar a página para o placeholder sumir.

## Navegação (`src/config/navigation.ts`)

Fonte única dos links do app. Tipos em `src/types/navigation.ts`:

| Tipo               | Campos                                                                          |
| ------------------ | ------------------------------------------------------------------------------- |
| `NavigationConfig` | `app` (nome, href, ícone), `user` (nome, e-mail, avatar), `groups`, `secondary` |
| `NavGroup`         | `label`, `items`                                                                |
| `NavItem`          | `title`, `href`, `icon` (componente do `@remixicon/react`), `items?` (subitens) |
| `NavSubItem`       | `title`, `href`                                                                 |

Todas as variantes de sidebar e o breadcrumb do header leem essa config — nenhum componente tem links hardcoded. O teste `src/tests/unit/navigation.test.ts` valida a config (títulos/hrefs não vazios, hrefs únicos exceto `#`, grupos com itens).

Como os ícones são componentes (funções), a config não pode ser passada de um Server Component para um Client Component. Por isso `AppSidebar` é `'use client'` e importa a config diretamente.

## Helpers (`src/lib/navigation.ts`)

- **`getBreadcrumbs(pathname, config?)`** — acha o item ou subitem com o maior prefixo de rota que casa com o pathname (subitem retorna `[pai, subitem]`). Se o pathname vai além do item (ex.: `/dashboard/relatorio-anual`), acrescenta o último segmento formatado (`-` vira espaço, primeira letra maiúscula). Sem nenhum match, retorna só o segmento formatado — o breadcrumb nunca fica vazio.
- **`isNavItemActive(item, pathname)`** — ativo quando `pathname === href` ou está abaixo dele (`href + '/'`); pais ficam ativos quando um subitem está. `href: '#'` nunca fica ativo.
- **`isKnownNavPath(pathname, config?)`** — `true` se algum item ou subitem tem exatamente esse `href`. Usado pelo catch-all.

## Variantes de sidebar (`src/components/sidebars/`)

| Valor em `src/config/layout.ts` | Arquivo                   | Bloco shadcn de origem | Comportamento                                                                             |
| ------------------------------- | ------------------------- | ---------------------- | ----------------------------------------------------------------------------------------- |
| `'default'`                     | `sidebar-default.tsx`     | `dashboard-01`         | `variant="inset"`, some por completo ao recolher, subitens abertos                        |
| `'collapsible'`                 | `sidebar-collapsible.tsx` | `sidebar-07`           | Recolhe para ícones; itens com subitens viram grupos colapsáveis                          |
| `'floating'`                    | `sidebar-floating.tsx`    | `sidebar-04`           | `variant="floating"`, subitens sempre à mostra; itens com a mesma hierarquia da `default` |

Contrato: cada variante recebe `SidebarVariantProps` (`{ navigation } & ComponentProps<typeof Sidebar>`, em `sidebars/types.ts`) e declara suas próprias props visuais (`variant`, `collapsible`) — o layout `(dashboard)/layout.tsx` não muda ao trocar de variante. Partes comuns ficam fora das variantes: `AppBrand` (logo + nome), `NavUser` (menu do usuário) e `sidebars/nav-secondary.tsx` (links do rodapé).

**Trocar a sidebar:** mude `sidebarVariant` em `src/config/layout.ts`.

**Adicionar uma variante:** crie `src/components/sidebars/sidebar-<nome>.tsx` aceitando `SidebarVariantProps`, adicione o nome ao tipo `SidebarVariant` e registre o componente em `sidebarVariants` (`sidebars/index.ts`). O teste parametrizado `src/tests/unit/sidebar-variants.test.tsx` passa a cobri-la automaticamente: ela precisa renderizar todos os grupos, itens, subitens e links secundários da config (use `keepMounted` em conteúdo colapsável) e marcar o item ativo.

## Páginas de estado (404, erro, em construção)

Todas usam `components/status-page.tsx` (ícone, código opcional, título, descrição e ações), então seguem o mesmo visual e os tokens de tema.

- **404 — `src/app/not-found.tsx`**: renderizada quando o catch-all chama `notFound()`. Como o catch-all fica dentro de `(dashboard)`, o 404 aparece com sidebar e header. O `not-found.tsx` não aceita `metadata`; o título da aba ("Página não encontrada") vem do `generateMetadata` do catch-all, que também dá aos itens "Em construção" o título do próprio item.
- **Erro em página — `src/app/(dashboard)/error.tsx`**: boundary do segmento; mantém a sidebar. Mostra o `digest` do erro (para cruzar com os logs do servidor), "Tentar novamente" (`retry()` — no Next 16 a prop é `retry`, não `reset`) e "Voltar ao dashboard". O `console.error` no `ErrorState` é o ponto para plugar um serviço de monitoramento.
- **Erro no layout raiz — `src/app/global-error.tsx`**: substitui o documento inteiro, por isso declara `<html>`/`<body>`, importa `globals.css`, as fontes de `app/fonts.ts` e o `ThemeProvider`, e usa `<title>` do React (client components não exportam `metadata`).

## Header (`src/components/site-header.tsx`)

Trigger da sidebar, breadcrumb (`getBreadcrumbs(usePathname())`) e `ThemeToggle`. O tema usa `next-themes` (`ThemeProvider` com `attribute="class"` no layout raiz, que tem `suppressHydrationWarning` no `<html>`); o ícone do toggle troca via CSS (`dark:`) para não depender do tema no render do servidor.

## Autenticação (só layout)

- As páginas de `(auth)` usam o casco `components/auth/auth-shell.tsx`; os formulários ficam em `components/auth/*-form.tsx` e hoje só navegam no submit (login → `/dashboard`; cadastro → `/verify` → `/dashboard`; esqueci a senha → `/verify?next=reset` → `/reset-password` → `/login`).
- **Para plugar auth de verdade:** troque o `onSubmit` de cada form pela chamada ao provedor, e proteja as rotas do `(dashboard)` com um `src/proxy.ts` (no Next.js 16 o antigo `middleware.ts` se chama `proxy.ts` — veja `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`). O item "Sair" do `NavUser` hoje é só um link para `/login`.
- A imagem lateral é `public/auth-placeholder.svg` (neutra, sem marca); substitua pela do projeto.

## Resumo prático

| Quero…                          | Onde                                                               |
| ------------------------------- | ------------------------------------------------------------------ |
| Adicionar/renomear um link      | `src/config/navigation.ts`                                         |
| Criar a página de uma seção     | `src/app/(dashboard)/<rota>/page.tsx` (o placeholder some sozinho) |
| Trocar a sidebar                | `sidebarVariant` em `src/config/layout.ts`                         |
| Criar uma variante de sidebar   | `src/components/sidebars/` + registrar em `sidebars/index.ts`      |
| Mudar nome/logo do app          | `navigation.app` em `src/config/navigation.ts`                     |
| Plugar autenticação             | forms em `src/components/auth/` + `src/proxy.ts`                   |
| Trocar o ícone da aba (favicon) | `src/app/icon.svg`                                                 |
| Mudar textos de 404/erro        | `src/app/not-found.tsx`, `src/components/error-state.tsx`          |
