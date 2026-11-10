'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { toast } from 'sonner'

import { AuthFormHeader } from '@/components/auth/auth-form-header'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'

const OTP_LENGTH = 6

// Só layout: qualquer código de 6 dígitos é aceito. `?next=reset` (vindo do
// "esqueci a senha") leva à redefinição; caso contrário, ao dashboard.
export function VerifyForm() {
  const router = useRouter()
  const next = useSearchParams().get('next')
  const [code, setCode] = useState('')
  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault()
        if (code.length < OTP_LENGTH) return
        router.push(next === 'reset' ? '/reset-password' : '/dashboard')
      }}
    >
      <FieldGroup>
        <AuthFormHeader
          title="Verifique seu e-mail"
          description="Digite o código de 6 dígitos que enviamos para o seu e-mail"
        />
        <Field className="items-center">
          <FieldLabel htmlFor="otp" className="sr-only">
            Código de verificação
          </FieldLabel>
          <InputOTP
            id="otp"
            maxLength={OTP_LENGTH}
            value={code}
            onChange={setCode}
            required
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </Field>
        <Field>
          <Button type="submit" disabled={code.length < OTP_LENGTH}>
            Verificar
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => toast('Código reenviado')}
          >
            Reenviar código
          </Button>
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
