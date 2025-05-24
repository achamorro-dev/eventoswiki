import { Button } from '@/ui/button'
import {
  ArrowArcLeft,
  ArrowArcRight,
  BulletList,
  Code,
  ListNumbers,
  Quotes,
  TextAlignCenter,
  TextAlignJustify,
  TextAlignLeft,
  TextAlignRight,
  TextBold,
  TextItalic,
  TextStrikethrough,
} from '@/ui/icons'
import { Separator } from '@/ui/separator'
import { Toggle } from '@/ui/toggle'
import { useCurrentEditor } from '@tiptap/react'

export const RichEditorToolbar = () => {
  const { editor } = useCurrentEditor()

  if (!editor) {
    return null
  }

  return (
    <div className="bg-background rounded-xs flex justify-center gap-2 border-b-[1px] py-2">
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
      <Separator orientation="vertical" />
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
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
      >
        <TextStrikethrough />
      </Toggle>
      <Toggle
        variant="default"
        aria-label="Strike"
        pressed={editor.isActive('strike')}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
      >
        <TextStrikethrough />
      </Toggle>
      <Toggle
        variant="default"
        aria-label="Heading 1"
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        pressed={editor.isActive('heading', { level: 1 })}
      >
        H1
      </Toggle>
      <Toggle
        variant="default"
        aria-label="Heading 2"
        pressed={editor.isActive('heading', { level: 2 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </Toggle>
      <Toggle
        variant="default"
        aria-label="Heading 3"
        pressed={editor.isActive('heading', { level: 3 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </Toggle>
      <Toggle
        variant="default"
        aria-label="Heading 4"
        pressed={editor.isActive('heading', { level: 4 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
      >
        H4
      </Toggle>
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
      <Separator orientation="vertical" />
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
      <Separator orientation="vertical" />
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
