'use client'

import { actions } from 'astro:actions'
import { useState } from 'react'
import { toast } from 'sonner'
import type { FeatureRequest } from '@/modules/feature-requests/domain/feature-request'
import type { Primitives } from '@/shared/domain/primitives/primitives'
import { Button } from '@/ui/button'
import { ArrowFatUp, ArrowFatUpFill } from '@/ui/icons'

interface Props {
  initialRequests: Primitives<FeatureRequest>[]
}

export default function FeatureRequestsList({ initialRequests }: Props) {
  const [requests, setRequests] = useState(initialRequests)

  const handleVote = async (id: string) => {
    try {
      // Optimistic update
      setRequests(prev =>
        prev
          .map(req => {
            if (req.id === id) {
              const hasVoted = !req.hasVoted
              return {
                ...req,
                hasVoted,
                votesCount: hasVoted ? req.votesCount + 1 : req.votesCount - 1,
              }
            }
            return req
          })
          .sort((a, b) => b.votesCount - a.votesCount),
      )

      await actions.featureRequests.toggleFeatureRequestVoteAction({ featureRequestId: id })
    } catch (_error) {
      toast.error('Error al votar')
      // Revert changes on error could be implemented here
    }
  }

  return (
    <div className="space-y-4">
      {requests.length === 0 ? (
        <p className="text-gray-500">No hay solicitudes todavía.</p>
      ) : (
        requests.map(request => (
          <div key={request.id} className="flex gap-4 rounded-lg bg-white p-6 shadow-sm">
            <Button
              variant={request.hasVoted ? 'default' : 'outline'}
              onClick={() => handleVote(request.id)}
              className="flex h-16 w-16 flex-col items-center justify-center gap-1 p-2"
            >
              {request.hasVoted ? <ArrowFatUpFill className="h-6 w-6" /> : <ArrowFatUp className="h-6 w-6" />}
              <span className="font-bold">{request.votesCount}</span>
            </Button>
            <div className="flex-1">
              <h3 className="font-bold text-xl">{request.title}</h3>
              <p className="mt-2 text-gray-600">{request.description}</p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
