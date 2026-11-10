import { expect, test } from '@playwright/test'

test('login → dashboard', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('E-mail').fill('usuario@exemplo.com')
  await page.getByLabel('Senha').fill('senha123')
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()
  await expect(page).toHaveURL(/\/dashboard$/)
})

test('fluxo esqueci a senha: forgot → verify → reset → login', async ({
  page,
}) => {
  await page.goto('/forgot-password')
  await expect(
    page.getByRole('heading', { name: 'Esqueceu a senha?' }),
  ).toBeVisible()
  await page.getByLabel('E-mail').fill('usuario@exemplo.com')
  await page.getByRole('button', { name: 'Enviar código' }).click()
  await expect(page).toHaveURL(/\/verify\?next=reset$/)
  await page.getByRole('textbox').first().click()
  await page.keyboard.type('123456')
  await page.getByRole('button', { name: 'Verificar' }).click()
  await expect(page).toHaveURL(/\/reset-password$/)
  await page.getByLabel('Nova senha', { exact: true }).fill('nova-senha')
  await page.getByLabel('Confirmar nova senha').fill('nova-senha')
  await page.getByRole('button', { name: 'Redefinir senha' }).click()
  await expect(page).toHaveURL(/\/login$/)
})

test('signup → verify → dashboard', async ({ page }) => {
  await page.goto('/signup')
  await page.getByLabel('Nome').fill('Fulano')
  await page.getByLabel('E-mail').fill('fulano@exemplo.com')
  await page.getByLabel('Senha', { exact: true }).fill('senha123')
  await page.getByLabel('Confirmar senha').fill('senha123')
  await page.getByRole('button', { name: 'Criar conta' }).click()
  await expect(page).toHaveURL(/\/verify$/)
  await page.getByRole('textbox').first().click()
  await page.keyboard.type('123456')
  await page.getByRole('button', { name: 'Verificar' }).click()
  await expect(page).toHaveURL(/\/dashboard$/)
})

test('links: login ↔ signup, login → forgot-password', async ({ page }) => {
  await page.goto('/login')
  await page.getByRole('link', { name: 'Cadastre-se' }).click()
  await expect(page).toHaveURL(/\/signup$/)
  await page.getByRole('link', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/login$/)
  await page.getByRole('link', { name: 'Esqueceu a senha?' }).click()
  await expect(page).toHaveURL(/\/forgot-password$/)
})

test('campos obrigatórios impedem navegação', async ({ page }) => {
  await page.goto('/login')
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()
  await expect(page).toHaveURL(/\/login$/)
})

test.describe('mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } })
  test('imagem lateral oculta e form visível', async ({ page }) => {
    await page.goto('/login')
    await expect(
      page.getByRole('heading', { name: 'Entre na sua conta' }),
    ).toBeVisible()
    await expect(page.getByTestId('auth-image')).toBeHidden()
  })
})

test('desktop: imagem lateral visível', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/login')
  await expect(page.getByTestId('auth-image')).toBeVisible()
})
