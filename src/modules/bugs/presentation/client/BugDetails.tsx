'use client'

import { BugStatus, BugVisibility } from '@/modules/bugs/domain/bug'
import { DateTimeFormat, Datetime } from '@/shared/domain/datetime/datetime'
import { Badge } from '@/ui/badge'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/card'
import BugCancelButton from './BugCancelButton'
import BugDeleteButton from './BugDeleteButton'
import BugStatusBadge from './BugStatusBadge'
import BugStatusSelect from './BugStatusSelect'

interface Props {
  bug: {
    id: string
    title: string
    description: string
    status: BugStatus
    visibility: BugVisibility
    createdAt: string
    userName?: string
    userId: string
  }
  isAdmin: boolean
  currentUserId?: string
}

export default function BugDetails({ bug, isAdmin, currentUserId }: Props) {
  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="font-bold text-3xl text-primary">{bug.title}</CardTitle>
        <CardDescription>
          {Datetime.toDateTimeString(new Date(bug.createdAt), DateTimeFormat.DD_MMM_YYYY_HH_MM)} • Reportado por:{' '}
          {bug.userName || 'Desconocido'}
        </CardDescription>
        <CardAction>
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              {bug.visibility === BugVisibility.PRIVATE && <Badge variant="outline">Privado</Badge>}
              <BugStatusBadge status={bug.status} />
            </div>
            <div className="flex gap-2">{isAdmin && <BugStatusSelect bugId={bug.id} currentStatus={bug.status} />}</div>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="prose mb-8 max-w-none">
          <p className="whitespace-pre-wrap">{bug.description}</p>
        </div>
      </CardContent>
      {currentUserId === bug.userId && (
        <CardFooter className="flex justify-end gap-2">
          {!isAdmin && <BugCancelButton bugId={bug.id} currentStatus={bug.status} />}
          <BugDeleteButton bugId={bug.id} />
        </CardFooter>
      )}
    </Card>
  )
}
