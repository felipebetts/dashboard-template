import { redirect } from 'next/navigation'

// Por enquanto a home leva direto ao dashboard. Quando houver autenticação,
// a proteção de rota (src/proxy.ts) decide entre /login e /dashboard.
export default function Home() {
  redirect('/dashboard')
}
