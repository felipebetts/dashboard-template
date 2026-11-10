# Dashboard Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar o repositório público `dashboard-template` a partir do `nextjs-16-boilerplate`, com o layout do shadcn `dashboard-01`, sidebar trocável por config, navegação centralizada e páginas de auth (só layout) no estilo `login-02`.

**Architecture:** Dois route groups: `(auth)` com um casco de duas colunas e `(dashboard)` com `SidebarProvider` + `AppSidebar` + `SiteHeader`. `AppSidebar` escolhe a variante a partir de `src/config/layout.ts`. Todas as variantes leem `src/config/navigation.ts`, e o breadcrumb é derivado dessa mesma config por um helper puro e testado.

**Tech Stack:** Next.js 16.3 (App Router), React 19, TypeScript strict, Tailwind v4, shadcn `base-nova` (Base UI + Remix Icon), next-themes, Vitest + Testing Library, Playwright, pnpm.

**Spec:** `docs/superpowers/specs/2026-11-10-dashboard-template-design.md`

## Global Constraints

- Gerenciador de pacotes: **pnpm** apenas. Componentes shadcn via `pnpm dlx shadcn@latest add <item>` (estilo `base-nova`, ícones `remixicon`, já definidos em `components.json`). Nunca converter componentes para Radix/Lucide à mão.
- Next.js 16: antes de mexer em rotas/config/redirect, consultar `node_modules/next/dist/docs/` (regra do `AGENTS.md`).
- Nomes de arquivo `.ts/.tsx` em kebab-case. Pastas em `src/app/**` no padrão do App Router (lint `check-file`).
- Textos de UI em pt-BR, com `<html lang="pt-BR">`.
- Nenhuma lógica de auth, API ou banco. Formulários não fazem submit real; só navegam.
- Navegação de exemplo genérica (grupos "Geral", "Gestão", "Configurações"), sem nada específico de negócio.
- Repo novo, sem histórico do boilerplate, **público** no GitHub do autor com o nome `dashboard-template`.
- Commits com mensagem em pt-BR no padrão convencional do boilerplate (`feat:`, `docs:`, `chore:`…), terminando com `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Gate de cada task: `pnpm lint`, `pnpm exec tsc --noEmit` e `pnpm test` passando. Rodar `pnpm test:e2e` nas tasks que tocam E2E.

## Review Focus

1. **Rota aninhada / sub-item:** em `/gestao/clientes`, o breadcrumb deve mostrar "Gestão › Clientes" e o item pai precisa ficar ativo/expandido na sidebar. Teste em Task 2 (`getBreadcrumbs`) e Task 4 (`isNavItemActive`).
2. **Rota fora da config** (ex.: `/dashboard/qualquer-coisa` ou uma página nova ainda não adicionada à navegação): o breadcrumb não pode quebrar nem ficar vazio. O fallback é o segmento da URL formatado. Teste em Task 2.
3. **Mobile:** a sidebar vira sheet (comportamento do shadcn) e a imagem do casco de auth some abaixo de `lg`. Teste E2E com viewport 390×844 em Task 5 e Task 6.
4. **Tema escuro na carga:** sem flash nem warning de hidratação. Exige `suppressHydrationWarning` no `<html>` e ThemeProvider com `attribute="class"`. Teste E2E em Task 3 (alterna o tema e verifica a classe `dark` no `<html>`).
5. **Trocar a variante quebrar o layout:** cada variante precisa renderizar todos os itens da config dentro do `SidebarProvider`. Teste unitário parametrizado em Task 4.

---

## File Structure

```
src/
  app/
    layout.tsx                         (mod) lang pt-BR, ThemeProvider, metadata, Toaster
    page.tsx                           (mod) redirect('/login')
    (auth)/layout.tsx                  casco login-02
    (auth)/login/page.tsx
    (auth)/signup/page.tsx
    (auth)/forgot-password/page.tsx
    (auth)/reset-password/page.tsx
    (auth)/verify/page.tsx
    (dashboard)/layout.tsx             SidebarProvider + AppSidebar + SidebarInset + SiteHeader
    (dashboard)/dashboard/page.tsx     conteúdo dashboard-01
    (dashboard)/dashboard/data.json
    (dashboard)/gestao/clientes/page.tsx   página de exemplo: lista
    (dashboard)/[...slug]/page.tsx         "em construção" para paths da config sem página; 404 nos demais
  config/
    navigation.ts                      NavigationConfig de exemplo
    layout.ts                          sidebarVariant ativo
  lib/
    navigation.ts                      getBreadcrumbs, isNavItemActive, isKnownNavPath
  types/
    navigation.ts                      tipos de navegação
  components/
    app-sidebar.tsx                    escolhe a variante pelo config
    site-header.tsx                    trigger + breadcrumb + theme toggle
    theme-provider.tsx
    theme-toggle.tsx
    nav-user.tsx                       compartilhado (vindo do dashboard-01)
    app-brand.tsx                      logo + nome (compartilhado)
    sidebars/
      index.ts                         sidebarVariants map + tipos
      sidebar-default.tsx              dashboard-01
      sidebar-collapsible.tsx          sidebar-07
      sidebar-floating.tsx             sidebar-04
    dashboard/                         section-cards, chart-area-interactive, data-table (dashboard-01)
    auth/
      auth-shell.tsx                   casco 2 colunas (usado por (auth)/layout.tsx)
      login-form.tsx, signup-form.tsx, forgot-password-form.tsx,
      reset-password-form.tsx, verify-form.tsx
    ui/                                gerado pela CLI do shadcn
  tests/
    unit/navigation.test.ts
    unit/sidebar-variants.test.tsx
    e2e/auth.spec.ts
    e2e/dashboard.spec.ts
