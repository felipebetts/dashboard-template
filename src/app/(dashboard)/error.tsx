'use client'

import { type ErrorPageProps, ErrorState } from '@/components/error-state'

// Erros nas páginas do dashboard: a sidebar e o header continuam na tela.
export default function DashboardError(props: ErrorPageProps) {
  return <ErrorState {...props} />
}
