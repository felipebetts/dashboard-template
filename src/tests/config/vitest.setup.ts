import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Sem `globals: true`, o Testing Library não registra o cleanup automático;
// sem isso, renders de testes anteriores ficam no DOM.
afterEach(() => {
  cleanup()
})
