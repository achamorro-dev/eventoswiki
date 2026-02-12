import { ValueObject } from '@/shared/domain/value-object'
import { CommonElement, type CommonElementPrimitives } from './common-element'
import { Track, type TrackPrimitives } from './track'

export interface AgendaProps {
  tracks: Track[]
  commonElements: CommonElement[]
}

export type AgendaPrimitives = {
  tracks: TrackPrimitives[]
  commonElements: CommonElementPrimitives[]
}

export class Agenda extends ValueObject<AgendaProps> {
  static fromPrimitives(primitives: AgendaPrimitives): Agenda {
    return new Agenda({
      tracks: primitives.tracks.map(t => Track.fromPrimitives(t)),
      commonElements: primitives.commonElements.map(e => CommonElement.fromPrimitives(e)),
    })
  }

  toPrimitives(): AgendaPrimitives {
    return {
      tracks: this.value.tracks.map(t => t.toPrimitives()),
      commonElements: this.value.commonElements.map(e => e.toPrimitives()),
    }
  }

  static create(data: { tracks?: Track[]; commonElements?: CommonElement[] }): Agenda {
    return new Agenda({
      tracks: data.tracks || [],
      commonElements: data.commonElements || [],
    })
  }

  getTracks(): Track[] {
    return [...this.value.tracks]
  }

  getCommonElements(): CommonElement[] {
    return [...this.value.commonElements]
  }

  hasTracks(): boolean {
    return this.value.tracks.length > 0
  }

  hasCommonElements(): boolean {
    return this.value.commonElements.length > 0
  }

  hasContent(): boolean {
    return this.hasTracks() || this.hasCommonElements()
  }

  getTrackCount(): number {
    return this.value.tracks.length
  }

  getCommonElementCount(): number {
    return this.value.commonElements.length
  }

  getTotalSessionCount(): number {
    return this.value.tracks.reduce((sum, track) => sum + track.getSessionCount(), 0)
  }

  addTrack(track: Track): void {
    this.value.tracks.push(track)
  }

  removeTrack(trackId: string): void {
    this.value.tracks = this.value.tracks.filter(t => t.getId() !== trackId)
  }

  addCommonElement(element: CommonElement): void {
    this.value.commonElements.push(element)
  }

  removeCommonElement(elementId: string): void {
    this.value.commonElements = this.value.commonElements.filter(e => e.getId() !== elementId)
  }

  getTrackById(trackId: string): Track | undefined {
    return this.value.tracks.find(t => t.getId() === trackId)
  }

  getCommonElementById(elementId: string): CommonElement | undefined {
    return this.value.commonElements.find(e => e.getId() === elementId)
  }

  getAllSessions(): Track[] {
    return this.value.tracks
  }

  getSessionsByDate(date: Date): Array<{ track: Track; sessions: ReturnType<Track['getSessionsByDate']> }> {
    return this.value.tracks
      .map(track => ({
        track,
        sessions: track.getSessionsByDate(date),
      }))
      .filter(item => item.sessions.length > 0)
  }

  getSortedItems(): (Track | CommonElement)[] {
    const allItems: Array<{ item: Track | CommonElement; startTime: Date }> = [
      ...this.value.commonElements.map(e => ({ item: e, startTime: e.getStartsAt() })),
      ...this.value.tracks.map(t => ({ item: t, startTime: this._getEarliestSessionTime(t) })),
    ]

    return allItems.sort((a, b) => a.startTime.getTime() - b.startTime.getTime()).map(item => item.item)
  }

  private _getEarliestSessionTime(track: Track): Date {
    const sessions = track.getSessions()
    if (sessions.length === 0) return new Date(0)
    return sessions.reduce((earliest, session) => {
      return session.getStartsAt() < earliest ? session.getStartsAt() : earliest
    }, sessions[0].getStartsAt())
  }

  getDateRange(): { start: Date | null; end: Date | null } {
    const allDates: Date[] = [
      ...this.value.commonElements.flatMap(e => [e.getStartsAt(), e.getEndsAt()]),
      ...this.value.tracks.flatMap(t => t.getSessions().flatMap(s => [s.getStartsAt(), s.getEndsAt()])),
    ]

    if (allDates.length === 0) {
      return { start: null, end: null }
    }

    return {
      start: new Date(Math.min(...allDates.map(d => d.getTime()))),
      end: new Date(Math.max(...allDates.map(d => d.getTime()))),
    }
  }

  isEmpty(): boolean {
    return !this.hasContent()
  }
}
