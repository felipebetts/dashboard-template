import type { Metadata } from 'next'
import { Suspense } from 'react'

import { VerifyForm } from '@/components/auth/verify-form'

export const metadata: Metadata = { title: 'Verifique seu e-mail' }

// VerifyForm lê `?next` com useSearchParams, que exige um Suspense boundary
// para a página continuar sendo pré-renderizada.
export default function Page() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  )
}
