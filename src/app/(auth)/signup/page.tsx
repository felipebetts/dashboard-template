import type { Metadata } from 'next'

import { SignupForm } from '@/components/auth/signup-form'

export const metadata: Metadata = { title: 'Crie sua conta' }

export default function Page() {
  return <SignupForm />
}
