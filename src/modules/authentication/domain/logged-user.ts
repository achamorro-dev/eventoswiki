export class LoggedUser {
  id: string
  githubId?: string
  googleId?: string
  name: string
  username: string
  email: string | null
  avatar: string

  constructor(user: {
    id: string
    githubId?: string
    googleId?: string
    name: string
    username: string
    email: string | null
    avatar: string
  }) {
    this.id = user.id
    this.githubId = user.githubId
    this.googleId = user.googleId
    this.name = user.name
    this.username = user.username
    this.email = user.email
    this.avatar = user.avatar
  }
}
