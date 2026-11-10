# Dashboard Template — Design

Data: 2026-11-10

## Intenção e porquê

Criar um template de dashboard reutilizável, partindo do boilerplate `nextjs-16-boilerplate` (GitHub do autor, clonado em `~/Developer/templates/nextjs-16-boilerplate`). O template é uma base **genérica e enxuta**: layout de app autenticado (sidebar + header), páginas de autenticação (só layout) e convenções para crescer.

O primeiro uso real será o "hub central" de uma empresa de serviços: funis estilo CRM, financeiro, projeções, funcionários, clientes, serviços, orçamentos, propostas, jobs, processos, documentos e, no futuro, chat com agentes de IA. Por isso a estrutura precisa suportar **dezenas de seções agrupadas** sem virar bagunça. Essas páginas de negócio **não** fazem parte do template.

## Objetivos

1. Repositório novo (sem o histórico do boilerplate), criado no GitHub do autor como `dashboard-template`, **público** (mesmo esquema do boilerplate).
2. Layout de dashboard baseado no bloco shadcn `dashboard-01`.
3. Sidebar facilmente trocável entre variantes de blocos shadcn, alterando uma linha.
4. Navegação definida em um único arquivo de config, consumido por todas as variantes de sidebar.
5. Páginas de auth no estilo `login-02`: login, cadastro, esqueci a senha, redefinir senha, verificação por código.
6. Documentação (README + `docs/`) explicando como trocar a sidebar e adicionar seções.

## Não-objetivos

- Implementação de autenticação (provedor, sessão, middleware de proteção de rota).
- Banco de dados, APIs, dados reais.
- Páginas de negócio (CRM, financeiro etc.).
- Chat/agentes de IA.
- Páginas extras de auth (convite de equipe, escolha de organização etc.).

## Anti-objetivos (seria falha mesmo funcionando)

- Trocar a sidebar exigir editar várias partes do código ou duplicar a lista de links.
- Componentes convertidos à mão para Radix/Lucide, quebrando a coerência com o estilo `base-nova` (Base UI + Remix Icon) do boilerplate.
- Remover ou quebrar o tooling herdado (lint, testes, Husky, `AGENTS.md`).

## Restrições

- Next.js 16 (App Router) — APIs diferentes de versões anteriores; consultar `node_modules/next/dist/docs/` antes de mexer em config/rotas (regra do `AGENTS.md`).
- pnpm como único package manager.
- shadcn com `style: base-nova`, `iconLibrary: remixicon`. Blocos e componentes devem ser instalados pela CLI do shadcn (`pnpm dlx shadcn@latest add ...`).
- Verificado no registry: `dashboard-01`, `login-02`, `signup-02`, `sidebar-0X` e o componente `input-otp` existem para `base-nova`. **Os blocos `otp-0X` não existem para `base-nova`** — a página de verificação é montada à mão com `input-otp`.
- Textos de UI em português (pt-BR), seguindo o idioma dos projetos do autor. _(decisão minha)_

## Decisões do autor

- **Dashboard:** `dashboard-01`.
- **Sidebar trocável** para outras variantes de bloco shadcn, por ser um template para projetos diferentes.
- **Auth:** login, cadastro, esqueci a senha, redefinir senha, verificação por código. Nenhuma outra por enquanto.
- **Estilo de auth:** `login-02` (duas colunas, formulário à esquerda, imagem à direita).
- **Repositório:** novo, do zero, criado no GitHub do autor.

## Como funciona

### Rotas

```
src/app/
  page.tsx                      → redirect para /login
  (auth)/
    layout.tsx                  → casco login-02 (logo + form à esquerda, imagem à direita; imagem some no mobile)
    login/page.tsx
    signup/page.tsx
    forgot-password/page.tsx
    reset-password/page.tsx
    verify/page.tsx             → OTP com input-otp
  (dashboard)/
    layout.tsx                  → SidebarProvider + AppSidebar + SidebarInset + SiteHeader
    dashboard/page.tsx          → conteúdo do dashboard-01 (cards, gráfico, tabela; data.json fictício)
    <exemplo>/page.tsx          → 1–2 páginas de exemplo (ver abaixo)
```

### Auth (só layout)

- Formulários não enviam nada. "Entrar" (login) e "Criar conta" (cadastro) navegam para `/dashboard`; "Enviar link" (esqueci a senha) navega para `/verify`; "Verificar" navega para `/reset-password`; "Redefinir" navega para `/login`. Links login ↔ cadastro e login → esqueci a senha.
- Os formulários são componentes isolados (ex.: `components/auth/login-form.tsx`) para que a lógica real entre depois sem mexer no layout.
- Comentário/doc indicando onde entrariam o provedor de auth e a proteção de rota (`proxy`/middleware no Next 16 — verificar nome na doc local).

### Sidebar trocável

- `components/sidebars/` contém as variantes, cada uma exportando um componente com a mesma interface (recebe/lê a navegação do config):
  - `sidebar-default.tsx` — a do `dashboard-01`.
  - `sidebar-collapsible.tsx` — baseada em `sidebar-07` (submenus colapsáveis + recolhe para ícones).
  - `sidebar-floating.tsx` — baseada em `sidebar-04` (flutuante, submenus). _(escolha das variantes é decisão minha; outras podem ser adicionadas seguindo o mesmo padrão)_
- `components/app-sidebar.tsx` reexporta a variante ativa. Trocar de sidebar = mudar uma linha (import ou um valor em `config/`). Componentes compartilhados (`nav-user`, cabeçalho com logo/nome do app) ficam fora das variantes e são reutilizados.
- Variantes que dependem de props do `SidebarProvider`/`Sidebar` (`variant="inset"`, `"floating"`, `collapsible="icon"`) declaram isso dentro da própria variante, para o layout não precisar mudar.

### Navegação

- `src/config/navigation.ts`: grupos → itens (título, href, ícone Remix, subitens opcionais), além de itens secundários (rodapé) e o usuário fictício.
- Tipada com TypeScript. Todas as variantes leem daqui.
- Exemplo de conteúdo genérico, com 2–3 grupos (ex.: "Geral", "Gestão", "Configurações"), não específico de um negócio. _(decisão minha)_

### Header

- `SiteHeader` do `dashboard-01`, com o trigger da sidebar, breadcrumb derivado da rota/config de navegação e toggle de tema claro/escuro (`next-themes`).

### Páginas de exemplo _(decisão minha)_

- Uma página genérica de lista e uma página "em construção", mostrando como adicionar uma seção (criar rota + adicionar ao `navigation.ts`). Itens da navegação sem página apontam para a "em construção" ou para `#`.

### Testes e docs

- E2E (Playwright): fluxo login → dashboard e navegação entre páginas de auth. Substitui o `home.spec.ts` do boilerplate.
- Unitário (Vitest): validação da config de navegação (hrefs únicos, campos obrigatórios); substitui o `page.test.tsx` da home.
- Artefatos do Playwright (`playwright-report/`, `test-results/`) existem só localmente no boilerplate (já estão no `.gitignore`, não versionados); a cópia deve partir apenas dos arquivos versionados.
- README: o que é o template, como trocar a sidebar, como adicionar seção/navegação, onde plugar auth. Atualizar `AGENTS.md` com as convenções novas. Novo doc em `docs/config/` sobre layout/navegação.

## Deixado para quem implementa

- Estrutura exata de props compartilhada entre variantes de sidebar.
- Imagem do lado direito do auth (placeholder neutro, sem marca).
- Ajustes de nomes de arquivos para passar no lint `check-file` do boilerplate.
- Se o breadcrumb é derivado da URL ou da config.
