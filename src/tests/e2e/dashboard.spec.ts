import { expect, test } from '@playwright/test'

test("'/' redireciona para '/login'", async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/login$/)
})

test('dashboard renderiza sidebar com os grupos da config', async ({
  page,
}) => {
  await page.goto('/dashboard')
  for (const label of ['Geral', 'Gestão', 'Configurações']) {
    await expect(page.getByText(label, { exact: true }).first()).toBeVisible()
  }
  await expect(page.getByRole('link', { name: 'Clientes' })).toBeVisible()
})

test('breadcrumb mostra Dashboard', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(
    page.getByRole('navigation', { name: /breadcrumb/i }),
  ).toContainText('Dashboard')
})

test('alternar tema adiciona a classe dark no html', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/dashboard')
  await expect(page.locator('html')).not.toHaveClass(/dark/)
  await page.getByRole('button', { name: 'Alternar tema' }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)
})
