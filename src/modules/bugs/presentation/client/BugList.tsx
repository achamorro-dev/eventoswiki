'use client'

import { Bug, BugVisibility } from '@/modules/bugs/domain/bug'
import { DateTimeFormat, Datetime } from '@/shared/domain/datetime/datetime'
import { Badge } from '@/ui/badge'
import { Card, CardContent } from '@/ui/card'
import { Urls } from '@/ui/urls/urls'
import BugStatusBadge from './BugStatusBadge'

interface Props {
  initialBugs: Bug[]
}

export default function BugList({ initialBugs }: Props) {
  return (
    <div className="space-y-4">
      {initialBugs.length === 0 ? (
        <p className="text-gray-500">No hay bugs reportados todavía.</p>
      ) : (
        initialBugs.map(bug => (
          <a key={bug.id} href={Urls.BUG_REPORT_DETAILS(bug.id)} className="block">
            <Card className="border transition-shadow hover:shadow-md">
              <CardContent>
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="font-bold text-xl">{bug.title}</h3>
                  <div className="flex gap-2">
                    {bug.visibility === BugVisibility.PRIVATE && <Badge variant="outline">Privado</Badge>}
                    <BugStatusBadge status={bug.status} />
                  </div>
                </div>
                <p className="line-clamp-2 text-muted-foreground">{bug.description}</p>
                <div className="mt-4 flex items-center text-muted-foreground text-sm">
                  <span>
                    {bug.userName ? bug.userName : 'Desconocido'}
                    {' · '}
                    {Datetime.toDateTimeString(bug.createdAt, DateTimeFormat.DD_MMM_YYYY_HH_MM)}
                  </span>
                  {/* Add comments count if available */}
                </div>
              </CardContent>
            </Card>
          </a>
        ))
      )}
    </div>
  )
}
