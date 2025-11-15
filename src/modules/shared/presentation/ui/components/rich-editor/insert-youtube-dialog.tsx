import { Editor } from '@tiptap/react'
import * as React from 'react'
import { Button } from '@/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'

interface InsertYoutubeDialogProps {
  editor: Editor | null
  open: boolean
  onOpenChange: (open: boolean) => void
  initialUrl?: string
  normalizeYoutubeUrl: (value: string) => string
}

export function InsertYoutubeDialog({
  editor,
  open,
  onOpenChange,
  initialUrl = '',
  normalizeYoutubeUrl,
}: InsertYoutubeDialogProps) {
  const [youtubeUrl, setYoutubeUrl] = React.useState(initialUrl)

  React.useEffect(() => {
    if (open) {
      setYoutubeUrl(initialUrl)
    }
  }, [open, initialUrl])

  function handleSubmit() {
    if (!editor) {
      return
    }

    const url = youtubeUrl.trim()
    if (url) {
      const normalizedUrl = normalizeYoutubeUrl(url)
      editor.chain().focus().setYoutubeVideo({ src: normalizedUrl }).run()
      // Restore focus to editor after a short delay to ensure the video is inserted
      setTimeout(() => {
        editor.chain().focus().run()
      }, 100)
    }
    onOpenChange(false)
    setYoutubeUrl('')
  }

  function handleCancel() {
    onOpenChange(false)
    setYoutubeUrl('')
  }

  return (
    <Dialog
      open={open}
      onOpenChange={open => {
        onOpenChange(open)
        if (!open) {
          setYoutubeUrl('')
          // Restore focus to editor when dialog closes
          if (editor) {
            setTimeout(() => {
              editor.chain().focus().run()
            }, 50)
          }
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insertar video de YouTube</DialogTitle>
          <DialogDescription>Ingresa la URL del video de YouTube</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={e => {
            e.preventDefault()
            e.stopPropagation()
            handleSubmit()
          }}
          className="space-y-4"
          onClick={e => e.stopPropagation()}
        >
          <div className="space-y-2">
            <Label htmlFor="youtube-url">URL</Label>
            <Input
              id="youtube-url"
              value={youtubeUrl}
              onChange={e => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              autoFocus
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSubmit()
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button
              type="submit"
              onClick={e => {
                e.stopPropagation()
              }}
            >
              Aplicar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
