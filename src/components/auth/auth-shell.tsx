import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { navigation } from '@/config/navigation'

/** Casco das páginas de auth — bloco shadcn `login-02` (form à esquerda, imagem à direita). */
export function AuthShell({ children }: { children: ReactNode }) {
  const { app } = navigation
  const Icon = app.icon
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/login" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Icon className="size-4" />
            </div>
            {app.name}
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      <div
        data-testid="auth-image"
        className="bg-muted relative hidden lg:block"
      >
        <Image
          src="/auth-placeholder.svg"
          alt=""
          fill
          priority
          className="object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