docs/config/layout-navegacao.md
```

Tipos compartilhados (definidos em Task 2 e usados em todas as tasks seguintes):

```ts
// src/types/navigation.ts
import type { RemixiconComponentType } from '@remixicon/react'

export type NavSubItem = { title: string; href: string }
export type NavItem = {
  title: string
  href: string
  icon: RemixiconComponentType
  items?: NavSubItem[]
}
export type NavGroup = { label: string; items: NavItem[] }
export type NavUser = { name: string; email: string; avatar: string }
export type NavigationConfig = {
  app: { name: string; href: string; icon: RemixiconComponentType }
  user: NavUser
  groups: NavGroup[]
  secondary: NavItem[]
}
export type Breadcrumb = { title: string; href: string }
```

---

### Task 1: Bootstrap do repositório

**Files:**

- Create: todo o conteúdo versionado do boilerplate em `/Users/felipebetts/Developer/templates/dashboard-template/`
- Modify: `package.json` (`name: "dashboard-template"`), `README.md` (título e descrição; o resto do README fica para a Task 7)
- Delete: `src/tests/unit/page.test.tsx`, `src/tests/e2e/home.spec.ts` (eles testam a home do create-next-app, que será removida). Para o `pnpm test` não falhar sem testes, criar `src/tests/unit/smoke.test.ts` com um único teste `expect(true).toBe(true)`, que será removido na Task 2.

- [ ] **Step 1: Copiar só os arquivos versionados do boilerplate**

Run: `git -C ../nextjs-16-boilerplate archive HEAD | tar -x -C .` (rodar a partir de `dashboard-template/`; os `docs/superpowers/` já existentes são preservados)
Expected: `AGENTS.md`, `src/`, `package.json` presentes; nenhum `playwright-report/` ou `test-results/`.

- [ ] **Step 2: Ajustar `package.json` e o topo do README; trocar testes da home pelo smoke**

- [ ] **Step 3: `git init -b main` e `pnpm install`**

Expected: install ok; o hook `prepare` instala o Husky.

- [ ] **Step 4: Gate**

Run: `pnpm lint && pnpm exec tsc --noEmit && pnpm test && pnpm build`
Expected: tudo passa.

- [ ] **Step 5: Commit inicial e criação do repo público no GitHub**

```bash
git add -A
git commit -m "chore: inicia dashboard-template a partir do nextjs-16-boilerplate"
gh repo create dashboard-template --public --source=. --remote=origin --description "Template de dashboard em Next.js 16 + shadcn/ui (dashboard-01), com sidebar trocável e páginas de auth (só layout)." --push
```

Expected: o push passa pelo hook `pre-push` (testes) e o repo aparece em `gh repo view dashboard-template`.

---

### Task 2: Tipos, config de navegação e helpers

**Files:**

- Create: `src/types/navigation.ts` (tipos acima), `src/config/navigation.ts`, `src/lib/navigation.ts`
- Test: `src/tests/unit/navigation.test.ts`
- Delete: `src/tests/unit/smoke.test.ts`

**Interfaces:**

- Produces:
  - `navigation: NavigationConfig` (default export não; export nomeado `navigation`)
  - `isKnownNavPath(pathname: string, config?: NavigationConfig): boolean`: true se algum item ou sub-item tem `href === pathname`
  - `getBreadcrumbs(pathname: string, config?: NavigationConfig): Breadcrumb[]`
  - `isNavItemActive(item: NavItem | NavSubItem, pathname: string): boolean`

Conteúdo de `navigation` (valores exatos):

- `app`: `{ name: 'Acme Inc.', href: '/dashboard', icon: RiDashboardLine }`
- `user`: `{ name: 'Usuário Exemplo', email: 'usuario@exemplo.com', avatar: '/avatars/user.jpg' }` (criar `public/avatars/user.jpg` não é necessário; o Avatar tem fallback com iniciais)
- grupo `Geral`: `Dashboard` → `/dashboard`
- grupo `Gestão`: `Clientes` → `/gestao/clientes`; `Projetos` → `/gestao/projetos`, com subitens `Em andamento` → `/gestao/projetos/em-andamento` e `Concluídos` → `/gestao/projetos/concluidos`; `Documentos` → `/gestao/documentos`
- grupo `Configurações`: `Equipe` → `/configuracoes/equipe`
- `secondary`: `Ajuda` → `#`, `Configurações` → `#`

