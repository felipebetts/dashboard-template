import type { SidebarVariant } from '@/components/sidebars/types'

/**
 * Variante de sidebar usada pelo layout do dashboard. Trocar este valor
 * troca a sidebar do app inteiro:
 * - 'default'     → bloco shadcn `dashboard-01` (inset, some por completo ao recolher)
 * - 'collapsible' → bloco `sidebar-07` (submenus colapsáveis, recolhe para ícones)
 * - 'floating'    → bloco `sidebar-04` (flutuante, submenus sempre visíveis)
 */
export const sidebarVariant: SidebarVariant = 'floating'
