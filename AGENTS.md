<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

Guia para qualquer coding agent (Codex, Cursor, Copilot, Gemini, Claude Code etc.) trabalhando neste repositório. Instruções exclusivas de uma ferramenta ficam no arquivo dela (ex.: `CLAUDE.md`, que importa este). Escreva sempre fora dos marcadores `nextjs-agent-rules` acima — o `next dev` reescreve o conteúdo entre eles (por isso aquele bloco fica em inglês).

## Projeto

> **Instrução de setup (autorremovível):** a descrição abaixo ainda é a genérica do boilerplate. Pergunte ao usuário qual é o projeto real sendo construído aqui (nome, propósito/domínio, usuários-alvo) antes de fazer qualquer outro trabalho. Com a resposta: (1) reescreva esta seção "Projeto" descrevendo o projeto real (mantenha os fatos do stack — Next.js 16 App Router, TypeScript strict, Tailwind v4 + shadcn/ui, Vitest + Playwright, ESLint + Prettier — que continuam verdadeiros); (2) reescreva o título e o parágrafo de abertura do `README.md` da mesma forma; (3) adicione uma entrada em `docs/notas.md` registrando o início do projeto; (4) apague este bloco de instrução para que a pergunta não seja feita de novo.

Template de dashboard em Next.js 16 (App Router), feito para ser clonado como ponto de partida de painéis/admins, e não um produto com features: layout do bloco shadcn `dashboard-01` com sidebar trocável por config, navegação centralizada e páginas de autenticação (só layout, sem auth implementado). Stack: TypeScript strict, Tailwind CSS v4 + shadcn/ui, Vitest + Playwright, ESLint + Prettier. Derivado do `nextjs-16-boilerplate`.

## Comandos

pnpm é o único package manager suportado (fixado em `packageManager` no `package.json`) — nunca use `npm`/`yarn` neste repo.

- `pnpm install` — instala dependências (e ativa os git hooks via `prepare`)
- `pnpm dev` / `pnpm build` / `pnpm start` — servidor de dev / build de produção / serve do build
- `pnpm lint` — ESLint (flat config)
- `pnpm format` — Prettier, escreve no repo inteiro
- `pnpm test` — testes unitários uma vez (Vitest)
- `pnpm test:watch` — testes unitários em watch
- `pnpm test:e2e` — Playwright E2E; builda e sobe o app na porta 3100 antes, então é bem mais lento que o unitário
- Um arquivo de teste unitário: `pnpm test src/tests/unit/page.test.tsx` (filtros da CLI do Vitest, ex. `-t <nome>`, funcionam pelo script)
- Um spec E2E: `pnpm test:e2e src/tests/e2e/home.spec.ts`

## Armadilhas de arquitetura

Só o que um agente erraria sem aviso. O detalhe de cada item está no doc da área linkado.

- **Layout de testes não-padrão**: configs em `src/tests/config/`, unitários em `src/tests/unit/`, E2E em `src/tests/e2e/` — nada na raiz. Rode testes sempre pelos scripts `pnpm test*`; chamar `vitest`/`playwright` direto sem `--config` não resolve. → [`docs/config/testes.md`](docs/config/testes.md)
- **Tailwind v4 sem `tailwind.config.js`**: tokens de tema (cores, radius, dark mode) ficam em `src/app/globals.css` (`@theme inline`, `:root`, `.dark`). Mude o design system lá, não com utilitárias espalhadas. → [`docs/config/estilizacao.md`](docs/config/estilizacao.md)
- **shadcn/ui em `base-nova`**, baseado em `@base-ui/react` (não Radix). Ícones novos com `@remixicon/react`; `lucide-react` é resquício do `create-next-app`. → [`docs/config/estilizacao.md`](docs/config/estilizacao.md)
- **Componentes de UI são gerados, não escritos à mão**: reutilize `src/components/ui`; se faltar, `pnpm dlx shadcn@latest add <componente>`; escrever à mão só em último caso, seguindo o `button.tsx` (primitivo base-ui + `cva` + `cn` + `data-slot`). → [`docs/config/estilizacao.md`](docs/config/estilizacao.md)
- **Alias `@/*` → `src/*`** no `tsconfig.json` e nos `aliases` do `components.json`. Se `src/components/ui` ou `src/lib` mudarem de lugar, atualize o `components.json` também. → [`docs/config/stack-geral.md`](docs/config/stack-geral.md)
- **Env vars centralizadas** em `src/utils/env.ts` via `requireEnv(name, optional?)`; nunca leia `process.env` direto no resto do app. → [`docs/config/stack-geral.md`](docs/config/stack-geral.md)
- **Nomes de arquivo/pasta impostos pelo ESLint** (`eslint-plugin-check-file`): `.ts`/`.tsx` em `KEBAB_CASE`; pastas em `src/app/**` na convenção do App Router (`(group)`, `[slug]`, `[...catchAll]`). → [`docs/config/lint-formatacao.md`](docs/config/lint-formatacao.md)
- **Git hooks**: o `pre-commit` roda ESLint/Prettier nos arquivos staged e o `pre-push` roda `pnpm test`; não use `--no-verify` para contornar. → [`docs/config/husky.md`](docs/config/husky.md)

## Documentação

### Onde cada informação mora

Cada fato tem um único dono; os outros arquivos só resumem e linkam.

| Arquivo                 | Público     | Dono de                                                                                                          |
| ----------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------- |
| `README.md`             | Humanos     | Visão geral, requisitos, como rodar, scripts, resumo de 2–3 linhas por área + link. Sem detalhe de configuração. |
| `AGENTS.md`             | Agentes     | Comandos e armadilhas que um agente erraria sem aviso, uma linha cada + link. Sem explicar o porquê.             |
| `CLAUDE.md`             | Claude Code | Só `@AGENTS.md` + o que é exclusivo do Claude Code.                                                              |
| `docs/config/<area>.md` | Ambos       | Fonte da verdade do _como e por quê_ de cada parte do stack.                                                     |
| `docs/notas.md`         | Ambos       | Log datado de decisões, restrições e aprendizados que não pertencem a uma área.                                  |

### Ao mudar algo

1. Mudou tooling/config de forma não-cosmética (testes, lint, estilização, env, Next.js, package manager, hooks)? Atualize o `docs/config/<area>.md` correspondente — ou crie um novo se não couber em nenhum.
2. A mudança altera um fato resumido no `README.md` ou no `AGENTS.md` (comando, caminho, regra)? Atualize o resumo lá também. Doc novo em `docs/config/` entra na lista da seção "Documentação" do `README.md`.
3. Decisão ou aprendizado que outra sessão teria que redescobrir? Entrada datada em `docs/notas.md`. Se uma mudança deixar uma entrada antiga falsa, marque-a como obsoleta.
4. Nenhum arquivo de docs pode descrever um estado do repo que não existe mais.

### Convenções de escrita

- **Idioma**: toda a documentação é em português. A única exceção é o bloco gerado pelo Next.js no topo deste arquivo.
- **Formato de `docs/config/<area>.md`**: título `# Área (ferramentas)`, parágrafo de abertura dizendo o que o doc cobre, uma seção por arquivo de config/ferramenta explicando o porquê de cada escolha não-padrão, e uma seção final `## Resumo prático` com uma tabela.
- **Nomes de arquivo** em `docs/`: kebab-case, em português.
- **Formatação**: Markdown passa pelo Prettier (`pnpm format`, e o `pre-commit` formata os `.md` staged).