Regras de `getBreadcrumbs`:

- Faz match exato do pathname com o `href` de item ou sub-item (sub-item tem prioridade; depois, a ordem da config).
- Um sub-item retorna `[pai, subitem]`. Um item retorna `[item]`.
- Sem match exato, procura o item com o maior prefixo de segmento (`/dashboard/x` → começa com `/dashboard/`) e retorna `[item, { title: <último segmento formatado>, href: pathname }]`.
- Sem nenhum match, retorna `[{ title: <último segmento formatado>, href: pathname }]`. Formatar = trocar `-` por espaço e capitalizar a primeira letra.

`isNavItemActive`: true se `pathname === href` ou `pathname` começa com `href + '/'`; para itens com `items`, true também se algum subitem estiver ativo. `href === '#'` nunca fica ativo.

- [ ] **Step 1: Escrever os testes que falham** (`src/tests/unit/navigation.test.ts`)

```ts
describe('navigation config', () => {
  test('todo item e subitem tem title e href não vazios')
  test('hrefs de itens e subitens são únicos entre si, exceto "#"')
  test('todo grupo tem label e ao menos um item')
})
describe('getBreadcrumbs', () => {
  test("'/dashboard' → [{ title: 'Dashboard', href: '/dashboard' }]")
  test("'/gestao/clientes' → [{ title: 'Clientes', href: '/gestao/clientes' }]")
  test("'/dashboard/relatorio-anual' → ['Dashboard', 'Relatorio anual']") // Review Focus 2
  test(
    "'/rota-desconhecida' → [{ title: 'Rota desconhecida', href: '/rota-desconhecida' }]",
  ) // Review Focus 2
  test('subitem retorna [pai, subitem] usando uma config fixture') // Review Focus 1
})
describe('isKnownNavPath', () => {
  test("'/configuracoes/equipe' → true; '/nao-existe' → false; '#' → false")
})
describe('isNavItemActive', () => {
  test("item '/gestao/clientes' ativo em '/gestao/clientes/123'") // Review Focus 1
  test("item '/dashboard' inativo em '/dashboard-x'")
  test('item com subitem ativo é ativo')
  test("href '#' nunca é ativo")
})
```

Use uma `NavigationConfig` fixture no próprio teste para os casos de subitem (com `href` de pai `/projetos` e subitens `/projetos/andamento`, `/projetos/concluidos`), sem depender dos valores de exemplo.

- [ ] **Step 2: Rodar e confirmar que falham**

Run: `pnpm test` → FAIL (módulos não existem)

- [ ] **Step 3: Implementar tipos, config e helpers**

- [ ] **Step 4: Rodar o gate** → PASS

- [ ] **Step 5: Commit** `feat: adiciona config de navegação centralizada e helpers de breadcrumb`

---

### Task 3: Layout do dashboard (dashboard-01), tema e redirect da raiz

**Files:**

