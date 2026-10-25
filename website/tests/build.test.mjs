import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const html = await readFile('dist/index.html', 'utf8');
test('adversarial snapshot preserves unrounded margins and complete metric coverage', async () => {
  const data = JSON.parse(await readFile('dist/assets/data/adversarial.json', 'utf8'));
  assert.equal(data.points.length, 73);
  assert.equal(Object.keys(data.metrics).length, 6);
  for (const point of data.points) {
    for (const [metric, metadata] of Object.entries(data.metrics)) {
      assert.ok(Number.isFinite(point.scores[metric]));
      assert.equal(point.margins[metric], point.scores[metric] - metadata.control);
    }
  }
  assert.equal(data.metrics.nll.families.periodic.above, 1);
  assert.equal(data.metrics.conditional.families.periodic.above, 10);
});
test('stress suites preserve matched controls and paired deltas', async () => {
  const data = JSON.parse(await readFile('dist/assets/data/stress-tests.json', 'utf8'));
  assert.equal(Object.keys(data.suites).length, 5);
  for (const suite of Object.values(data.suites)) {
    for (const metric of Object.values(suite.metrics)) {
      for (const row of metric.rows) {
        assert.ok(Number.isFinite(row.score));
        assert.equal(row.margin, row.score - row.control);
        assert.ok(row.control >= row.control_min && row.control <= row.control_max);
      }
    }
  }
  assert.equal(data.suites.corruption.metrics.conditional.rows.length, 39);
  assert.equal(data.suites.adaptive.metrics.nll.rows.length, 28);
  assert.equal(data.suites.structural.metrics.sol.rows.length, 26);
  assert.ok(data.suites.paired.metrics.forward.rows.every(row => row.margin < 0));
  assert.ok(data.suites.matched.metrics.conditional.rows.every(row => row.margin > 0));
});
test('likelihood residual baselines use aligned source measurements', async () => {
  const data = JSON.parse(await readFile('dist/assets/data/metric-history.json', 'utf8'));
  const rows = data.residual_baseline;
  assert.equal(rows.length, 113);
  const control = rows.find(row => row.parameters.kind === 'real');
  assert.ok(control.residual < 0);
  for (const row of rows) {
    assert.equal(row.source_tokens, 1024 * 1024);
    assert.equal(row.residual, row.nll - row.compression_rate);
    assert.equal(row.residual_margin, row.residual - control.residual);
    assert.equal(row.joint_reference_gap, Math.abs(row.nll - control.nll) + Math.abs(row.compression_rate - control.compression_rate));
  }
});
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

test('article has no generated draft prompts or editorial filler', () => {
  assert.doesNotMatch(html, /Draft —|About this draft|The idea, in one line|Built for reading, thinking|Our proposed score is|Lower means closer/);
  assert.match(html, /assets\/fonts\/source-serif-4\/index.css/);
  assert.match(html, /class="contents"/);
});
