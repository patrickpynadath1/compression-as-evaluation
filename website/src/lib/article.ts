import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypeCitation from 'rehype-citation';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import katex from 'katex';
import type { Root, Element } from 'hast';

interface Section { id: string; title: string; file: string; collapsible?: boolean; children?: Section[] }
const escape = (value: string) => value.replace(/[&<>"']/g, character => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[character]!));
const read = (file: string) => readFile(path.resolve(file), 'utf8');

export async function renderArticle(): Promise<string> {
  const config = JSON.parse(await read('site.config.json'));
  const outline: Section[] = JSON.parse(await read('content/outline.json'));
  const ids = new Set<string>();
  const bib = await read('references.bib');
  const bibKeys = new Set([...bib.matchAll(/@\w+\s*\{\s*([^,\s]+),/g)].map(match => match[1]));
  const usedKeys = new Set<string>();
  async function sectionMarkdown(section: Section, level = 2, number = ''): Promise<string> {
    if (!/^[a-z][a-z0-9-]*$/.test(section.id) || ids.has(section.id)) throw new Error(`Invalid or duplicate section id: ${section.id}`);
    ids.add(section.id);
    const filename = path.resolve('content', section.file);
    if (!filename.startsWith(path.resolve('content') + path.sep)) throw new Error('Section file outside content directory');
    const markdown = await readFile(filename, 'utf8');
    for (const match of markdown.matchAll(/(?:\[|;\s*)@([\w:.-]+)/g)) {
      if (!bibKeys.has(match[1])) throw new Error(`Unknown citation ${match[1]} in ${section.file}`);
      usedKeys.add(match[1]);
    }
    const heading = `<h${level}><a class="heading-link" href="#${section.id}">${escape(section.title)}<span aria-hidden="true" class="permalink"> ↗</span></a></h${level}>`;
    const children = [];
    for (const child of section.children || []) children.push(await sectionMarkdown(child, level + 1));
    const source = `<a class="source-link" href="source/${escape(section.file)}">Markdown source ↗</a>`;
    if (section.collapsible) return `<details class="expandable" id="${section.id}">\n<summary>${heading}<span class="expand-label">Expand +</span></summary>\n<div class="section-body">\n\n${markdown}\n\n${source}\n</div>\n</details>`;
    return `<section id="${section.id}" class="article-section ${level === 2 ? 'chapter' : 'subsection'} ${markdown.startsWith('> Draft') ? 'draft-section' : ''}">\n${number ? `<div class="section-number">${number.padStart(2,'0')}</div>` : ''}\n${heading}\n\n${markdown}\n\n${children.join('\n\n')}\n\n${source}\n</section>`;
  }
  const chunks = [];
  for (const [index, section] of outline.entries()) chunks.push(await sectionMarkdown(section, 2, String(index + 1)));
  let bibliography = '';
  function finishMarkup() {
    return (tree: Root) => {
      const backlinks = new Map<string, string[]>();
      let count = 0;
      visit(tree, 'element', (node: Element) => {
        if (node.tagName === 'a' && String(node.properties.href || '').startsWith('#bib-')) {
          node.properties.id = `citation-${++count}`;
          const target = String(node.properties.href).slice(1);
          backlinks.set(target, [...(backlinks.get(target) || []), String(node.properties.id)]);
        }
        if (node.tagName === 'table') node.properties.className = ['notation-table'];
      });
      visit(tree, 'element', (node: Element) => {
        if (node.properties.id && backlinks.has(String(node.properties.id))) {
          node.children.push({type:'element', tagName:'span', properties:{className:['reference-backlinks']}, children:
            backlinks.get(String(node.properties.id))!.map((anchor, index) => ({type:'element', tagName:'a', properties:{href:`#${anchor}`, ariaLabel:`Return to citation ${index + 1}`}, children:[{type:'text', value:` ↩${index + 1}`}]}))});
        }
      });
      const position = tree.children.findIndex(node => node.type === 'element' && node.properties.id === 'refs');
      if (position < 0) throw new Error('Bibliography was not generated');
      const references = tree.children.splice(position, 1)[0];
      bibliography = unified().use(rehypeStringify).stringify({type:'root', children:[references]} as Root);
    };
  }
  const result = await unified().use(remarkParse).use(remarkGfm).use(remarkMath)
    .use(remarkRehype, {allowDangerousHtml:true}).use(rehypeRaw)
    .use(rehypeKatex, {strict:'error', trust:false})
    .use(rehypeCitation, {bibliography:'./references.bib', csl:'vancouver', linkCitations:true})
    .use(finishMarkup).use(rehypeStringify).process(chunks.join('\n\n'));
  if (result.messages.length) throw new Error(result.messages.map(message => message.message).join('\n'));
  const toc = outline.map((section, index) => `<li><a href="#${section.id}" data-toc="${section.id}"><span>${String(index + 1).padStart(2,'0')}</span>${escape(section.title)}</a>${section.children ? `<ul>${section.children.map(child => `<li><a href="#${child.id}">${escape(child.title)}</a></li>`).join('')}</ul>` : ''}</li>`).join('');
  const canonical = process.env.SITE_URL || config.canonicalUrl;
  if (canonical && !/^https:\/\/[^\s"<>]+$/.test(canonical)) throw new Error('SITE_URL must be an HTTPS URL');
  const values: Record<string,string> = {
    TITLE:escape(config.title), DESCRIPTION:escape(config.description), EYEBROW:escape(config.eyebrow), STATUS:escape(config.status),
    CANONICAL:canonical ? `<link rel="canonical" href="${escape(canonical)}"><meta property="og:url" content="${escape(canonical)}">` : '',
    TOC:toc, SECTIONS:String(result), REFERENCES:bibliography,
    HERO_MATH:katex.renderToString(String.raw`W_1\!\left(\widehat\mu_D,\,\widehat\mu_G\right)`, {displayMode:true, throwOnError:true}),
    GROUP:escape(config.hypothesisGroup), SECTION_COUNT:String(outline.length), CITATION_COUNT:String(usedKeys.size),
  };
  return (await read('templates/article.html')).replace(/\{\{([A-Z_]+)\}\}/g, (_, key: string) => {
    if (!(key in values)) throw new Error(`Unknown template value ${key}`);
    return values[key];
  });
}
