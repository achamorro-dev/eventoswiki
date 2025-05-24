import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import { TextAlign } from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import { Underline } from '@tiptap/extension-underline'
import { EditorProvider } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import { RichEditorToolbar } from './rich-editor-toolbar'

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

const exampleContent = `
<h2>
  Hi there,
</h2>
<p>
  this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That’s a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
  Wow, that’s amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
`

interface RichEditorProps {
  content?: string
  onContentChange: (content: string) => void
}
export const RichEditor = (props: RichEditorProps) => {
  const { content = exampleContent, onContentChange } = props

  return (
    <div className="border-input rounded border">
      <EditorProvider
        slotBefore={<RichEditorToolbar />}
        extensions={extensions}
        content={content}
        onUpdate={({ editor }) => {
          onContentChange(editor.getHTML())
        }}
      ></EditorProvider>
    </div>
  )
}
