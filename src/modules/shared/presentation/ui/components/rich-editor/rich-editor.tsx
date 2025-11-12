import { Color } from '@tiptap/extension-color'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import ListItem from '@tiptap/extension-list-item'
import { TextAlign } from '@tiptap/extension-text-align'
import { TextStyleKit } from '@tiptap/extension-text-style'
import { Underline } from '@tiptap/extension-underline'
import Youtube from '@tiptap/extension-youtube'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { useMediaQuery } from '@/ui/hooks/use-media-query'
import { RichEditorToolbar } from './rich-editor-toolbar'
import './rich-editor.css'

interface RichEditorProps {
  content?: string
  onContentChange: (content: string) => void
  onUploadImage?: (file: File) => Promise<string>
}

// SVG placeholder for loading images (similar to GitHub)
const createLoadingImagePlaceholder = (): string => {
  const svg = `
    <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f6f8fa"/>
      <g transform="translate(200, 80)">
        <circle cx="0" cy="0" r="15" fill="none" stroke="#0366d6" stroke-width="2.5" opacity="0.4">
          <animate attributeName="r" values="8;15;8" dur="1.2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.4;0.7;0.4" dur="1.2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="0" cy="0" r="15" fill="none" stroke="#0366d6" stroke-width="2.5" opacity="0.4">
          <animate attributeName="r" values="15;22;15" dur="1.2s" begin="0.6s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.4;0.7;0.4" dur="1.2s" begin="0.6s" repeatCount="indefinite"/>
        </circle>
      </g>
      <text x="200" y="130" text-anchor="middle" fill="#586069" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="13">Subiendo imagen...</text>
    </svg>
  `.trim()
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

export const RichEditor = (props: RichEditorProps) => {
  const { content, onContentChange, onUploadImage } = props
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const editorRef = useRef<ReturnType<typeof useEditor> | null>(null)
  const handleUploadImageRef = useRef<((file: File) => Promise<string>) | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  // Wrapper function to handle image upload with loading state
  const handleUploadImage = useCallback(
    async (file: File): Promise<string> => {
      if (!onUploadImage) {
        throw new Error('onUploadImage is not defined')
      }
      setIsUploadingImage(true)

      const currentEditor = editorRef.current
      if (!currentEditor) {
        setIsUploadingImage(false)
        throw new Error('Editor not available')
      }

      // Generate unique ID for this upload
      const uploadId = Date.now().toString()
      const placeholderUrl = createLoadingImagePlaceholder()

      // Insert placeholder image immediately
      currentEditor.chain().focus().setImage({ src: placeholderUrl, 'data-upload-id': uploadId }).run()

      try {
        const url = await onUploadImage(file)

        // Find and update the placeholder image
        const editor = editorRef.current
        if (editor) {
          // Find the image node with this upload ID
          let imageNodePos: number | null = null
          editor.state.doc.descendants((node, pos) => {
            if (node.type.name === 'image' && node.attrs['data-upload-id'] === uploadId) {
              imageNodePos = pos
              return false
            }
          })

          if (imageNodePos !== null) {
            // Update the image node src and remove data-upload-id
            const tr = editor.state.tr
            const node = editor.state.doc.nodeAt(imageNodePos)
            if (node) {
              const newAttrs = { ...node.attrs, src: url }
              delete newAttrs['data-upload-id']
              tr.setNodeMarkup(imageNodePos, undefined, newAttrs)
              editor.view.dispatch(tr)
              // Move cursor after the image
              setTimeout(() => {
                editor.chain().focus().run()
              }, 0)
            }
          } else {
            // Fallback: insert at current position
            editor.chain().focus().setImage({ src: url }).run()
          }
        }

        setIsUploadingImage(false)
        return url
      } catch (error) {
        // Remove placeholder on error
        const editor = editorRef.current
        if (editor) {
          let imageNodePos: number | null = null
          editor.state.doc.descendants((node, pos) => {
            if (node.type.name === 'image' && node.attrs['data-upload-id'] === uploadId) {
              imageNodePos = pos
              return false
            }
          })

          if (imageNodePos !== null) {
            // Delete the placeholder image node
            const tr = editor.state.tr
            tr.delete(imageNodePos, imageNodePos + 1)
            editor.view.dispatch(tr)
            editor.chain().focus().run()
          }
        }

        // Error messages are already shown by uploadImage function via toast.error
        // This ensures the placeholder is removed and state is reset

        setIsUploadingImage(false)
        throw error
      }
    },
    [onUploadImage],
  )

  useEffect(() => {
    handleUploadImageRef.current = handleUploadImage
  }, [handleUploadImage])

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
    Image.extend({
      addAttributes() {
        return {
          ...this.parent?.(),
          'data-upload-id': {
            default: null,
            parseHTML: element => element.getAttribute('data-upload-id'),
            renderHTML: attributes => {
              if (!attributes['data-upload-id']) {
                return {}
              }
              return {
                'data-upload-id': attributes['data-upload-id'],
              }
            },
          },
        }
      },
    }).configure({
      inline: true,
      allowBase64: true, // Allow base64 for placeholder SVG
    }),
  ]

  const editor = useEditor({
    extensions,
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML())
    },
    editorProps: {
      handlePaste: (view, event, slice) => {
        const currentEditor = editorRef.current
        const uploadHandler = handleUploadImageRef.current
        if (!uploadHandler || !currentEditor) {
          return false
        }

        const items = Array.from(event.clipboardData?.items || [])
        const imageItem = items.find(item => item.type.startsWith('image/'))

        if (imageItem) {
          event.preventDefault()
          const file = imageItem.getAsFile()

          if (file) {
            // handleUploadImage already handles inserting placeholder and updating it
            uploadHandler(file).catch(() => {
              // Error already handled in handleUploadImage
            })
          }
          return true
        }

        return false
      },
      handleDrop: (view, event, slice, moved) => {
        const currentEditor = editorRef.current
        const uploadHandler = handleUploadImageRef.current
        if (!uploadHandler || !currentEditor) {
          return false
        }

        const files = Array.from(event.dataTransfer?.files || [])
        const imageFile = files.find(file => file.type.startsWith('image/'))

        if (imageFile) {
          event.preventDefault()
          // handleUploadImage already handles inserting placeholder and updating it
          // For drop, we need to set cursor position first
          const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })
          if (coordinates) {
            currentEditor.chain().focus().setTextSelection(coordinates.pos).run()
          }
          uploadHandler(imageFile).catch(() => {
            // Error already handled in handleUploadImage
          })
          return true
        }

        return false
      },
    },
  })

  useEffect(() => {
    editorRef.current = editor
  }, [editor])

  return (
    <div className="border-input w-full rounded border">
      {isDesktop ? (
        <RichEditorToolbar editor={editor} onUploadImage={handleUploadImage} isUploadingImage={isUploadingImage} />
      ) : null}
      <EditorContent editor={editor} className="content-styles"></EditorContent>
      {!isDesktop ? (
        <RichEditorToolbar editor={editor} onUploadImage={handleUploadImage} isUploadingImage={isUploadingImage} />
      ) : null}
    </div>
  )
}
