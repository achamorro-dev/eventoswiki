import { v4 as uuidv4 } from 'uuid'

export interface BugCommentProps {
  id: string
  bugId: string
  userId: string
  userName?: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export class BugComment {
  id: string
  bugId: string
  userId: string
  userName?: string
  content: string
  createdAt: Date
  updatedAt: Date

  constructor(props: BugCommentProps) {
    this.id = props.id
    this.bugId = props.bugId
    this.userId = props.userId
    this.userName = props.userName
    this.content = props.content
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  static create(props: { bugId: string; userId: string; content: string }): BugComment {
    const now = new Date()
    return new BugComment({
      ...props,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    })
  }
}
