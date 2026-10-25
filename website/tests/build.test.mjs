import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const html = await readFile('dist/index.html', 'utf8');
test('static article includes rendered math, citations, and all sections', async () => {
  assert.match(html, /class="katex/);
  assert.match(html, /id="refs"/);
  assert.doesNotMatch(html, /\[@|katex-error|\{\{[A-Z_]+\}\}/);
  const outline = JSON.parse(await readFile('content/outline.json', 'utf8'));
  for (const section of outline.flatMap(section => [section, ...(section.children || [])])) {
    assert.ok(html.includes(`id="${section.id}"`), section.id);
    await access(`dist/source/${section.file}`);
  }
  await access('dist/.nojekyll');
});
test('internal links resolve and annotation script is opt-in', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'duplicate HTML IDs');
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), match[1]);
  assert.doesNotMatch(html, /<script[^>]+src="https:\/\/hypothes/);
});
