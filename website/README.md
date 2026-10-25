# Compression as evaluation

A static research article for GitHub Pages. Astro 5, TypeScript, Markdown/MDX,
KaTeX, rehype-citation, and optional React 19 islands; dependencies use Bun.
Fonts and math assets are served locally. Hypothesis loads only after opting in.

## Local development

Install Bun 1.3.3 and Node 22, then from this directory:

```sh
bun install --frozen-lockfile
bun run dev
```

Open the URL printed by Astro. `bun run build` writes `dist/`;
`bun run preview` serves that build. In restricted environments set
`ASTRO_TELEMETRY_DISABLED=1` to avoid Astro's user-level telemetry config.

## Writing

- Edit the small Markdown files in `content/`. `content/outline.json` specifies
  their order, headings, stable anchor IDs, and optional `collapsible: true`.
- Add sources to `references.bib`; cite with `[@shannon1948]` or
  `[@shannon1948; @zstd2021]`. The bibliography and return links are automatic.
- Use `$H(P)$` inline and `$$` on separate lines for display math. In Markdown
  tables use `\mid` rather than a literal pipe inside equations.
- Set the title, description, and annotation group in `site.config.json`.
- Update `assets/style.css` for the design. The article intentionally has no
  animation or React runtime; React islands and MDX are available for future
  interactive figures in `src/pages/`.

The main article combines the Markdown sections before rendering so every
section shares one citation numbering scheme and bibliography. Its HTML shell
is `templates/article.html`; `src/lib/article.ts` validates and renders it.
Article content currently contains only section headings, equations, notation,
and citations. Empty section files intentionally remain available for writing.
`assets/blog-accents.css` adds subtle cyan accents from the older blog while
retaining the serif typography and sidebar layout.
The header's moon/sun button switches between light and dark themes and remembers
the choice in this browser. Light remains the default; printed pages stay light.

The first experiment uses `content/experiments/downstream.md` (bullet-only setup)
and `assets/downstream.js` (SVG figures). Its portable 120-point snapshot lives in
`assets/data/downstream.json`; the website build requires no research cache.
Refresh it from the original saved results with `python3 scripts/export_downstream.py`
from this directory. That exporter validates cohort counts, joins five-shot
benchmark scores, recomputes rank correlations, and records source hashes.

The adversarial subsection uses `content/experiments/adversarial.md`,
`assets/adversarial.js`, and `assets/data/adversarial.json`. Refresh its 73 matched
configurations across six metrics with `python3 scripts/export_adversarial.py`.
Margins use each metric's saved real-data control and are computed before rounding;
the plot panels intentionally keep separate native-unit scales.

## GitHub Pages

The repository workflow `.github/workflows/article-pages.yml` builds this
directory and deploys on pushes to `main`. In your GitHub repository, select
**Settings → Pages → Source → GitHub Actions**, then push these files. It also
supports manual dispatch. The workflow supplies your Pages base path and
canonical URL, including project-site subpaths. This scaffold has not itself
been deployed. Keep the canonical URL stable once people begin annotating.

For a custom deployment, set `SITE_URL=https://example.com/article/` and
`BASE_PATH=/article/` before building, or set `canonicalUrl` in the site config.

## Shared comments

Choose **Comment mode → Enable comments**, sign in to Hypothesis, select text,
and annotate. Choose a private Hypothesis group before posting private notes:
public annotations are public, not restricted to repository collaborators.
An optional `hypothesisGroup` in `site.config.json` preselects a group ID but
does not grant membership or access. GitHub Pages stores no comments or secrets;
Hypothesis manages authentication and persistence. Network/content blockers
can prevent the sidebar loading. Localhost annotations are not production
annotations. Editing quoted text can affect annotation anchoring.

## Checks

```sh
bun run build
bun run test:browser
bun run test
```

Browser tests require Chromium (`bunx playwright install chromium`). Set
`PLAYWRIGHT_CHROMIUM_EXECUTABLE` to reuse an existing browser. They check narrow
layouts, citations, collapsed-section navigation, and opt-in annotation loading
using a mocked embed endpoint; authenticated posting is not tested.
# Additional stress-test snapshots

- Refresh historical metric comparisons and likelihood-minus-compression baselines with `python website/scripts/export_metric_history.py`; this writes two generated Markdown sections and `assets/data/metric-history.json` from cached results, without GPU scoring.

- Refresh the five additional suites with `python website/scripts/export_stress_tests.py` from the repository root.
- `assets/data/stress-tests.json` contains raw scores, unrounded margins, phase-specific controls and source hashes; the static build does not need the research cache.
- Corruption, adaptive and structural suites include six metrics. Paired structural and standalone-matched suites expose only their available compression measurements, not unmatched learned-metric scores.
