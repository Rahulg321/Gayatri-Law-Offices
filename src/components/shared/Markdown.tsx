import { Link } from '@tanstack/react-router'
import parse, {
  type DOMNode,
  type HTMLReactParserOptions,
  Element,
  domToReact,
} from 'html-react-parser'
import { useEffect, useState } from 'react'
import { renderMarkdown, type MarkdownResult } from '#/lib/markdown'

type MarkdownProps = {
  content: string
  className?: string
}

export function Markdown({ content, className }: MarkdownProps) {
  const [result, setResult] = useState<MarkdownResult | null>(null)

  useEffect(() => {
    let cancelled = false
    renderMarkdown(content).then((value) => {
      if (!cancelled) setResult(value)
    })
    return () => {
      cancelled = true
    }
  }, [content])

  if (!result) {
    return <div className={className}>Loading…</div>
  }

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element) {
        if (domNode.name === 'a') {
          const href = domNode.attribs.href
          if (href?.startsWith('/')) {
            return (
              <Link to={href} className="text-[var(--gold)] underline-offset-2 hover:underline">
                {domToReact(domNode.children as DOMNode[], options)}
              </Link>
            )
          }
        }
        if (domNode.name === 'img') {
          return (
            <img
              {...domNode.attribs}
              alt={domNode.attribs.alt ?? ''}
              loading="lazy"
              className="my-6 rounded-lg shadow-md"
            />
          )
        }
      }
    },
  }

  return <div className={className}>{parse(result.markup, options)}</div>
}
