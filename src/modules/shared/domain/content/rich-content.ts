import { Marked } from 'marked'

const markdown = new Marked({ gfm: true, breaks: true, async: false })

// The editor always saves block level HTML, so any block tag means the content was already
// written (or migrated) as HTML and must not be parsed as markdown again.
const HTML_BLOCK_PATTERN = /<(?:p|h[1-6]|ul|ol|li|blockquote|pre|img|figure|table|iframe|hr|div)\b[^>]*>/i

// Block level markdown is the part Tiptap does not convert on paste: marks such as **bold**
// or `code` already ship their own paste rules.
const MARKDOWN_BLOCK_PATTERNS = [
  /^#{1,6}[ \t]+\S/m, // # Título
  /^[ \t]*[-*+][ \t]+\S/m, // - lista
  /^[ \t]*\d+[.)][ \t]+\S/m, // 1. lista
  /^[ \t]*>[ \t]?\S/m, // > cita
  /^[ \t]*```/m, // ``` código
  /^[ \t]*(?:[-*_][ \t]*){3,}$/m, // --- separador
  /!\[[^\]\n]*\]\([^)\s]+\)/, // ![imagen](url)
  /\[[^\]\n]+\]\([^)\s]+\)/, // [enlace](url)
  /^[ \t]*\|.*\|[ \t]*$/m, // | tabla |
]

const HTML_ENTITIES: [RegExp, string][] = [
  [/&nbsp;/g, ' '],
  [/&lt;/g, '<'],
  [/&gt;/g, '>'],
  [/&quot;/g, '"'],
  [/&#39;/g, "'"],
  [/&amp;/g, '&'],
]

export class RichContent {
  static isHtml(content: string): boolean {
    return HTML_BLOCK_PATTERN.test(content)
  }

  static isMarkdown(content: string): boolean {
    if (!content.trim() || RichContent.isHtml(content)) {
      return false
    }

    return MARKDOWN_BLOCK_PATTERNS.some(pattern => pattern.test(content))
  }

  static toHtml(content: string): string {
    return markdown.parse(content, { async: false })
  }

  // Content is stored as HTML, but legacy rows and Meetup.com imports still hold markdown.
  static normalize(content: string): string {
    if (!content) {
      return ''
    }

    return RichContent.isHtml(content) ? content : RichContent.toHtml(content)
  }

  static toPlainText(content: string): string {
    const text = RichContent.normalize(content).replace(/<[^>]+>/g, ' ')

    return HTML_ENTITIES.reduce((value, [entity, char]) => value.replace(entity, char), text)
      .replace(/\s+/g, ' ')
      .trim()
  }
}
