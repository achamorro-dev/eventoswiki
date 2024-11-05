export class RemoteUser {
  githubId?: string
  name: string
  username: string
  email: string | null
  avatar: string

  constructor(user: { githubId?: string; name: string; username: string; email: string | null; avatar: string }) {
    this.githubId = user.githubId
    this.name = user.name
    this.username = user.username
    this.email = user.email
    this.avatar = user.avatar
  }
}
