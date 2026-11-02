// Step 5 — Playwright screenshots of the matching copticfaith pages, plus the icon
// lookup. Every visual used in the video is logged to credits.json.
import { access, copyFile, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const ICONS_DIR = path.join(ROOT, 'assets/icons');
// Licences we accept for icon art. Anything else is skipped with a warning.
const ICON_LICENSES = ['public-domain', 'cc0', 'own-work'];

export const SITE_URL = (process.env.SITE_URL || 'https://copticfaith.app').replace(/\/$/, '');

async function capture(browser, date, urlPath, file, prepare) {
  const context = await browser.newContext({
    viewport: { width: 540, height: 960 },
    deviceScaleFactor: 2, // 1080×1920 PNG
    colorScheme: 'dark',
  });
  const page = await context.newPage();
  // The pages show "today" from the browser clock — pin it to the requested day.
  await page.clock.setFixedTime(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12));
  await page.goto(`${SITE_URL}${urlPath}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: '.acf-trigger { display: none !important; }' }); // floating chat button
  if (prepare) await prepare(page);
  await page.waitForTimeout(400); // let entrance transitions settle
  await page.screenshot({ path: file });
  await context.close();
}

async function saintPage(page, saint) {
  if (!saint) return;
  if (page.url().includes('/fathers/')) return;
  await page.locator('.sc-today__jump').click();
  await page.locator('.sc-list').getByText(saint.name, { exact: true }).first().click();
  await page.locator('.sc-right').evaluate((el) => el.scrollIntoView({ block: 'start' }));
}

async function readingsPage(page) {
  await page.locator('.dr-panel', { hasText: 'Gospel' }).locator('.dr-panel__header').click();
  await page.locator('.dr-panel--open .dr-panel__text').waitFor({ timeout: 15000 });
  await page.locator('.dr-header').evaluate((el) => el.scrollIntoView({ block: 'start' }));
}

/** Icon art for a saint, only if it is listed in assets/icons/credits.json with an accepted licence. */
export async function findIcon(saint) {
  if (!saint) return null;
  const credits = JSON.parse(await readFile(path.join(ICONS_DIR, 'credits.json'), 'utf8'));
  const entry = credits[saint.id];
  if (!entry) return null;
  if (!ICON_LICENSES.includes(entry.license)) {
    console.warn(`  icon for ${saint.id} skipped: licence "${entry.license}" is not one of ${ICON_LICENSES.join(', ')}`);
    return null;
  }
  const file = path.join(ICONS_DIR, entry.file);
  await access(file);
  return { file, ...entry };
}

export async function takeShots(date, content, outDir) {
  const pub = path.join(outDir, 'public');
  await mkdir(pub, { recursive: true });
  const shots = {
    saint: { path: content.paths.saint, file: 'saint.png' },
    readings: { path: content.paths.readings, file: 'readings.png' },
    home: { path: content.paths.home, file: 'home.png' },
  };

  const browser = await chromium.launch();
  try {
    await capture(browser, date, shots.saint.path, path.join(pub, shots.saint.file), (p) => saintPage(p, content.saint));
    await capture(browser, date, shots.readings.path, path.join(pub, shots.readings.file), readingsPage);
    await capture(browser, date, shots.home.path, path.join(pub, shots.home.file));
  } finally {
    await browser.close();
  }

  const credits = Object.values(shots).map((s) => ({
    asset: `public/${s.file}`,
    source: `${SITE_URL}${s.path}`,
    license: 'own-work',
    note: 'Screenshot of copticfaith (our own site).',
  }));

  await copyFile(path.join(ROOT, '../../public/logo.png'), path.join(pub, 'logo.png'));
  credits.push({ asset: 'public/logo.png', source: 'copticfaith repo: public/logo.png', license: 'own-work' });

  const icon = await findIcon(content.saint);
  if (icon) {
    const iconFile = `icon${path.extname(icon.file)}`;
    await copyFile(icon.file, path.join(pub, iconFile));
    credits.push({ asset: `public/${iconFile}`, title: icon.title, author: icon.author, source: icon.source, license: icon.license });
  }

  return {
    saint: shots.saint.file,
    readings: shots.readings.file,
    home: shots.home.file,
    logo: 'logo.png',
    icon: icon ? `icon${path.extname(icon.file)}` : null,
    credits,
  };
}