- Run CLI: `pnpm dlx shadcn@latest add dashboard-01` (instala componentes ui, deps `@dnd-kit/*`, `@tanstack/react-table`, `zod`, `sonner` e os arquivos do bloco)
- Move/adapt do bloco: `app-sidebar.tsx` → `components/sidebars/sidebar-default.tsx`; `section-cards.tsx`, `chart-area-interactive.tsx`, `data-table.tsx` → `components/dashboard/`; `nav-user.tsx` → `components/nav-user.tsx`; `nav-main/nav-secondary/nav-documents` passam a ser internos da variante default ou são removidos se não forem usados; `site-header.tsx` → `components/site-header.tsx`; `data.json` → `src/app/(dashboard)/dashboard/data.json`. Apagar o `src/app/dashboard/` que a CLI criar.
- Create: `components/theme-provider.tsx`, `components/theme-toggle.tsx`, `components/app-brand.tsx`, `components/app-sidebar.tsx`, `components/sidebars/index.ts`, `config/layout.ts`, `app/(dashboard)/layout.tsx`, `app/(dashboard)/dashboard/page.tsx`
- Modify: `src/app/layout.tsx`, `src/app/page.tsx`
- Test: `src/tests/e2e/dashboard.spec.ts`

**Interfaces:**

- Consumes: `navigation`, `getBreadcrumbs`, `isNavItemActive` (Task 2)
- Produces:
  - `src/components/sidebars/index.ts`: `type SidebarVariant = 'default' | 'collapsible' | 'floating'`; `type SidebarVariantProps = { navigation: NavigationConfig } & React.ComponentProps<typeof Sidebar>`; `sidebarVariants: Record<SidebarVariant, React.ComponentType<SidebarVariantProps>>`. Nesta task só `default` existe de verdade; `collapsible` e `floating` apontam temporariamente para o default, e a Task 4 os substitui.
  - `src/config/layout.ts`: `export const sidebarVariant: SidebarVariant = 'default'`, com um comentário em pt-BR explicando que trocar este valor troca a sidebar.
  - `AppSidebar(props: React.ComponentProps<typeof Sidebar>)`: renderiza `sidebarVariants[sidebarVariant]` com `navigation`.
  - `AppBrand()`: logo + `navigation.app.name`, link para `app.href`, dentro de `SidebarMenuButton`.
  - `ThemeToggle()`: botão com `aria-label="Alternar tema"` que alterna light/dark.
- Detalhes:
  - Root layout: `lang="pt-BR"`, `suppressHydrationWarning`, `ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange`, `<Toaster />`, `metadata.title = { default: 'Dashboard', template: '%s · Dashboard' }`.
  - `src/app/page.tsx`: `redirect('/login')` de `next/navigation`.
  - `(dashboard)/layout.tsx`: copia a estrutura de `page.tsx` do bloco (`SidebarProvider` com as CSS vars `--sidebar-width`/`--header-height`, `AppSidebar variant="inset"`, `SidebarInset`, `SiteHeader`) e renderiza `children` no lugar do conteúdo. As props visuais (`variant`, `collapsible`) vêm da variante, não do layout: a variante default aplica `variant="inset"` e `collapsible="offcanvas"` por conta própria.
  - `SiteHeader`: client component; usa `usePathname()` + `getBreadcrumbs` e renderiza com os componentes `breadcrumb` do shadcn (`pnpm dlx shadcn@latest add breadcrumb` se não vier no bloco); `ThemeToggle` à direita.
  - `sidebar-default.tsx`: a sidebar do dashboard-01 com o header trocado por `AppBrand`, os grupos vindos de `navigation.groups` (um `SidebarGroup` por grupo, com `SidebarGroupLabel`), `navigation.secondary` no rodapé do conteúdo e `NavUser` com `navigation.user`. Item ativo via `isNavItemActive` → `isActive`. Remove o bloco "Quick Create" e os "Documents" hardcoded do bloco.
  - `dashboard/page.tsx`: `SectionCards`, `ChartAreaInteractive`, `DataTable data={data}`, como no bloco. Traduzir os textos visíveis dos cards/gráfico/tabela para pt-BR (títulos, botões, labels de filtro e paginação); os dados do JSON ficam como estão.

- [ ] **Step 1: Escrever o E2E que falha** (`src/tests/e2e/dashboard.spec.ts`)

