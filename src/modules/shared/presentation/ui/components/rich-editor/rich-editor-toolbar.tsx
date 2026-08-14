import { Editor } from '@tiptap/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'
import { useMediaQuery } from '@/ui/hooks/use-media-query'
import {
  ArrowArcLeft,
  ArrowArcRight,
  BulletList,
  Code,
  Image,
  Link,
  ListNumbers,
  Loader,
  Palette,
  Quotes,
  TextAlignCenter,
  TextAlignJustify,
  TextAlignLeft,
  TextAlignRight,
  TextAa,
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
import { InsertLinkDialog } from './insert-link-dialog'
import { InsertYoutubeDialog } from './insert-youtube-dialog'

const DEFAULT_TEXT_STYLE_VALUE = 'default'

const TEXT_COLORS = [
  { label: 'Predeterminado', value: DEFAULT_TEXT_STYLE_VALUE, swatch: 'transparent' },
  { label: 'Gris', value: '#6b7280', swatch: '#6b7280' },
  { label: 'Rojo', value: '#dc2626', swatch: '#dc2626' },
  { label: 'Naranja', value: '#ea580c', swatch: '#ea580c' },
  { label: 'Ámbar', value: '#d97706', swatch: '#d97706' },
  { label: 'Verde', value: '#16a34a', swatch: '#16a34a' },
  { label: 'Turquesa', value: '#0d9488', swatch: '#0d9488' },
  { label: 'Azul', value: '#2563eb', swatch: '#2563eb' },
  { label: 'Violeta', value: '#7c3aed', swatch: '#7c3aed' },
  { label: 'Rosa', value: '#db2777', swatch: '#db2777' },
]

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '30px']

interface RichEditorToolbarProps {
  editor: Editor | null
  onUploadImage?: (file: File) => Promise<string>
  isUploadingImage?: boolean
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
  const { editor, onUploadImage, isUploadingImage = false } = props
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [_, setUpdateKey] = useState(0)
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [isYoutubeDialogOpen, setIsYoutubeDialogOpen] = useState(false)
  const [linkInitialUrl, setLinkInitialUrl] = useState('')
  const [youtubeInitialUrl, setYoutubeInitialUrl] = useState('')

  useEffect(() => {
    if (!editor) {
      return
    }

    const handleSelectionUpdate = () => {
      setUpdateKey(prev => prev + 1)
    }

    const handleUpdate = () => {
      setUpdateKey(prev => prev + 1)
    }

    editor.on('selectionUpdate', handleSelectionUpdate)
    editor.on('update', handleUpdate)

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate)
      editor.off('update', handleUpdate)
    }
  }, [editor])

  if (!editor) {
    return null
  }

  function onToggleLink() {
    if (!editor) {
      return
    }

    const existingHref = editor.isActive('link') ? editor.getAttributes('link').href : ''
    setLinkInitialUrl(existingHref)
    setIsLinkDialogOpen(true)
  }

  function onToggleYoutube() {
    if (!editor) {
      return
    }

    const existingHref = editor.isActive('youtube') ? editor.getAttributes('youtube').url : ''
    setYoutubeInitialUrl(existingHref)
    setIsYoutubeDialogOpen(true)
  }

  function onSelectTextColor(value: string) {
    if (!editor) {
      return
    }

    if (value === DEFAULT_TEXT_STYLE_VALUE) {
      editor.chain().focus().unsetColor().run()
      return
    }

    editor.chain().focus().setColor(value).run()
  }

  function onSelectFontSize(value: string) {
    if (!editor) {
      return
    }

    if (value === DEFAULT_TEXT_STYLE_VALUE) {
      editor.chain().focus().unsetFontSize().run()
      return
    }

    editor.chain().focus().setFontSize(value).run()
  }

  function onToggleImage() {
    if (!editor || !onUploadImage || isUploadingImage) {
      return
    }

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async event => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (!file) {
        return
      }

      // Validate mime type (also validated in uploadImage, but show error immediately)
      const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/avif',
        'image/svg+xml',
      ]
      if (!allowedMimeTypes.includes(file.type)) {
        toast.error('Tipo de archivo no válido. Solo se permiten imágenes (JPEG, PNG, GIF, WebP, AVIF, SVG).')
        return
      }

      try {
        // handleUploadImage already handles inserting placeholder and updating it
        // Errors are shown via toast.error in the uploadImage function
        await onUploadImage(file)
      } catch (error) {
        // Error already handled and shown via toast.error in handleUploadImage/uploadImage
        // This catch ensures the error doesn't propagate further
      }
    }
    input.click()
  }

  if (!editor) {
    return null
  }

  const currentColor = (editor.getAttributes('textStyle').color as string | undefined) ?? DEFAULT_TEXT_STYLE_VALUE
  const currentFontSize =
    (editor.getAttributes('textStyle').fontSize as string | undefined) ?? DEFAULT_TEXT_STYLE_VALUE

  return (
    <div className="bg-background rounded-xs z-10 flex w-full flex-wrap justify-start gap-2 border-b-[1px] py-2 md:sticky md:top-0 md:justify-center">
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
          aria-label="Strikethrough"
          pressed={editor.isActive('strike')}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
        >
          <TextStrikethrough />
        </Toggle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon" aria-label="Color del texto">
              <Palette />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuRadioGroup value={currentColor} onValueChange={onSelectTextColor}>
              {TEXT_COLORS.map(color => (
                <DropdownMenuRadioItem key={color.value} value={color.value}>
                  <span
                    aria-hidden="true"
                    className="h-3 w-3 shrink-0 rounded-full border border-border"
                    style={{ backgroundColor: color.swatch }}
                  />
                  {color.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon" aria-label="Tamaño del texto">
              <TextAa />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuRadioGroup value={currentFontSize} onValueChange={onSelectFontSize}>
              <DropdownMenuRadioItem value={DEFAULT_TEXT_STYLE_VALUE}>Predeterminado</DropdownMenuRadioItem>
              {FONT_SIZES.map(size => (
                <DropdownMenuRadioItem key={size} value={size}>
                  {size}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        {!isMobile && <Separator orientation="vertical" />}
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
        {onUploadImage && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Image"
            onClick={onToggleImage}
            disabled={isUploadingImage}
          >
            {isUploadingImage ? <Loader className="h-4 w-4 animate-spin" /> : <Image />}
          </Button>
        )}
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
      <InsertLinkDialog
        editor={editor}
        open={isLinkDialogOpen}
        onOpenChange={setIsLinkDialogOpen}
        initialUrl={linkInitialUrl}
      />
      <InsertYoutubeDialog
        editor={editor}
        open={isYoutubeDialogOpen}
        onOpenChange={setIsYoutubeDialogOpen}
        initialUrl={youtubeInitialUrl}
        normalizeYoutubeUrl={normalizeYoutubeUrl}
      />
    </div>
  )
}
