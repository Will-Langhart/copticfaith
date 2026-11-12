// vercel.json rewrites only the site's real pages to the app shell; every
// other URL gets Vercel's 404.html with a real 404 status. These tests keep
// that list in step with the router, the Fathers data and the sitemap, so a
// new page can't 404 on a direct visit and a missing page can't answer 200.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { FATHERS } from '../data/fathers.js';

const root = new URL('../../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');

const vercel = JSON.parse(read('vercel.json'));

// Turn a source like "/:page(a|b)" into an anchored RegExp.
const toRegExp = source =>
  new RegExp(`^${source.replace(/:\w+\(([^)]+)\)/g, '(?:$1)')}$`);
const rewrites = vercel.rewrites.map(r => {
  assert.equal(r.destination, '/index.html');
  return toRegExp(r.source);
});
const isServed = path => path === '/' || rewrites.some(re => re.test(path));

const routerPaths = [...read('src/router/routes.jsx').matchAll(/path: '([^']+)'/g)]
  .map(m => m[1])
  .filter(p => p !== '*' && !p.includes(':'));

test('every static route in the router is rewritten to the app', () => {
  for (const path of routerPaths) assert.ok(isServed(path), `${path} would 404`);
});

test('every Father profile is rewritten to the app, and nothing else under /fathers/', () => {
  for (const { id } of FATHERS) assert.ok(isServed(`/fathers/${id}`), `/fathers/${id} would 404`);
  assert.ok(!isServed('/fathers/not-a-father'));
});

test('every sitemap URL is served', () => {
  const locs = [...read('public/sitemap.xml').matchAll(/<loc>https:\/\/copticfaith\.app([^<]*)<\/loc>/g)];
  assert.ok(locs.length > 0);
  for (const [, path] of locs) assert.ok(isServed(path), `${path} is in the sitemap but would 404`);
});

test('unknown URLs and missing assets are not rewritten (they get a real 404)', () => {
  for (const path of ['/nope', '/baptism/extra', '/assets/old-chunk.js', '/fathersx']) {
    assert.ok(!isServed(path), `${path} should 404`);
  }
});