```ts
test("'/' redireciona para '/login'", async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/login$/)
})
test('dashboard renderiza sidebar com os grupos da config', async ({
  page,
}) => {
  await page.goto('/dashboard')
  for (const label of ['Geral', 'Gestão', 'Configurações'])
    await expect(page.getByText(label, { exact: true }).first()).toBeVisible()
  await expect(page.getByRole('link', { name: 'Clientes' })).toBeVisible()
})
test('breadcrumb mostra Dashboard', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(
    page.getByRole('navigation', { name: /breadcrumb/i }),
  ).toContainText('Dashboard')
})
test('alternar tema adiciona a classe dark no html', async ({ page }) => {
  // Review Focus 4
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/dashboard')
  await page.getByRole('button', { name: 'Alternar tema' }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)
})
```

(O teste de `/login` só passa por inteiro quando a Task 5 existir. Nesta task, basta verificar o redirect pela URL; a página de login ainda dá 404, e isso é aceitável.)

- [ ] **Step 2: Rodar** `pnpm test:e2e --project=chromium` → FAIL

- [ ] **Step 3: Instalar o bloco e implementar conforme os detalhes acima**

- [ ] **Step 4: Gate + E2E**

Run: `pnpm lint && pnpm exec tsc --noEmit && pnpm test && pnpm test:e2e`
Expected: PASS nos 3 browsers. Conferir também no console do `pnpm dev` que não há warning de hidratação em `/dashboard`.

- [ ] **Step 5: Commit** `feat: adiciona layout do dashboard (dashboard-01) com tema e sidebar via config`

---

### Task 4: Variantes de sidebar trocáveis

**Files:**

- Create: `components/sidebars/sidebar-collapsible.tsx` (a partir de `pnpm dlx shadcn@latest view sidebar-07`/`add sidebar-07` em diretório temporário: copie a estrutura e não deixe o `app-sidebar.tsx`/página do bloco no projeto), `components/sidebars/sidebar-floating.tsx` (mesmo processo, a partir de `sidebar-04`)
- Modify: `components/sidebars/index.ts` (mapa real)
- Test: `src/tests/unit/sidebar-variants.test.tsx`

**Interfaces:**

- Consumes: `SidebarVariantProps`, `sidebarVariants`, `navigation`, `isNavItemActive`, `AppBrand`, `NavUser`
- Produces: `sidebarVariants.collapsible` e `sidebarVariants.floating` reais.
- Detalhes:
  - `collapsible` (sidebar-07): `collapsible="icon"`; itens com `items` usam `Collapsible` e abrem por padrão quando `isNavItemActive(item, pathname)`; rodapé com `NavUser`; header com `AppBrand`.
  - `floating` (sidebar-04): `variant="floating"`; subitens sempre visíveis (`SidebarMenuSub`); header com `AppBrand`; rodapé com `NavUser`.
  - Ambas usam `usePathname()` para o estado ativo e ignoram nada da config: todos os grupos, itens, subitens e `secondary` aparecem.
  - Se a CLI precisar de componentes ui novos (`collapsible` etc.), instalar via `shadcn add`.

- [ ] **Step 1: Escrever o teste parametrizado que falha** (`src/tests/unit/sidebar-variants.test.tsx`; Review Focus 5)

```tsx
vi.mock('next/navigation', () => ({ usePathname: () => '/gestao/clientes' }))
describe.each(Object.keys(sidebarVariants) as SidebarVariant[])(
  'variante %s',
  (variant) => {
    test(
      'renderiza todos os labels de grupo e títulos de item da config dentro do SidebarProvider',
    )
    test("marca 'Clientes' como ativo (data-active='true' no botão)") // Review Focus 1
    test('renderiza o nome do app e o nome do usuário')
  },
)
test("'collapsible' e 'floating' não são o mesmo componente que 'default'")
```

Se o `useIsMobile` do shadcn quebrar no jsdom, mockar `window.matchMedia` no próprio teste.

- [ ] **Step 2: Rodar** `pnpm test` → FAIL (o último teste falha porque ainda aponta para o default)

- [ ] **Step 3: Implementar as duas variantes e atualizar o mapa**

- [ ] **Step 4: Gate; depois, trocar manualmente `sidebarVariant` para cada valor, abrir `/dashboard` e `/gestao/clientes` no `pnpm dev`, conferir visualmente (desktop e 390px) e voltar para `'default'`**

