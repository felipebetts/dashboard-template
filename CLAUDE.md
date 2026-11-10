@AGENTS.md

# Claude Code

Toda a orientação do projeto (comandos, arquitetura, convenções, política de docs) está no `AGENTS.md`, importado acima, para que todos os coding agents compartilhem uma única fonte. Mantenha este arquivo restrito ao que só o Claude Code entende; qualquer coisa independente de ferramenta vai no `AGENTS.md`.

- Subagents do projeto ficam em `.claude/agents/` (`explorer`, `code-reviewer`, `test-runner`); settings do projeto (plugins habilitados) em `.claude/settings.json`.
