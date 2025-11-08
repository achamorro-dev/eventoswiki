import { Color } from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import ListItem from '@tiptap/extension-list-item'
import { TextAlign } from '@tiptap/extension-text-align'
import { TextStyleKit } from '@tiptap/extension-text-style'
import { Underline } from '@tiptap/extension-underline'
import Youtube from '@tiptap/extension-youtube'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import { useMediaQuery } from '@/ui/hooks/use-media-query'
import { RichEditorToolbar } from './rich-editor-toolbar'
import './rich-editor.css'

const extensions = [
  Color.configure({ types: [TextStyleKit.name, ListItem.name] }),
  TextStyleKit.configure(),
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Underline,
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  Link.configure({
    autolink: true,
    defaultProtocol: 'https',
    protocols: ['http', 'https', 'tel', 'mailto'],
    linkOnPaste: true,
  }),
  Youtube.configure({
    nocookie: true,
  }),
]

interface RichEditorProps {
  content?: string
  onContentChange: (content: string) => void
}
export const RichEditor = (props: RichEditorProps) => {
  const { content, onContentChange } = props
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const editor = useEditor({
    extensions,
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML())
    },
  })

  return (
    <div className="border-input w-full rounded border">
      {isDesktop ? <RichEditorToolbar editor={editor} /> : null}
      <EditorContent
        editor={editor}
        className="content-styles"
        // slotBefore={isDesktop ? <RichEditorToolbar /> : null}
        // slotAfter={!isDesktop ? <RichEditorToolbar /> : null}
        // extensions={extensions}
        // content={content}
        // onUpdate={({ editor }) => {
        //   onContentChange(editor.getHTML())
        // }}
      ></EditorContent>
      {!isDesktop ? <RichEditorToolbar editor={editor} /> : null}
    </div>
  )
}