Expected: testes PASS; as três variantes navegam e o layout não quebra.

- [ ] **Step 5: Commit** `feat: adiciona variantes de sidebar collapsible e floating trocáveis via config`

---

### Task 5: Páginas de auth (login-02)

**Files:**

- Run CLI: `pnpm dlx shadcn@latest add login-02 input-otp` (e `field`/`input`/`label` se necessário). Mover `login-form.tsx` para `components/auth/` e apagar a página do bloco gerada em `src/app/login/` (que seria substituída por `(auth)/login`).
- Create: `components/auth/auth-shell.tsx`, `components/auth/{login,signup,forgot-password,reset-password,verify}-form.tsx`, `app/(auth)/layout.tsx`, as 5 páginas
- Create: `public/auth-placeholder.svg` (ilustração neutra simples, abstrata e sem marca; pode ser um gradiente com formas geométricas)
- Test: `src/tests/e2e/auth.spec.ts`

**Interfaces:**

- Consumes: `navigation.app` (logo + nome no topo do casco)
- Produces: `AuthShell({ children })`: grid `lg:grid-cols-2`; coluna esquerda com `AppBrand`-like (ícone + nome, link para `/login`) e o form centralizado (`max-w-xs`); coluna direita `hidden lg:block` com `<Image src="/auth-placeholder.svg" ...>` cobrindo a área (dark: `dark:brightness-[0.2] dark:grayscale`, como no bloco).
- Comportamento dos forms (client components; `onSubmit` faz `preventDefault` e `router.push`; campos com `required` e `type` corretos):

| Página             | Título                 | Campos                                            | Botão → destino                                                                   | Links                                                                                           |
| ------------------ | ---------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `/login`           | "Entre na sua conta"   | E-mail, Senha                                     | "Entrar" → `/dashboard`; "Entrar com Google" (type=button, também → `/dashboard`) | "Esqueceu a senha?" → `/forgot-password`; "Não tem conta? Cadastre-se" → `/signup`              |
| `/signup`          | "Crie sua conta"       | Nome, E-mail, Senha, Confirmar senha              | "Criar conta" → `/verify`                                                         | "Já tem conta? Entrar" → `/login`                                                               |
| `/forgot-password` | "Esqueceu a senha?"    | E-mail                                            | "Enviar código" → `/verify?next=reset`                                            | "Voltar para o login" → `/login`                                                                |
| `/verify`          | "Verifique seu e-mail" | OTP de 6 dígitos (`InputOTP` com `maxLength={6}`) | "Verificar" → `/reset-password` se `next=reset`, senão `/dashboard`               | "Reenviar código" (type=button, sem efeito; `toast` "Código reenviado") ; "Voltar para o login" |
| `/reset-password`  | "Redefinir senha"      | Nova senha, Confirmar nova senha                  | "Redefinir senha" → `/login`                                                      | "Voltar para o login"                                                                           |

O `/verify` lê `next` com `useSearchParams` (envolver em `<Suspense>` na página, conforme a doc do Next 16). Cada página exporta `metadata.title` igual ao título da tabela.
Em `app/(auth)/layout.tsx`, deixar um comentário curto em pt-BR: "Proteção de rota e provedor de auth entram aqui / em `src/proxy.ts`. Veja docs/config/layout-navegacao.md" (confirmar na doc local do Next 16 que o arquivo se chama `proxy.ts`).

- [ ] **Step 1: Escrever o E2E que falha** (`src/tests/e2e/auth.spec.ts`)

```ts
test('login → dashboard') // preencher e-mail/senha, clicar "Entrar", URL /dashboard
test('fluxo esqueci a senha: forgot → verify?next=reset → reset → login') // preencher OTP '123456'
test('signup → verify → dashboard')
test('links: login ↔ signup, login → forgot-password')
test(
  'campos obrigatórios impedem navegação: clicar "Entrar" vazio permanece em /login',
)
test('mobile 390x844: imagem lateral oculta e form visível') // Review Focus 3
test('desktop 1280x800: imagem lateral visível')
```

E em `dashboard.spec.ts`, o teste do redirect passa a verificar também que o heading "Entre na sua conta" aparece.

- [ ] **Step 2: Rodar** `pnpm test:e2e --project=chromium` → FAIL

- [ ] **Step 3: Implementar**

