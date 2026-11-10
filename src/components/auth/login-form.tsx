'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { RiGoogleFill } from '@remixicon/react'

import { AuthFormHeader } from '@/components/auth/auth-form-header'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

// Só layout: o submit apenas navega. Plugue aqui a chamada ao provedor de auth.
export function LoginForm() {
  const router = useRouter()
  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault()
        router.push('/dashboard')
      }}
    >
      <FieldGroup>
        <AuthFormHeader
          title="Entre na sua conta"
          description="Informe seu e-mail abaixo para acessar sua conta"
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
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Senha</FieldLabel>
            <Link
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </Field>
        <Field>
          <Button type="submit">Entrar</Button>
        </Field>
        <FieldSeparator>Ou continue com</FieldSeparator>
        <Field>
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push('/dashboard')}
          >
            <RiGoogleFill />
            Entrar com Google
          </Button>
          <FieldDescription className="text-center">
            Não tem conta?{' '}
            <Link href="/signup" className="underline underline-offset-4">
              Cadastre-se
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
