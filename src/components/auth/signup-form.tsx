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

// Só layout: o submit apenas navega para a verificação de e-mail.
export function SignupForm() {
  const router = useRouter()
  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault()
        router.push('/verify')
      }}
    >
      <FieldGroup>
        <AuthFormHeader
          title="Crie sua conta"
          description="Preencha os dados abaixo para criar sua conta"
        />
        <Field>
          <FieldLabel htmlFor="name">Nome</FieldLabel>
          <Input id="name" type="text" autoComplete="name" required />
        </Field>
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
          <FieldLabel htmlFor="password">Senha</FieldLabel>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirmar senha</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            required
          />
        </Field>
        <Field>
          <Button type="submit">Criar conta</Button>
          <FieldDescription className="text-center">
            Já tem conta?{' '}
            <Link href="/login" className="underline underline-offset-4">
              Entrar
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
