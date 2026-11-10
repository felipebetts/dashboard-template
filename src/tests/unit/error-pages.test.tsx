import { fireEvent, render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { describe, expect, test, vi } from 'vitest'

import DashboardError from '@/app/(dashboard)/error'
import GlobalError from '@/app/global-error'

const makeError = (digest?: string) =>
  Object.assign(new Error('falhou'), digest ? { digest } : {})

describe('(dashboard)/error', () => {
  test('mostra título, descrição e o código do erro quando houver digest', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<DashboardError error={makeError('abc123')} retry={() => {}} />)
    expect(
      screen.getByRole('heading', { name: 'Algo deu errado' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/abc123/)).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Voltar ao dashboard' }),
    ).toHaveAttribute('href', '/dashboard')
  })

  test("'Tentar novamente' chama retry", () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const retry = vi.fn()
    render(<DashboardError error={makeError()} retry={retry} />)
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect(retry).toHaveBeenCalledOnce()
  })

  test('registra o erro no console', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const error = makeError()
    render(<DashboardError error={error} retry={() => {}} />)
    expect(spy).toHaveBeenCalledWith(error)
  })
})

describe('global-error', () => {
  test('renderiza o próprio documento em pt-BR com título e ação de recarregar', () => {
    const html = renderToString(
      <GlobalError error={makeError()} retry={() => {}} />,
    )
    expect(html).toContain('<html lang="pt-BR"')
    expect(html).toContain('Algo deu errado')
    expect(html).toContain('Tentar novamente')
    expect(html).toContain('<title>')
  })
})
