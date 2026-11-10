import { expect, test } from '@playwright/test'

test("'/' redireciona para '/login'", async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/login$/)
  await expect(
    page.getByRole('heading', { name: 'Entre na sua conta' }),
  ).toBeVisible()
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

test('navegar pela sidebar até Clientes mostra tabela e breadcrumb', async ({
  page,
}) => {
  await page.goto('/dashboard')
  await page.getByRole('link', { name: 'Clientes' }).click()
  await expect(page).toHaveURL(/\/gestao\/clientes$/)
  await expect(
    page.getByRole('navigation', { name: /breadcrumb/i }),
  ).toContainText('Clientes')
  await expect(page.getByRole('table')).toBeVisible()
  await expect(page.getByRole('row')).toHaveCount(9)
})

test('busca em Clientes filtra as linhas', async ({ page }) => {
  await page.goto('/gestao/clientes')
  await page.getByPlaceholder('Buscar por nome').fill('ana')
  await expect(page.getByRole('row')).toHaveCount(2)
  await page.getByPlaceholder('Buscar por nome').fill('zzz')
  await expect(page.getByText('Nenhum cliente encontrado.')).toBeVisible()
})

test("item 'Equipe' leva para Em construção e o botão volta ao dashboard", async ({
  page,
}) => {
  await page.goto('/dashboard')
  await page.getByRole('link', { name: 'Equipe' }).click()
  await expect(page).toHaveURL(/\/configuracoes\/equipe$/)
  await expect(
    page.getByRole('navigation', { name: /breadcrumb/i }),
  ).toContainText('Equipe')
  await expect(page.getByText('Em construção')).toBeVisible()
  await page.getByRole('link', { name: 'Voltar ao dashboard' }).click()
  await expect(page).toHaveURL(/\/dashboard$/)
})

test("'/nao-existe' responde 404", async ({ page }) => {
  const response = await page.goto('/nao-existe')
  expect(response?.status()).toBe(404)
})

test.describe('mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } })
  test('trigger abre a sidebar como sheet e o link Clientes navega', async ({
    page,
  }) => {
    await page.goto('/dashboard')
    await expect(page.getByRole('link', { name: 'Clientes' })).toBeHidden()
    await page.getByRole('button', { name: 'Toggle Sidebar' }).click()
    await page.getByRole('link', { name: 'Clientes' }).click()
    await expect(page).toHaveURL(/\/gestao\/clientes$/)
  })
})
