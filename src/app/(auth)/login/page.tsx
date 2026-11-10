import type { Metadata } from 'next'

import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = { title: 'Entre na sua conta' }

export default function Page() {
  return <LoginForm />
}
