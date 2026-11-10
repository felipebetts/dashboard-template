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

// Só layout: o submit navega para a verificação, que depois leva à redefinição.
export function ForgotPasswordForm() {
  const router = useRouter()
  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault()
        router.push('/verify?next=reset')
      }}
    >
      <FieldGroup>
        <AuthFormHeader
          title="Esqueceu a senha?"
          description="Informe seu e-mail e enviaremos um código para redefinir a senha"
        />
        <Field>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            required
          />
        </Field>
        <Field>
          <Button type="submit">Enviar código</Button>
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
