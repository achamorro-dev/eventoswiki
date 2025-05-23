export class RemoteUser {
  githubId?: string
  googleId?: string
  twitterId?: string
  name: string
  username: string
  email: string | null
  avatar: string

  constructor(user: {
    githubId?: string
    googleId?: string
    twitterId?: string
    name: string
    username: string
    email: string | null
    avatar: string
  }) {
    this.githubId = user.githubId
    this.googleId = user.googleId
    this.twitterId = user.twitterId
    this.name = user.name
    this.username = user.username
    this.email = user.email
    this.avatar = user.avatar
  }
}
