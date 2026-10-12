import { expect, test, type Page } from '@playwright/test'

async function noHorizontalScroll(page: Page) {
  const { scroll, width } = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    width: window.innerWidth,
  }))
  expect(scroll).toBeLessThanOrEqual(width)
}

async function fillDate(page: Page, label: RegExp | string, iso: string) {
  await page.getByLabel(label).fill(iso)
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test("s'ouvre vide, sans défilement horizontal", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Mes points de permis' })).toBeVisible()
  await expect(page.getByText("Indiquez la date d'obtention de votre permis")).toBeVisible()
  await expect(page.getByText('Aucune infraction saisie.')).toBeVisible()
  await expect(page.getByText('Estimation indicative : le solde officiel est tenu par le ministère de l\'Intérieur.').first()).toBeVisible()
  await noHorizontalScroll(page)
})

test('ordre mobile : solde, puis saisies, puis chronologie', async ({ page }) => {
  const y = async (name: string) => (await page.getByRole('heading', { name, exact: true }).boundingBox())!.y
  const solde = await page.locator('#result-title').boundingBox()
  expect(solde!.y).toBeLessThan(await y('Mon permis'))
  expect(await y('Mon permis')).toBeLessThan(await y('Mes infractions et stages'))
  expect(await y('Mes infractions et stages')).toBeLessThan(await y('Chronologie'))
})

test('parcours complet : permis, infraction via le panneau, solde et chronologie', async ({ page }) => {
  await fillDate(page, "Date d'obtention du permis", '2000-01-01')
  await fillDate(page, 'Date de calcul', '2024-06-01')
  await expect(page.locator('#result-title').locator('..').locator('..')).toContainText('12')

  await page.getByRole('button', { name: /Ajouter une infraction/ }).click()
  const sheet = page.getByRole('dialog')
  await expect(sheet).toBeVisible()
  await sheet.getByRole('searchbox').fill('feu rouge')
  await sheet.getByRole('button', { name: /Franchissement d’un feu rouge/ }).click()
  await fillDate(page, "Date de l'infraction", '2024-03-10')
  const add = sheet.getByRole('button', { name: 'Ajouter', exact: true })
  // Bouton « Ajouter » accessible au pouce : en bas de l'écran
  const box = (await add.boundingBox())!
  const vh = page.viewportSize()!.height
  expect(box.y + box.height).toBeGreaterThan(vh * 0.8)
  await add.click()
  await expect(sheet).toBeHidden()

  await expect(page.getByText('Franchissement d’un feu rouge').first()).toBeVisible()
  await expect(page.locator('section[aria-labelledby="result-title"]')).toContainText('8/ 12')
  // Chronologie : détails dépliables
  const item = page.getByRole('listitem').filter({ hasText: 'Retrait : Franchissement' })
  await item.locator('summary').click()
  await expect(item).toContainText('R412-30')
  await noHorizontalScroll(page)

  // Persistance locale
  await page.reload()
  await expect(page.getByText('Franchissement d’un feu rouge').first()).toBeVisible()
})

test('barre compacte du solde visible en défilant', async ({ page }) => {
  await fillDate(page, "Date d'obtention du permis", '2020-01-01')
  await page.getByRole('heading', { name: 'Chronologie' }).scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)
  const bar = page.getByRole('link', { name: /Solde : \d+ points sur 12/ })
  await expect(bar).toBeInViewport()
})

test('zones tactiles ≥ 44 px et champs ≥ 16 px', async ({ page }) => {
  await fillDate(page, "Date d'obtention du permis", '2020-01-01')
  const small = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('button, input:not([type=radio]), select, summary, .segmented label')]
      .filter((el) => el.offsetParent !== null)
      .map((el) => ({ el: el.outerHTML.slice(0, 80), r: el.getBoundingClientRect() }))
      .filter(({ r }) => r.height < 43.5 || r.width < 43.5)
      .map(({ el, r }) => `${el} ${r.width}x${r.height}`),
  )
  expect(small).toEqual([])
  const fonts = await page.evaluate(() =>
    [...document.querySelectorAll('input, select')].map((el) => parseFloat(getComputedStyle(el).fontSize)),
  )
  for (const f of fonts) expect(f).toBeGreaterThanOrEqual(16)
})

test('PWA : manifeste et service worker', async ({ page, request }) => {
  const manifest = await (await request.get('/manifest.webmanifest')).json()
  expect(manifest.display).toBe('standalone')
  expect(manifest.icons.map((i: { sizes: string }) => i.sizes)).toEqual(expect.arrayContaining(['192x192', '512x512']))
  const sw = await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.ready
    return !!reg.active
  })
  expect(sw).toBe(true)
})

test('texte agrandi à 200 % : pas de défilement horizontal', async ({ page }) => {
  await fillDate(page, "Date d'obtention du permis", '2020-01-01')
  await page.evaluate(() => (document.documentElement.style.fontSize = '200%'))
  await noHorizontalScroll(page)
})
