import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const PLAYWRIGHT = process.env.PLAYWRIGHT_MODULE ?? 'playwright';
const { chromium } = await import(path.isAbsolute(PLAYWRIGHT) ? pathToFileURL(PLAYWRIGHT).href : PLAYWRIGHT);
const DIST = fileURLToPath(new URL('../../dist', import.meta.url));
const CREDITS_SOURCE = fileURLToPath(new URL('../../src/data/photoCredits.ts', import.meta.url));
const SHOTS = process.env.SHOTS_DIR ?? fileURLToPath(new URL('out', import.meta.url));
const PREFIX = '/apps/stays/';
const REQUIRED_CSP = "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; upgrade-insecure-requests";
fs.mkdirSync(SHOTS, { recursive: true });
if (!fs.existsSync(path.join(DIST, 'index.html'))) { console.error('FAIL: dist/index.html missing, run npm run build first'); process.exit(2); }

const PHOTO_IDS = [...fs.readFileSync(CREDITS_SOURCE, 'utf8').matchAll(/homeId: "([a-z0-9-]+)"/g)].map((m) => m[1]);
if (PHOTO_IDS.length !== 12) { console.error(`FAIL: expected 12 photo ids in ${CREDITS_SOURCE}, found ${PHOTO_IDS.length}`); process.exit(2); }

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (!url.pathname.startsWith(PREFIX)) { res.writeHead(404).end(); return; }
  const rel = url.pathname.slice(PREFIX.length) || 'index.html';
  const file = path.join(DIST, path.normalize(rel));
  if (!file.startsWith(DIST) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' }).end(fs.readFileSync(file));
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const ORIGIN = `http://127.0.0.1:${server.address().port}`;
const BASE = `${ORIGIN}${PREFIX}`;
console.log('serving', DIST, 'at', BASE);

const problems = [];
let checks = 0;
function ok(cond, msg) { checks++; if (!cond) { problems.push('FAIL: ' + msg); console.log('  FAIL', msg); } else console.log('  ok  ', msg); }
const norm = (s) => (s ?? '').replace(/\s+/g, ' ').trim();
const photoBytes = new Map();

const browser = await chromium.launch();
async function newPage(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, ...opts });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) problems.push(`console.${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => problems.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`));
  page.on('request', (r) => { if (!r.url().startsWith(ORIGIN) && !r.url().startsWith('data:')) problems.push(`off-origin request: ${r.url()}`); });
  const pagePhotoBytes = new Map();
  page.on('response', async (r) => {
    if (r.status() >= 400) problems.push(`http ${r.status()}: ${r.url()}`);
    if (r.url().endsWith('.webp')) {
      const size = (await r.body().catch(() => Buffer.alloc(0))).length;
      photoBytes.set(new URL(r.url()).pathname, size);
      pagePhotoBytes.set(new URL(r.url()).pathname, size);
    }
  });
  await page.addInitScript(() => { document.addEventListener('securitypolicyviolation', (e) => console.error(`CSP-VIOLATION ${e.violatedDirective} ${e.blockedURI}`)); });
  return { ctx, page, pagePhotoBytes };
}

async function checkPhotosLoad(page, label, expectedIds) {
  const photos = page.locator('img[data-photo]');
  const count = await photos.count();
  ok(count === expectedIds.length, `${label}: ${count} photos on the page, expected ${expectedIds.length}`);
  const seen = [];
  const broken = [];
  for (let i = 0; i < count; i++) {
    const photo = photos.nth(i);
    await photo.scrollIntoViewIfNeeded();
    await photo.evaluate((img) => (img.complete ? null : new Promise((resolve) => { img.addEventListener('load', resolve, { once: true }); img.addEventListener('error', resolve, { once: true }); })));
    const state = await photo.evaluate((img) => ({ id: img.dataset.photo, width: img.naturalWidth, src: img.currentSrc, alt: img.alt }));
    seen.push(state.id);
    if (!state.width || !state.src.endsWith('.webp')) broken.push(`${state.id} (${state.src || 'no src'})`);
  }
  ok(!broken.length, `${label}: ${count - broken.length}/${count} photos decoded${broken.length ? ', broken: ' + broken.join(', ') : ''}`);
  const missing = expectedIds.filter((id) => !seen.includes(id));
  ok(!missing.length, `${label}: every expected photo id is present${missing.length ? ', missing: ' + missing.join(', ') : ''}`);
}

function isoInDays(days) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

