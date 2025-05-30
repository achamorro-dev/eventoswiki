import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import { TextAlign } from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import { Underline } from '@tiptap/extension-underline'
import { EditorProvider } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import { RichEditorToolbar } from './rich-editor-toolbar'

import { useMediaQuery } from '@/ui/hooks/use-media-query'
import './rich-editor.css'

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle,
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
]

interface RichEditorProps {
  content?: string
  onContentChange: (content: string) => void
}
export const RichEditor = (props: RichEditorProps) => {
  const { content, onContentChange } = props
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <div className="border-input w-full rounded border">
      <EditorProvider
        slotBefore={isDesktop ? <RichEditorToolbar /> : null}
        slotAfter={!isDesktop ? <RichEditorToolbar /> : null}
        extensions={extensions}
        content={content}
        onUpdate={({ editor }) => {
          onContentChange(editor.getHTML())
        }}
      ></EditorProvider>
    </div>
  )
}
