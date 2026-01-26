'use client'

import { actions } from 'astro:actions'
import { useState } from 'react'
import { toast } from 'sonner'
import type { FeatureRequest } from '@/modules/feature-requests/domain/feature-request'
import { FeatureRequestStatus } from '@/modules/feature-requests/domain/feature-request'
import type { Primitives } from '@/shared/domain/primitives/primitives'
import { Button } from '@/ui/button'
import { Card, CardContent } from '@/ui/card'
import { ArrowFatUp, ArrowFatUpFill } from '@/ui/icons'
import { Urls } from '@/ui/urls/urls'
import FeatureRequestStatusBadge from './FeatureRequestStatusBadge'

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
          <a key={request.id} href={Urls.FEATURE_REQUEST_DETAILS(request.id)} className="block">
            <Card className="border">
              <CardContent>
                <div className="flex gap-4">
                  <Button
                    variant={request.hasVoted ? 'default' : 'outline'}
                    onClick={e => {
                      e.preventDefault()
                      handleVote(request.id)
                    }}
                    className="flex h-16 w-16 flex-col items-center justify-center gap-1 p-2"
                  >
                    {request.hasVoted ? <ArrowFatUpFill className="h-6 w-6" /> : <ArrowFatUp className="h-6 w-6" />}
                    <span className="font-bold">{request.votesCount}</span>
                  </Button>
                  <div className="flex w-full items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-xl">{request.title}</h3>
                      <p className="mt-2 text-muted-foreground">{request.description}</p>
                    </div>
                    <FeatureRequestStatusBadge status={request.status as FeatureRequestStatus} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </a>
        ))
      )}
    </div>
  )
}
