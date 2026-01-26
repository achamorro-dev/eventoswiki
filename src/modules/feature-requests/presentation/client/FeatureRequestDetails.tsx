'use client'

import { FeatureRequestStatus } from '@/modules/feature-requests/domain/feature-request'
import { DateTimeFormat, Datetime } from '@/shared/domain/datetime/datetime'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/card'
import FeatureRequestCancelButton from './FeatureRequestCancelButton'
import FeatureRequestDeleteButton from './FeatureRequestDeleteButton'
import FeatureRequestStatusBadge from './FeatureRequestStatusBadge'
import FeatureRequestStatusSelect from './FeatureRequestStatusSelect'

interface Props {
  featureRequest: {
    id: string
    title: string
    description: string
    status: FeatureRequestStatus
    createdAt: string
    votesCount: number
    userId: string
  }
  isAdmin: boolean
  currentUserId?: string
}

export default function FeatureRequestDetails({ featureRequest, isAdmin, currentUserId }: Props) {
  const isOwner = currentUserId === featureRequest.userId

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="font-bold text-3xl text-primary">{featureRequest.title}</CardTitle>
        <CardDescription>
          {Datetime.toDateTimeString(new Date(featureRequest.createdAt), DateTimeFormat.DD_MMM_YYYY_HH_MM)} •{' '}
          {featureRequest.votesCount} {featureRequest.votesCount === 1 ? 'voto' : 'votos'}
        </CardDescription>
        <CardAction>
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              <FeatureRequestStatusBadge status={featureRequest.status} />
            </div>

            <div className="flex gap-2">
              {isAdmin && (
                <FeatureRequestStatusSelect
                  featureRequestId={featureRequest.id}
                  currentStatus={featureRequest.status}
                />
              )}
            </div>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="prose mb-8 max-w-none">
          <p className="whitespace-pre-wrap">{featureRequest.description}</p>
        </div>
      </CardContent>

      {isOwner && (
        <CardFooter className="flex justify-end gap-2">
          {!isAdmin && (
            <>
              <FeatureRequestCancelButton featureRequestId={featureRequest.id} currentStatus={featureRequest.status} />
              <FeatureRequestDeleteButton featureRequestId={featureRequest.id} />
            </>
          )}

          {isAdmin && <FeatureRequestDeleteButton featureRequestId={featureRequest.id} />}
        </CardFooter>
      )}
    </Card>
  )
}
