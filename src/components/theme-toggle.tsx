'use client'

import { RiMoonLine, RiSunLine } from '@remixicon/react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

/** Alterna entre tema claro e escuro (ícone trocado via CSS para evitar mismatch de hidratação). */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Alternar tema"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <RiSunLine className="hidden dark:block" />
      <RiMoonLine className="dark:hidden" />
    </Button>
  )
}
