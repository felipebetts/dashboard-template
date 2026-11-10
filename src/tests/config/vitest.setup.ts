import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Sem `globals: true`, o Testing Library não registra o cleanup automático;
// sem isso, renders de testes anteriores ficam no DOM.
afterEach(() => {
  cleanup()
})

// `next/font` só funciona com o compilador do Next; nos testes, cada fonte
// vira um objeto com classes vazias.
vi.mock('next/font/google', () => {
  const font = () => ({ className: '', variable: '', style: {} })
  return { Figtree: font, Geist_Mono: font, Noto_Sans: font }
})

// jsdom não implementa matchMedia (usado pelo useIsMobile do shadcn e pelo
// next-themes).
window.matchMedia ??= ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
  dispatchEvent: () => false,
})) as typeof window.matchMedia
