'use client'

import { actions } from 'astro:actions'
import { useState } from 'react'
import { toast } from 'sonner'
import { DateTimeFormat, Datetime } from '@/shared/domain/datetime/datetime'
import { Button } from '@/ui/button'
import { Card, CardContent } from '@/ui/card'
import { Loader } from '@/ui/icons'
import { Textarea } from '@/ui/textarea'

interface Comment {
  id: string
  userId: string
  userName?: string
  content: string
  createdAt: Date
}

interface Props {
  bugId: string
  initialComments: Comment[]
  currentUserId?: string
}

export default function BugComments({ bugId, initialComments, currentUserId }: Props) {
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      const { error } = await actions.bugs.addBugCommentAction({ bugId, content: newComment })
      if (error) {
        toast.error(error.message)
        return
      }

      // Optimistic update or reload? Optimistic is better but we don't return the comment from action currently.
      // So reload is safer or we adjust action to return comment.
      // For now, let's just reload the page or fetch.
      // Actually standard way is window.location.reload() or re-fetch.
      // Or we can mock the comment since we know the content.
      const mockComment: Comment = {
        id: Math.random().toString(), // temp id
        userId: currentUserId || 'unknown',
        content: newComment,
        createdAt: new Date(),
      }
      setComments(prev => [...prev, mockComment])
      setNewComment('')
      toast.success('Comentario añadido')
      // Ideally we should reload to get real ID and server timestamp
      window.location.reload()
    } catch (_error) {
      toast.error('Error al enviar comentario')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-8">
      <h3 className="mb-4 font-semibold text-lg">Comentarios</h3>
      <div className="mb-6 space-y-6">
        {comments.map(comment => (
          <Card key={comment.id} className="boder-border border">
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{comment.userName || 'Desconocido'}</span>
                <span className="text-muted-foreground text-xs">
                  {Datetime.toDateTimeString(comment.createdAt, DateTimeFormat.DD_MMM_YYYY_HH_MM)}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-muted-foreground text-sm">{comment.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {currentUserId ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Escribe un comentario..."
            className="min-h-[100px]"
          />
          <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
            {isSubmitting ? (
              <>
                <Loader className="mr-2 animate-spin" /> Enviando...
              </>
            ) : (
              'Comentar'
            )}
          </Button>
        </form>
      ) : (
        <p className="text-gray-500">Inicia sesión para comentar.</p>
      )}
    </div>
  )
}
