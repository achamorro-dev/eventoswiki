import type { LumaRichTextMarkDto, LumaRichTextNodeDto } from './luma.dto'

const BLOCK_TAGS: Record<string, string> = {
  paragraph: 'p',
  bullet_list: 'ul',
  ordered_list: 'ol',
  list_item: 'li',
  blockquote: 'blockquote',
}

const VOID_TAGS: Record<string, string> = {
  hard_break: '<br>',
  horizontal_rule: '<hr>',
}

const MARK_TAGS: Record<string, string> = {
  bold: 'strong',
  italic: 'em',
  underline: 'u',
  strike: 's',
  code: 'code',
}

const LINE_BREAK_PATTERN = /\r?\n/
const PLAIN_TEXT_PARAGRAPH_TAG = 'p'
const SAFE_LINK_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:'])
const MIN_CONTENT_HEADING_LEVEL = 2
const MAX_HEADING_LEVEL = 6

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export class LumaDescriptionHtmlRenderer {
  static renderRichText(document: LumaRichTextNodeDto): string {
    return LumaDescriptionHtmlRenderer.renderChildren(document)
  }

  static renderPlainText(text: string): string {
    return text
      .split(LINE_BREAK_PATTERN)
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => wrap(PLAIN_TEXT_PARAGRAPH_TAG, escapeHtml(line)))
      .join('')
  }

  private static renderNode(node: LumaRichTextNodeDto): string {
    if (node.type === 'text') return LumaDescriptionHtmlRenderer.renderText(node)
    if (node.type in VOID_TAGS) return VOID_TAGS[node.type]

    const children = LumaDescriptionHtmlRenderer.renderChildren(node)

    if (node.type === 'heading') return wrap(`h${LumaDescriptionHtmlRenderer.headingLevel(node)}`, children)
    if (node.type === 'code_block') return `<pre><code>${children}</code></pre>`

    const tag = BLOCK_TAGS[node.type]
    return tag ? wrap(tag, children) : children
  }

  private static renderChildren(node: LumaRichTextNodeDto): string {
    return (node.content ?? []).map(child => LumaDescriptionHtmlRenderer.renderNode(child)).join('')
  }

  private static renderText(node: LumaRichTextNodeDto): string {
    const text = escapeHtml(node.text ?? '')

    return (node.marks ?? []).reduce((html, mark) => LumaDescriptionHtmlRenderer.applyMark(html, mark), text)
  }

  private static applyMark(html: string, mark: LumaRichTextMarkDto): string {
    if (mark.type === 'link') {
      const href = safeHref(mark.attrs?.href)
      return href
        ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer nofollow">${html}</a>`
        : html
    }

    const tag = MARK_TAGS[mark.type]
    return tag ? wrap(tag, html) : html
  }

  private static headingLevel(node: LumaRichTextNodeDto): number {
    const level = Number(node.attrs?.level) || MIN_CONTENT_HEADING_LEVEL

    return Math.min(Math.max(level, MIN_CONTENT_HEADING_LEVEL), MAX_HEADING_LEVEL)
  }
}

function wrap(tag: string, html: string): string {
  return `<${tag}>${html}</${tag}>`
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => HTML_ESCAPES[char])
}

function safeHref(href: unknown): string | null {
  if (typeof href !== 'string') return null

  try {
    return SAFE_LINK_PROTOCOLS.has(new URL(href).protocol) ? href : null
  } catch (_error) {
    return null
  }
}