- [ ] **Step 4: Gate + `pnpm test:e2e`** → PASS nos 3 browsers

- [ ] **Step 5: Commit** `feat: adiciona páginas de auth (login-02) com fluxo de navegação sem backend`

---

### Task 6: Páginas de exemplo

**Files:**

- Create: `app/(dashboard)/gestao/clientes/page.tsx`, `app/(dashboard)/[...slug]/page.tsx`, `components/under-construction.tsx`
- Modify: `src/tests/e2e/dashboard.spec.ts`

**Interfaces:**

- Consumes: componentes ui `table`, `card`, `badge`, `button`, `input` (já instalados)
- Detalhes:
  - `/gestao/clientes` ("Clientes"): título + descrição, input de busca (filtra no cliente por nome) e `Table` com 8 clientes fictícios definidos em array no arquivo (colunas: Nome, E-mail, Status [Badge Ativo/Inativo], Desde). Comentário no topo: "Exemplo de seção: crie a rota e adicione em src/config/navigation.ts".
  - `UnderConstruction()`: Card centralizado com ícone Remix, título "Em construção", texto "Esta seção ainda não foi implementada." e botão "Voltar ao dashboard" → `/dashboard`.
  - `[...slug]/page.tsx`: monta o pathname a partir de `params.slug` (`params` é Promise no Next 16; conferir na doc local), chama `notFound()` se `!isKnownNavPath(pathname)` e, caso contrário, renderiza `UnderConstruction`. Assim, todo item da config sem página própria mostra o placeholder, e rotas desconhecidas dão 404. Rotas específicas (`/dashboard`, `/gestao/clientes`) têm precedência sobre o catch-all.

- [ ] **Step 1: Adicionar testes E2E que falham**

```ts
test('navegar pela sidebar até Clientes mostra tabela e breadcrumb "Clientes"')
test('busca em Clientes filtra as linhas')
test(
  "item 'Equipe' leva para Em construção (/configuracoes/equipe) com breadcrumb 'Equipe' e o botão volta ao dashboard",
)
test("'/nao-existe' responde 404")
test(
  'mobile 390x844: trigger abre a sidebar como sheet e o link Clientes navega',
) // Review Focus 3
```

- [ ] **Step 2: Rodar** → FAIL

- [ ] **Step 3: Implementar**

- [ ] **Step 4: Gate + `pnpm test:e2e`** → PASS

- [ ] **Step 5: Commit** `feat: adiciona páginas de exemplo (clientes e em construção)`

---

### Task 7: Documentação e verificação final

**Files:**

- Modify: `README.md`, `AGENTS.md`, `docs/config/stack-geral.md` (se listar estrutura)
- Create: `docs/config/layout-navegacao.md`

Conteúdo obrigatório:

- **README:** o que é o template (dashboard-01 + auth só layout); seção "Trocar a sidebar" (valores de `sidebarVariant` em `src/config/layout.ts`, com o bloco shadcn de origem de cada um); "Adicionar uma seção" (criar rota em `src/app/(dashboard)/…` e item em `src/config/navigation.ts`); "Adicionar uma nova variante de sidebar" (criar em `components/sidebars/`, receber `SidebarVariantProps`, registrar em `sidebarVariants`, e o teste parametrizado cobre automaticamente); "Onde plugar a autenticação" (forms em `components/auth/`, proteção via `src/proxy.ts`); estrutura de pastas atualizada. Manter as seções de tooling herdadas.
- **AGENTS.md:** convenções novas: navegação apenas via config, sidebar apenas via `sidebarVariants`, componentes shadcn sempre pela CLI no estilo `base-nova`.
- **docs/config/layout-navegacao.md:** detalhes dos tipos, das regras do `getBreadcrumbs` e `isNavItemActive` e do contrato das variantes.

- [ ] **Step 1: Escrever a documentação**

- [ ] **Step 2: Verificação final completa**

Run: `pnpm format && pnpm lint && pnpm exec tsc --noEmit && pnpm test && pnpm build && pnpm test:e2e`
Expected: tudo passa; `git status` limpo depois do commit.

- [ ] **Step 3: Commit e push**

```bash
git add -A && git commit -m "docs: documenta layout, navegação e variantes de sidebar"
git push
```

Expected: o pre-push passa e `gh repo view dashboard-template --web` mostra o README atualizado.
