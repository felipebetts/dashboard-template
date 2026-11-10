import Link from 'next/link'

import { RiToolsLine } from '@remixicon/react'

import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

/** Placeholder para seções da navegação que ainda não têm página própria. */
export function UnderConstruction() {
  return (
    <div className="flex flex-1 items-center justify-center p-4 lg:p-6">
      <Card className="w-full max-w-sm text-center">
        <CardHeader className="items-center">
          <div className="bg-muted mx-auto mb-2 flex size-12 items-center justify-center rounded-full">
            <RiToolsLine className="text-muted-foreground size-6" />
          </div>
          <CardTitle>Em construção</CardTitle>
          <CardDescription>
            Esta seção ainda não foi implementada.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Link href="/dashboard" className={buttonVariants()}>
            Voltar ao dashboard
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
