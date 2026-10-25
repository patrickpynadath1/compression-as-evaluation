import { cp, mkdir, writeFile } from 'node:fs/promises';
const output = '.generated/public';
await mkdir(`${output}/assets`, { recursive: true });
await cp('assets', `${output}/assets`, { recursive: true });
await cp('content', `${output}/source`, { recursive: true });
await cp('references.bib', `${output}/references.bib`);
await cp('node_modules/katex/dist', `${output}/assets/katex`, { recursive: true });
for (const font of ['inter', 'source-serif-4']) await cp(`node_modules/@fontsource-variable/${font}`, `${output}/assets/fonts/${font}`, { recursive: true });
await writeFile(`${output}/.nojekyll`, '');
