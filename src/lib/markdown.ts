import { toString } from 'hast-util-to-string'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'

export type MarkdownHeading = {
  id: string
  text: string
  level: number
}

export type MarkdownResult = {
  markup: string
  headings: MarkdownHeading[]
}

export async function renderMarkdown(content: string): Promise<MarkdownResult> {
  const headings: MarkdownHeading[] = []

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: { className: ['anchor'] },
    })
    .use(() => (tree) => {
      visit(tree, 'element', (node) => {
        if (
          node.type === 'element' &&
          ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tagName)
        ) {
          const id =
            typeof node.properties?.id === 'string'
              ? node.properties.id
              : Array.isArray(node.properties?.id)
                ? String(node.properties.id[0] ?? '')
                : ''
          headings.push({
            id,
            text: toString(node),
            level: parseInt(node.tagName.charAt(1), 10),
          })
        }
      })
    })
    .use(rehypeStringify)
    .process(content)

  return {
    markup: String(result),
    headings,
  }
}
