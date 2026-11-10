import { AuthShell } from '@/components/auth/auth-shell'

// Páginas de auth são só layout. O provedor de auth entra nos forms de
// `components/auth/`, e a proteção de rota em `src/proxy.ts`.
// Veja docs/config/layout-navegacao.md.
export default function AuthLayout({ children }: LayoutProps<'/'>) {
  return <AuthShell>{children}</AuthShell>
}
