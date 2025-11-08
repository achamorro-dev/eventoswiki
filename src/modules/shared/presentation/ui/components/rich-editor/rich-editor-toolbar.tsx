import { Button } from '@/ui/button'
import { useMediaQuery } from '@/ui/hooks/use-media-query'
import {
  ArrowArcLeft,
  ArrowArcRight,
  BulletList,
  Code,
  Link,
  ListNumbers,
  Quotes,
  TextAlignCenter,
  TextAlignJustify,
  TextAlignLeft,
  TextAlignRight,
  TextBold,
  TextHFour,
  TextHThree,
  TextHTwo,
  TextItalic,
  TextStrikethrough,
  TextUnderline,
  Youtube,
} from '@/ui/icons'
import { Separator } from '@/ui/separator'
import { Toggle } from '@/ui/toggle'
import { Editor } from '@tiptap/react'

interface RichEditorToolbarProps {
  editor: Editor | null
}

function normalizeYoutubeUrl(value: string) {
  const trimmed = value.trim()
  if (!trimmed) {
    return trimmed
  }

  try {
    const url = new URL(trimmed)
    const host = url.hostname.toLowerCase()
    const isYoutubeHost = host === 'youtube.com' || host === 'www.youtube.com' || host.endsWith('.youtube.com')

    if (isYoutubeHost) {
      const segments = url.pathname.split('/').filter(Boolean)
      if (segments[0] === 'live' && segments[1]) {
        const videoId = segments[1]
        url.pathname = '/watch'
        url.searchParams.set('v', videoId)
        return url.toString()
      }
    }

    return trimmed
  } catch {
    return trimmed
  }
}

export const RichEditorToolbar = (props: RichEditorToolbarProps) => {
  const { editor } = props
  const isMobile = useMediaQuery('(max-width: 768px)')

  if (!editor) {
    return null
  }

  function onToggleLink() {
    if (!editor) {
      return
    }

    const existingHref = editor.isActive('link') ? editor.getAttributes('link').href : ''
    const href = window.prompt('URL', existingHref)
    const url = href?.trim()
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    } else if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run()
    }
  }

  function onToggleYoutube() {
    if (!editor) {
      return
    }

    const existingHref = editor.isActive('youtube') ? editor.getAttributes('youtube').url : ''
    const url = window.prompt('URL', existingHref)
    if (url && url.trim()) {
      const normalizedUrl = normalizeYoutubeUrl(url)
      editor.chain().focus().setYoutubeVideo({ src: normalizedUrl }).run()
    }
  }

  if (!editor) {
    return null
  }

  return (
    <div
      className="bg-background rounded-xs flex w-full flex-wrap justify-start gap-2 border-b-[1px] py-2 md:justify-center"
      style={{ scrollbarWidth: 'none' }}
    >
      <div className="flex flex-wrap">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Undo"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <ArrowArcLeft />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Redo"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <ArrowArcRight />
        </Button>
        {!isMobile && <Separator orientation="vertical" />}
      </div>
      <div className="flex flex-wrap">
        <Toggle
          variant="default"
          aria-label="Bold"
          pressed={editor.isActive('bold')}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
        >
          <TextBold />
        </Toggle>
        <Toggle
          variant="default"
          aria-label="Italic"
          pressed={editor.isActive('italic')}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
        >
          <TextItalic />
        </Toggle>
        <Toggle
          variant="default"
          aria-label="Underline"
          pressed={editor.isActive('underline')}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
        >
          <TextUnderline />
        </Toggle>
        <Toggle
          variant="default"
          aria-label=""
          pressed={editor.isActive('strike')}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
        >
          <TextStrikethrough />
        </Toggle>
        <Toggle
          variant="default"
          aria-label="Heading 2"
          pressed={editor.isActive('heading', { level: 2 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <TextHTwo />
        </Toggle>
        <Toggle
          variant="default"
          aria-label="Heading 3"
          pressed={editor.isActive('heading', { level: 3 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <TextHThree />
        </Toggle>
        <Toggle
          variant="default"
          aria-label="Heading 4"
          pressed={editor.isActive('heading', { level: 4 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        >
          <TextHFour />
        </Toggle>
      </div>
      <div className="flex flex-wrap">
        <Toggle
          variant="default"
          aria-label="Bullet list"
          pressed={editor.isActive('bulletList')}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        >
          <BulletList />
        </Toggle>
        <Toggle
          variant="default"
          aria-label="Ordered list"
          pressed={editor.isActive('orderedList')}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListNumbers />
        </Toggle>
        <Toggle
          variant="default"
          aria-label="Code block"
          pressed={editor.isActive('codeBlock')}
          onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code />
        </Toggle>
        <Toggle
          variant="default"
          aria-label="Blockquote"
          pressed={editor.isActive('blockquote')}
          onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quotes />
        </Toggle>
        <Toggle variant="default" aria-label="Link" pressed={editor.isActive('link')} onPressedChange={onToggleLink}>
          <Link />
        </Toggle>
        <Toggle
          variant="default"
          aria-label="Youtube"
          pressed={editor.isActive('youtube')}
          onPressedChange={onToggleYoutube}
        >
          <Youtube />
        </Toggle>
        {!isMobile && <Separator orientation="vertical" />}
      </div>
      <Toggle
        variant="default"
        aria-label="Align left"
        pressed={editor.isActive('textAlign', { align: 'left' })}
        onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <TextAlignLeft />
      </Toggle>
      <Toggle
        variant="default"
        aria-label="Align center"
        pressed={editor.isActive('textAlign', { align: 'center' })}
        onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <TextAlignCenter />
      </Toggle>
      <Toggle
        variant="default"
        aria-label="Align right"
        pressed={editor.isActive('textAlign', { align: 'right' })}
        onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <TextAlignRight />
      </Toggle>
      <Toggle
        variant="default"
        aria-label="Align justify"
        pressed={editor.isActive('textAlign', { align: 'justify' })}
        onPressedChange={() => editor.chain().focus().setTextAlign('justify').run()}
      >
        <TextAlignJustify />
      </Toggle>
      {!isMobile && <Separator orientation="vertical" />}
      {/* <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Image"
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Image />
      </Button> */}
    </div>
  )
}