console.log('1. CSP meta');
const html = await (await fetch(BASE)).text();
const cspMatch = html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]*)"/);
ok(!!cspMatch && cspMatch[1] === REQUIRED_CSP, 'built page carries the exact required CSP meta');
ok(!/<img[^>]+src="https?:/.test(html), 'no external image URL in built HTML');

const screens = [
  ['390-light', { viewport: { width: 390, height: 844 } }],
  ['390-dark', { viewport: { width: 390, height: 844 }, colorScheme: 'dark' }],
  ['1440-light', { viewport: { width: 1440, height: 900 } }],
  ['1440-dark', { viewport: { width: 1440, height: 900 }, colorScheme: 'dark' }],
];
for (const [name, opts] of screens) {
  console.log(`2. ${name}`);
  const { ctx, page } = await newPage(opts);
  await page.goto(BASE);
  await page.waitForSelector('.home-card');
  await page.screenshot({ path: `${SHOTS}/browse-${name}.png` });
  await checkPhotosLoad(page, `browse ${name}`, PHOTO_IDS);
  const altTexts = await page.locator('.home-card img[data-photo]').evaluateAll((imgs) => imgs.map((img) => img.alt));
  ok(altTexts.every((alt) => alt.length >= 20), `browse ${name}: every card photo has descriptive alt text`);
  const lazyCount = await page.locator('.home-card img[loading=lazy]').count();
  ok(lazyCount === 10, `browse ${name}: 10 of 12 card photos lazy-load (got ${lazyCount})`);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `${SHOTS}/browse-${name}-full.png`, fullPage: true });

  await page.goto(`${BASE}#/stays/knysna-lagoon-house`);
  await page.waitForSelector('.gallery-photo');
  await checkPhotosLoad(page, `detail ${name}`, ['knysna-lagoon-house']);
  ok(norm(await page.locator('.gallery-caption').textContent()).includes('Pictured: The Grootrivier lagoon'), `detail ${name}: caption names the real place`);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `${SHOTS}/detail-${name}.png` });

  await page.goto(`${BASE}#/book/cederberg-rock-farmstead?checkIn=${isoInDays(70)}&checkOut=${isoInDays(72)}&guests=2`);
  await page.waitForSelector('.stay-summary-photo');
  await checkPhotosLoad(page, `book ${name}`, ['cederberg-rock-farmstead']);
  ok(await page.locator('.stay-summary-photo').getAttribute('alt') === '', `book ${name}: summary photo is decorative (empty alt)`);
  await page.screenshot({ path: `${SHOTS}/book-${name}.png` });

  await page.locator('#name').fill('Thandi Mokoena');
  await page.locator('#email').fill('thandi@example.com');
  await page.locator('#agree').check();
  await page.locator('.guest-form button[type=submit]').click();
  await page.waitForURL(/#\/trip\//);
  await page.goto(`${BASE}#/bookings`);
  await page.waitForSelector('.booking-row-photo');
  await checkPhotosLoad(page, `bookings ${name}`, ['cederberg-rock-farmstead']);
  await page.screenshot({ path: `${SHOTS}/bookings-${name}.png` });
  await page.getByRole('button', { name: 'Cancel booking' }).click();
  await page.getByRole('button', { name: 'Yes, cancel' }).click();
  await page.waitForSelector('.booking-row.is-cancelled .booking-row-photo');
  await page.screenshot({ path: `${SHOTS}/bookings-${name}-cancelled.png`, fullPage: true });

  await page.goto(BASE);
  await page.waitForSelector('.home-card');
  await page.getByRole('link', { name: 'Photo credits' }).click();
  await page.waitForSelector('[data-testid=photo-credit]');
  const creditIds = await page.getByTestId('photo-credit').evaluateAll((items) => items.map((item) => item.dataset.photo));
  const creditsMissing = PHOTO_IDS.filter((id) => !creditIds.includes(id));
  ok(creditIds.length === 12 && !creditsMissing.length, `credits ${name}: lists all 12 photos${creditsMissing.length ? ', missing: ' + creditsMissing.join(', ') : ''}`);
  const linkCounts = await page.getByTestId('photo-credit').evaluateAll((items) => items.map((item) => ({
    commons: item.querySelectorAll('a[href^="https://commons.wikimedia.org/wiki/File:"]').length,
    original: item.querySelectorAll('a[href^="https://upload.wikimedia.org/"]').length,
    licence: item.querySelectorAll('a[href="https://creativecommons.org/publicdomain/zero/1.0/"]').length,
  })));
  ok(linkCounts.every((links) => links.commons === 1 && links.original === 1 && links.licence === 1), `credits ${name}: every entry links its source page, original file and licence`);
  await checkPhotosLoad(page, `credits ${name}`, PHOTO_IDS);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `${SHOTS}/credits-${name}.png` });
  await page.screenshot({ path: `${SHOTS}/credits-${name}-full.png`, fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  ok(overflow <= 0, `credits ${name}: no horizontal scroll (overflow ${overflow}px)`);
  await ctx.close();
}

console.log('3. phone at 3x pixel density');
{
  const { ctx, page, pagePhotoBytes } = await newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  await page.goto(BASE);
  await page.waitForSelector('.home-card');
  await checkPhotosLoad(page, 'browse 390@3x', PHOTO_IDS);
  const sources = await page.locator('.home-card img[data-photo]').evaluateAll((imgs) => imgs.map((img) => img.currentSrc));
  ok(sources.length === 12 && sources.every((src) => src.endsWith('-1200.webp')), `browse 390@3x: all ${sources.length} cards use the 1200w file`);
  const bytes = [...pagePhotoBytes.values()].reduce((sum, size) => sum + size, 0);
  console.log(`  browse 390@3x fetched ${pagePhotoBytes.size} photo files, ${bytes} bytes`);
  await ctx.close();
}

await browser.close();
server.close();
const totalPhotoBytes = [...photoBytes.values()].reduce((sum, size) => sum + size, 0);
console.log(`\nphoto files fetched: ${photoBytes.size}, ${totalPhotoBytes} bytes`);
const failures = problems.filter((p) => p.startsWith('FAIL'));
const errors = problems.filter((p) => !p.startsWith('FAIL'));
console.log(`checks: ${checks}, failed: ${failures.length}, console/CSP/network problems: ${errors.length}`);
errors.forEach((e) => console.log('  ' + e));
console.log(`screenshots in ${SHOTS}: ${fs.readdirSync(SHOTS).filter((f) => f.endsWith('.png')).length} files`);
process.exit(problems.length ? 1 : 0);
