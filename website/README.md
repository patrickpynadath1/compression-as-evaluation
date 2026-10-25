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
Unfinished sections explicitly say **Draft**. No experimental results have
been invented to fill the outline.

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
