import * as React from 'react'
import { Button } from '@/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import { Editor } from '@tiptap/react'

interface InsertLinkDialogProps {
  editor: Editor | null
  open: boolean
  onOpenChange: (open: boolean) => void
  initialUrl?: string
}

export function InsertLinkDialog({ editor, open, onOpenChange, initialUrl = '' }: InsertLinkDialogProps) {
  const [linkUrl, setLinkUrl] = React.useState(initialUrl)

  React.useEffect(() => {
    if (open) {
      setLinkUrl(initialUrl)
    }
  }, [open, initialUrl])

  function handleSubmit() {
    if (!editor) {
      return
    }

    const url = linkUrl.trim()
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    } else if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run()
    }
    onOpenChange(false)
    setLinkUrl('')
  }

  function handleCancel() {
    onOpenChange(false)
    setLinkUrl('')
  }

  return (
    <Dialog
      open={open}
      onOpenChange={open => {
        onOpenChange(open)
        if (!open) {
          setLinkUrl('')
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
          <DialogTitle>Insertar enlace</DialogTitle>
          <DialogDescription>Ingresa la URL del enlace</DialogDescription>
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
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              placeholder="https://ejemplo.com"
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
