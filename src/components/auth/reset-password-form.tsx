'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { AuthFormHeader } from '@/components/auth/auth-form-header'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

// Só layout: o submit apenas volta para o login.
export function ResetPasswordForm() {
  const router = useRouter()
  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault()
        router.push('/login')
      }}
    >
      <FieldGroup>
        <AuthFormHeader
          title="Redefinir senha"
          description="Escolha uma nova senha para sua conta"
        />
        <Field>
          <FieldLabel htmlFor="password">Nova senha</FieldLabel>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">
            Confirmar nova senha
          </FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            required
          />
        </Field>
        <Field>
          <Button type="submit">Redefinir senha</Button>
          <FieldDescription className="text-center">
            <Link href="/login" className="underline underline-offset-4">
              Voltar para o login
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
