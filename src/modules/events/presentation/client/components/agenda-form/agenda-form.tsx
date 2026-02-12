import { useState } from 'react'
import { Button } from '@/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import { Plus } from '@/ui/icons'
import { CommonElementFormDialog } from './common-element-form-dialog'
import { CommonElementList } from './common-element-list'
import { TrackFormDialog } from './track-form-dialog'
import { TrackList } from './track-list'

export const AgendaForm = () => {
  const [isTrackDialogOpen, setIsTrackDialogOpen] = useState(false)
  const [isCommonElementDialogOpen, setIsCommonElementDialogOpen] = useState(false)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-xl">Agenda</h2>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Tracks</CardTitle>
            <Button onClick={() => setIsTrackDialogOpen(true)} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" /> Añadir Track
            </Button>
          </CardHeader>
          <CardContent>
            <TrackList />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Elementos Comunes</CardTitle>
            <Button onClick={() => setIsCommonElementDialogOpen(true)} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" /> Añadir Elemento Común
            </Button>
          </CardHeader>
          <CardContent>
            <CommonElementList />
          </CardContent>
        </Card>
      </div>

      <TrackFormDialog open={isTrackDialogOpen} onOpenChange={setIsTrackDialogOpen} />

      <CommonElementFormDialog open={isCommonElementDialogOpen} onOpenChange={setIsCommonElementDialogOpen} />
    </div>
  )
}
