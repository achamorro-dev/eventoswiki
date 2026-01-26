import { v4 as uuidv4 } from 'uuid'

export enum BugStatus {
  OPEN = 'OPEN',
  IN_REVIEW = 'IN_REVIEW',
  CANCELED = 'CANCELED',
  FIXED = 'FIXED',
}

export enum BugVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export interface BugProps {
  id: string
  userId: string
  userName?: string
  title: string
  description: string
  status: BugStatus
  visibility: BugVisibility
  createdAt: Date
  updatedAt: Date
}

export class Bug {
  id: string
  userId: string
  userName?: string
  title: string
  description: string
  status: BugStatus
  visibility: BugVisibility
  createdAt: Date
  updatedAt: Date

  constructor(props: BugProps) {
    this.id = props.id
    this.userId = props.userId
    this.userName = props.userName
    this.title = props.title
    this.description = props.description
    this.status = props.status
    this.visibility = props.visibility
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  static create(props: {
    userId: string
    title: string
    description: string
    status?: BugStatus
    visibility?: BugVisibility
  }): Bug {
    const now = new Date()
    return new Bug({
      ...props,
      id: uuidv4(),
      status: props.status ?? BugStatus.OPEN,
      visibility: props.visibility ?? BugVisibility.PUBLIC,
      createdAt: now,
      updatedAt: now,
    })
  }

  isPublic(): boolean {
    return this.visibility === BugVisibility.PUBLIC
  }
}
